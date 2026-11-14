import http from "node:http";
import { createReadStream } from "node:fs";
import { realpath, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const args = process.argv.slice(2);
let port = Number(process.env.TRIO_PREVIEW_PORT || 4178);
if (args.length) {
  if (args.length !== 2 || args[0] !== "--port") throw new Error("Use --port NUMBER");
  port = Number(args[1]);
}
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error("Invalid preview port");
await stat(path.join(root, "index.html"));
const realRoot = await realpath(root);
const types = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif",
  ".ico": "image/x-icon", ".ttf": "font/ttf", ".otf": "font/otf", ".woff": "font/woff", ".woff2": "font/woff2",
  ".zip": "application/zip", ".sha256": "text/plain; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".pdf": "application/pdf"
};

function withinRoot(filename) {
  const relative = path.relative(realRoot, filename);
  return relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative));
}

const server = http.createServer(async (request, response) => {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Cache-Control", "no-store");
  if (!["GET", "HEAD"].includes(request.method)) {
    response.writeHead(405, { Allow: "GET, HEAD" }); response.end("Method not allowed"); return;
  }
  try {
    const pathname = decodeURIComponent((request.url || "/").split(/[?#]/, 1)[0]);
    if (!pathname.startsWith("/") || pathname.includes("\0") || pathname.includes("\\") || pathname.split("/").includes("..")) {
      response.writeHead(403); response.end("Forbidden"); return;
    }
    let filename = path.resolve(realRoot, `.${pathname}`);
    if (!withinRoot(filename)) { response.writeHead(403); response.end("Forbidden"); return; }
    let info = await stat(filename);
    if (info.isDirectory()) { filename = path.join(filename, "index.html"); info = await stat(filename); }
    const resolved = await realpath(filename);
    if (!withinRoot(resolved) || !info.isFile()) { response.writeHead(403); response.end("Forbidden"); return; }
    const extension = path.extname(resolved).toLowerCase();
    response.setHeader("Content-Type", types[extension] || "application/octet-stream");
    response.setHeader("Content-Length", info.size);
    if (extension === ".zip" || extension === ".sha256") {
      response.setHeader("Content-Disposition", `attachment; filename="${path.basename(resolved).replace(/[^\w.-]/g, "_")}"`);
    }
    response.writeHead(200);
    if (request.method === "HEAD") { response.end(); return; }
    const stream = createReadStream(resolved);
    stream.on("error", () => response.destroy());
    stream.pipe(response);
  } catch (error) {
    const status = error instanceof URIError ? 400 : error.code === "ENOENT" || error.code === "ENOTDIR" ? 404 : 500;
    response.writeHead(status); response.end(status === 404 ? "Not found" : "Unable to serve request");
  }
});

server.listen(port, "127.0.0.1", () => console.log(`Trio preview: http://127.0.0.1:${port}`));
for (const signal of ["SIGINT", "SIGTERM"]) process.once(signal, () => server.close(() => process.exit(0)));
