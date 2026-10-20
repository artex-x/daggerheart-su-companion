#!/usr/bin/env node
// Checks the structure of the ratings data offline. Called by scripts/validate.ps1.

import fs from "node:fs";

const src = fs.readFileSync(process.argv[2], "utf8");
const start = src.indexOf("const ratings = {") + "const ratings = ".length;
const end = src.indexOf("\n    };", start) + "\n    }".length;
const ratings = JSON.parse(src.slice(start, end));
const aliases = JSON.parse(src.match(/const SLUG_ALIASES = Object\.freeze\((\{[\s\S]*?\})\);/)[1]);

const problems = [];
const checkStars = (id, stars) => {
    if (!Number.isInteger(stars) || stars < 0 || stars > 5) problems.push(`${id}: stars must be an integer from 0 to 5, found ${stars}.`);
};
const checkComment = (id, comment) => {
    for (const lang of ["en", "ru"]) {
        const text = comment?.[lang];
        if (typeof text !== "string" || !text.trim()) {
            problems.push(`${id}: the ${lang} comment is empty.`);
            continue;
        }
        if (/[A-Za-z][Ѐ-ӿ]|[Ѐ-ӿ][A-Za-z]/.test(text)) problems.push(`${id}: the ${lang} comment mixes Latin and Cyrillic in one word.`);
        if ((text.match(/«/g) || []).length !== (text.match(/»/g) || []).length) problems.push(`${id}: the ${lang} comment has unpaired quotation marks.`);
    }
    if (/[Ѐ-ӿ]/.test(comment?.en || "")) problems.push(`${id}: the en comment contains Cyrillic text.`);
};

for (const [key, v] of Object.entries(ratings)) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(key)) problems.push(`${key}: the key is not a site slug.`);
    checkStars(key, v.stars);
    if (v.comment) checkComment(key, v.comment);
    for (const f of v.features || []) {
        checkStars(`${key}/${f.name}`, f.stars);
        checkComment(`${key}/${f.name}`, f.comment);
    }
    for (const [stage, s] of Object.entries(v.stages || {})) {
        if (!["foundation", "specialization", "mastery"].includes(stage)) problems.push(`${key}: unknown stage ${stage}.`);
        checkStars(`${key}/${stage}`, s.stars);
        checkComment(`${key}/${stage}`, s.comment);
    }
    if (!v.comment && !v.features && !v.stages) problems.push(`${key}: the rating has no comment.`);
}
for (const [alias, target] of Object.entries(aliases)) {
    if (!ratings[target]) problems.push(`SLUG_ALIASES: ${alias} points to the missing rating ${target}.`);
    if (ratings[alias]) problems.push(`SLUG_ALIASES: ${alias} is also a rating key.`);
}

if (problems.length) {
    console.error(problems.join("\n"));
    process.exit(1);
}
console.log(`Ratings structure is valid: ${Object.keys(ratings).length} entries.`);
