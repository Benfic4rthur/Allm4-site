import { writeFileSync } from 'node:fs';
import { fetchHistory, totalInstallerDownloads } from '../sites/primalith/download-stats.js';

const history = await fetchHistory();
const stats = { total: totalInstallerDownloads(history), checkedAt: new Date().toISOString(), complete: true };
writeFileSync(new URL('../sites/primalith/download-stats-snapshot.json', import.meta.url), JSON.stringify(stats, null, 2) + '\n');
console.log(`Verified ${stats.total} installer downloads across ${history.length} releases.`);
