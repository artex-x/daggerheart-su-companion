#!/usr/bin/env node
// Merges .audit/findings-*.json from the comment reviewers into .audit/findings.json
// and .audit/findings.md, sorted by severity, and drops entries whose `current`
// text is no longer present in the comment.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", ".audit");
const comments = JSON.parse(fs.readFileSync(path.join(OUT, "comments.json"), "utf8"));
const byId = new Map(comments.map(c => [c.id, c]));
const order = { high: 0, medium: 1, low: 2 };

const findings = fs.readdirSync(OUT)
    .filter(f => /^findings-\d+\.json$/.test(f))
    .flatMap(f => JSON.parse(fs.readFileSync(path.join(OUT, f), "utf8")));
const stale = findings.filter(f => !byId.get(f.id)?.[f.field]?.includes(f.current));
const valid = findings.filter(f => !stale.includes(f))
    .sort((a, b) => order[a.severity] - order[b.severity] || a.id.localeCompare(b.id));

fs.writeFileSync(path.join(OUT, "findings.json"), JSON.stringify(valid, null, 1) + "\n");
const md = ["# Comment review findings", "",
    `${valid.length} findings: ${["high", "medium", "low"].map(s => `${valid.filter(f => f.severity === s).length} ${s}`).join(", ")}. ${stale.length} dropped as stale.`, ""];
for (const sev of ["high", "medium", "low"]) {
    md.push(`## ${sev[0].toUpperCase() + sev.slice(1)}`, "");
    for (const f of valid.filter(x => x.severity === sev)) {
        md.push(`### ${f.id} (${f.field}, ${f.type})`, "", f.reason, "", "Current:", "", "```text", f.current, "```", "", "Proposed:", "", "```text", f.proposed, "```", "");
    }
}
fs.writeFileSync(path.join(OUT, "findings.md"), md.join("\n"));
console.log(md[2]);
