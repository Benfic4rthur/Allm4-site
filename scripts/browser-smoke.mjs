import { mkdir, writeFile } from "node:fs/promises";

const siteUrl = process.argv[2] ?? "http://127.0.0.1:4173/";
const debuggerUrl = process.argv[3] ?? "http://127.0.0.1:9222";
const outputDir = process.argv[4] ?? "/tmp/allm4-browser";

const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function json(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${url}`);
  }
  return response.json();
}

const targets = await json(`${debuggerUrl}/json/list`);
const target = targets.find((entry) => entry.type === "page");

if (!target?.webSocketDebuggerUrl) {
  throw new Error("No Chrome page target available for the smoke test.");
}

const socket = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
const listeners = new Map();
let nextId = 1;

const opened = new Promise((resolve, reject) => {
  const timeout = setTimeout(
    () => reject(new Error("Timed out connecting to Chrome DevTools.")),
    10_000,
  );

  socket.addEventListener(
    "open",
    () => {
      clearTimeout(timeout);
      resolve();
    },
    { once: true },
  );

  socket.addEventListener(
    "error",
    () => {
      clearTimeout(timeout);
      reject(new Error("Chrome DevTools WebSocket failed."));
    },
    { once: true },
  );
});

socket.addEventListener("message", (event) => {
  const message = JSON.parse(String(event.data));

  if (message.id) {
    const task = pending.get(message.id);
    if (!task) return;

    pending.delete(message.id);
    if (message.error) {
      task.reject(
        new Error(
          `${task.method}: ${message.error.message ?? "unknown CDP error"}`,
        ),
      );
    } else {
      task.resolve(message.result);
    }
    return;
  }

  const callbacks = listeners.get(message.method);
  if (!callbacks) return;

  for (const callback of callbacks) {
    callback(message.params ?? {});
  }
});

await opened;

function command(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject, method });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

function on(method, callback) {
  const callbacks = listeners.get(method) ?? new Set();
  callbacks.add(callback);
  listeners.set(method, callbacks);

  return () => {
    callbacks.delete(callback);
    if (callbacks.size === 0) listeners.delete(method);
  };
}

function once(method, timeoutMs = 15_000) {
  return new Promise((resolve, reject) => {
    const cleanup = on(method, (params) => {
      clearTimeout(timeout);
      cleanup();
      resolve(params);
    });

    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error(`Timed out waiting for ${method}.`));
    }, timeoutMs);
  });
}

await Promise.all([
  command("Page.enable"),
  command("Runtime.enable"),
  command("Log.enable"),
]);

const browserErrors = [];

on("Runtime.exceptionThrown", ({ exceptionDetails }) => {
  browserErrors.push(
    `Uncaught exception: ${exceptionDetails?.text ?? "unknown exception"}`,
  );
});

on("Runtime.consoleAPICalled", ({ type, args = [] }) => {
  if (type !== "error") return;
  const text = args
    .map((entry) => entry.value ?? entry.description ?? "")
    .join(" ")
    .trim();
  browserErrors.push(`console.error: ${text || "unknown error"}`);
});

on("Log.entryAdded", ({ entry }) => {
  if (entry?.level !== "error") return;
  browserErrors.push(
    `${entry.source ?? "browser"}: ${entry.text ?? "unknown error"}`,
  );
});

await mkdir(outputDir, { recursive: true });

const viewports = [
  { name: "desktop", width: 1440, height: 1000, mobile: false },
  { name: "tablet", width: 820, height: 1180, mobile: false },
  { name: "mobile", width: 390, height: 844, mobile: true },
];

const results = [];

for (const viewport of viewports) {
  browserErrors.length = 0;

  await command("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.mobile,
  });

  const loaded = once("Page.loadEventFired");
  await command("Page.navigate", { url: siteUrl });
  await loaded;
  await wait(500);

  const evaluation = await command("Runtime.evaluate", {
    expression: `(() => {
      const root = document.documentElement;
      const body = document.body;
      const main = document.querySelector("main");
      return {
        title: document.title,
        scrollWidth: root.scrollWidth,
        clientWidth: root.clientWidth,
        bodyScrollWidth: body?.scrollWidth ?? 0,
        mainHeight: main?.getBoundingClientRect().height ?? 0,
        readyState: document.readyState,
      };
    })()`,
    returnByValue: true,
  });

  const metrics = evaluation?.result?.value;

  if (!metrics || metrics.readyState !== "complete") {
    throw new Error(`${viewport.name}: page did not reach a complete state.`);
  }

  if (metrics.scrollWidth > metrics.clientWidth + 1) {
    throw new Error(
      `${viewport.name}: horizontal overflow detected (${metrics.scrollWidth}px > ${metrics.clientWidth}px).`,
    );
  }

  if (metrics.mainHeight <= 0) {
    throw new Error(`${viewport.name}: main content has no rendered height.`);
  }

  if (browserErrors.length > 0) {
    throw new Error(
      `${viewport.name}: browser errors detected:\n${browserErrors.join("\n")}`,
    );
  }

  const screenshot = await command("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
    fromSurface: true,
  });

  await writeFile(
    `${outputDir}/${viewport.name}.png`,
    Buffer.from(screenshot.data, "base64"),
  );

  results.push({
    viewport: viewport.name,
    width: viewport.width,
    height: viewport.height,
    title: metrics.title,
    scrollWidth: metrics.scrollWidth,
    clientWidth: metrics.clientWidth,
  });
}

browserErrors.length = 0;

await command("Emulation.setDeviceMetricsOverride", {
  width: 1440,
  height: 1000,
  deviceScaleFactor: 1,
  mobile: false,
});

const localIaLoaded = once("Page.loadEventFired");
await command("Page.navigate", { url: new URL("local-ia/", siteUrl).toString() });
await localIaLoaded;
await wait(500);

const localIaEvaluation = await command("Runtime.evaluate", {
  expression: `(() => {
    const root = document.documentElement;
    const main = document.querySelector("main");
    return {
      title: document.title,
      scrollWidth: root.scrollWidth,
      clientWidth: root.clientWidth,
      mainHeight: main?.getBoundingClientRect().height ?? 0,
      readyState: document.readyState,
    };
  })()`,
  returnByValue: true,
});

const localIaMetrics = localIaEvaluation?.result?.value;

if (!localIaMetrics || localIaMetrics.readyState !== "complete") {
  throw new Error("local-ia: page did not reach a complete state.");
}

if (localIaMetrics.scrollWidth > localIaMetrics.clientWidth + 1) {
  throw new Error(
    `local-ia: horizontal overflow detected (${localIaMetrics.scrollWidth}px > ${localIaMetrics.clientWidth}px).`,
  );
}

if (localIaMetrics.mainHeight <= 0) {
  throw new Error("local-ia: main content has no rendered height.");
}

if (browserErrors.length > 0) {
  throw new Error(
    `local-ia: browser errors detected:\n${browserErrors.join("\n")}`,
  );
}

const localIaScreenshot = await command("Page.captureScreenshot", {
  format: "png",
  captureBeyondViewport: false,
  fromSurface: true,
});

await writeFile(
  `${outputDir}/local-ia-desktop.png`,
  Buffer.from(localIaScreenshot.data, "base64"),
);

results.push({
  viewport: "local-ia-desktop",
  width: 1440,
  height: 1000,
  title: localIaMetrics.title,
  scrollWidth: localIaMetrics.scrollWidth,
  clientWidth: localIaMetrics.clientWidth,
});

socket.close();

console.log("Browser smoke test passed:");
for (const result of results) {
  console.log(
    `- ${result.viewport}: ${result.width}x${result.height}, viewport ${result.clientWidth}px, scroll ${result.scrollWidth}px, title "${result.title}"`,
  );
}
