#!/usr/bin/env node
// Compares the userscript ratings with the Borfknuckles guide and the live
// Daggerheart.su catalogs. Requires Node.js 18 or later; no dependencies.
//
//   node scripts/audit/ratings-audit.mjs fetch     downloads sources into .audit/
//   node scripts/audit/ratings-audit.mjs compare   writes .audit/report.md
//   node scripts/audit/ratings-audit.mjs export    writes .audit/comments.json for review
//   node scripts/audit/ratings-audit.mjs all       runs the three steps in order
//   node scripts/audit/ratings-audit.mjs verify    fetches, compares and exits 1 on any problem

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = path.join(ROOT, ".audit");
const USERSCRIPT = path.join(ROOT, "daggerheart-su-companion.user.js");
const SECTIONS = ["class", "subclass", "ancestry", "community", "domain-card", "transformation"];
const LANGS = ["en", "ru"];
const STAGES = ["foundation", "specialization", "mastery"];

// Guide spellings that differ from the site title. Key: guide text, value: site slug.
const GUIDE_NAME_FIXES = {
    "Chain Lighting": "chain-lightning",
    // The errata renamed Swift Step to Serenity; the site keeps the old slug.
    "Serenity": "swift-step",
    "Inferis": "infernis",
    "Executioners Guild": "executioners-guild",
    "Poisoners Guild": "poisoners-guild"
};

// Ratings of this project where the guide gives prose or "(???)" instead of stars.
const EDITORIAL_RATINGS = new Set([
    "assassin", "bard", "brawler", "druid", "guardian", "ranger", "rogue", "seraph", "sorcerer",
    "warlock", "warrior", "witch", "wizard",
    "vampire", "werewolf", "reanimated", "shapeshifter", "ghost", "demigod",
    "syndicate"
]);

// Site cards that the guide does not rate.
const EXPECTED_UNRATED = new Set(["playtest-blood-hunter", "playtest-summoner"]);

// Quoted text in Russian comments that is not a card name and is absent from the site.
const QUOTE_ALLOWLIST = new Set([]);

const out = (...p) => path.join(OUT, ...p);
const readJson = file => JSON.parse(fs.readFileSync(file, "utf8"));
const writeJson = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 1) + "\n");

function decodeEntities(s) {
    const named = { amp: "&", lt: "<", gt: ">", quot: "\"", apos: "'", nbsp: " " };
    return s
        .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
        .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
        .replace(/&([a-z]+);/gi, (m, n) => named[n.toLowerCase()] ?? m);
}

function htmlToText(html) {
    let s = html.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/gi, "");
    s = s.replace(/<\/(p|h[1-6]|li|tr|div)>/gi, "\n").replace(/<br\s*\/?>/gi, "\n");
    s = s.replace(/<\/t[dh]>/gi, " | ").replace(/<[^>]+>/g, "");
    return decodeEntities(s).replace(/\n\s*\n+/g, "\n");
}

function slugify(name) {
    return name.toLowerCase().replace(/[\u2019']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function starsOf(token) {
    const t = token.trim();
    if (t.startsWith("0")) return 0;
    if (t.startsWith("(???)")) return null;
    return (t.match(/\*/g) || []).length;
}

// ---------------------------------------------------------------- userscript

function loadUserscript() {
    const src = fs.readFileSync(USERSCRIPT, "utf8");
    const start = src.indexOf("const ratings = {") + "const ratings = ".length;
    const end = src.indexOf("\n    };", start) + "\n    }".length;
    const ratings = JSON.parse(src.slice(start, end));
    const aliasBlock = src.match(/const SLUG_ALIASES = Object\.freeze\((\{[\s\S]*?\})\);/);
    const aliases = aliasBlock ? JSON.parse(aliasBlock[1]) : {};
    const guideUrl = src.match(/const GUIDE_URL = "([^"]+)"/)[1];
    return { ratings, aliases, guideUrl };
}

// Mirrors findSlug() in the userscript: returns the rating key a site slug resolves to.
function ratingKeyFor(siteSlug, ratings, aliases) {
    for (const candidate of [siteSlug, siteSlug.replace(/^playtest-/, "")]) {
        const canonical = aliases[candidate] || candidate;
        if (ratings[canonical]) return canonical;
        const m = candidate.match(/^(.*)-(foundation|specialization|mastery)$/);
        if (m && ratings[m[1]]?.stages?.[m[2]]) return m[1];
    }
    return null;
}

// ---------------------------------------------------------------- fetch

async function download(url, file) {
    const res = await fetch(url, { headers: { "user-agent": "daggerheart-su-companion ratings audit" } });
    if (!res.ok) throw new Error(`The download failed with HTTP ${res.status}: ${url}`);
    fs.writeFileSync(file, await res.text());
    console.log(`saved ${path.relative(ROOT, file)}`);
}

function parseCards(html) {
    const cards = {};
    const starts = [...html.matchAll(/<div\b[^>]*\bclass="card\b[^"]*"[^>]*>/g)];
    starts.forEach((m, i) => {
        const id = m[0].match(/\bid="([^"]+)"/);
        if (!id) return;
        const chunk = html.slice(m.index + m[0].length, i + 1 < starts.length ? starts[i + 1].index : undefined);
        const title = chunk.match(/<p class="title[^"]*">([\s\S]*?)<\/p>/);
        cards[id[1]] ??= {
            title: title ? decodeEntities(title[1].replace(/<[^>]+>/g, "")).trim() : null,
            text: decodeEntities(chunk.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim().slice(0, 3000)
        };
    });
    return cards;
}

async function cmdFetch() {
    const { guideUrl } = loadUserscript();
    fs.mkdirSync(out("site"), { recursive: true });
    await download(guideUrl, out("guide.html"));
    fs.writeFileSync(out("guide.txt"), htmlToText(fs.readFileSync(out("guide.html"), "utf8")));
    await download("https://ru.daggerheart.su/rule/terms-translation", out("terms.html"));
    fs.writeFileSync(out("terms.txt"), htmlToText(fs.readFileSync(out("terms.html"), "utf8")));
    for (const lang of LANGS) {
        const cards = {};
        for (const section of SECTIONS) {
            const file = out("site", `${lang}-${section}.html`);
            await download(`https://${lang}.daggerheart.su/${section}`, file);
            for (const [slug, card] of Object.entries(parseCards(fs.readFileSync(file, "utf8")))) {
                cards[slug] = { section, ...card };
            }
        }
        writeJson(out(`cards-${lang}.json`), cards);
        console.log(`${lang}: ${Object.keys(cards).length} cards`);
    }
}

// ---------------------------------------------------------------- guide parser

// The guide writes "Bone Touched" and "Executioners Guild"; the site writes "Bone-Touched".
function normalizeName(s) {
    return s.toLowerCase().replace(/[\u2010-\u2015\-\u00a0]/g, " ").replace(/[\u2019']/g, "").replace(/\s+/g, " ").trim();
}

function parseGuide(text, siteEn) {
    const titleToSlug = new Map();
    for (const [slug, card] of Object.entries(siteEn)) {
        if (!card.title) continue;
        const base = slug.replace(/-(foundation|specialization|mastery)$/, "");
        if (!titleToSlug.has(normalizeName(card.title))) titleToSlug.set(normalizeName(card.title), base);
    }
    for (const [name, slug] of Object.entries(GUIDE_NAME_FIXES)) titleToSlug.set(normalizeName(name), slug);
    const titles = [...titleToSlug.keys()].sort((a, b) => b.length - a.length);
    const resolve = name => titleToSlug.get(normalizeName(name)) || slugify(name);

    // Finds the earliest site title in a line; the longest title wins a tie.
    const firstTitle = line => {
        const low = normalizeName(line);
        let best = null;
        for (const t of titles) {
            const i = low.search(new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`));
            if (i >= 0 && (!best || i < best.i)) best = { i, slug: titleToSlug.get(t) };
        }
        return best?.slug;
    };

    const lines = text.split("\n").map(l => l.trim());
    const guide = {};
    const add = (slug, entry, lineNo) => { guide[slug] = { ...entry, line: lineNo }; };
    const ratingStart = lines.findIndex(l => l === "Star Rating System");
    let section = null;
    let subclass = null;
    lines.forEach((line, i) => {
        if (i <= ratingStart) return;
        if (/^[A-Z]+ Level \d+$/.test(line)) section = "domain";
        else if (line === "Communities") section = "community";
        else if (line === "Ancestries" && section === "community") section = "ancestry";
        else if (line === "Subclasses" && section === "ancestry") section = "subclass";
        else if (line === "Transformation Cards") section = "transformation";
        else if (line === "Playtest Material") section = "playtest";
        const lineNo = i + 1;
        if (section === "domain") {
            const m = line.match(/^(\*{1,5}\??|0 stars)\s+(.*)$/);
            const slug = m && firstTitle(m[2]);
            if (slug) add(slug, { section, stars: starsOf(m[1]) }, lineNo);
        } else if (section === "community") {
            for (const m of line.matchAll(/\((\*{1,4})\)\s*([A-Z][a-z]+borne)/g)) {
                add(resolve(m[2]), { section, stars: starsOf(m[1]) }, lineNo);
            }
        } else if (section === "ancestry") {
            const m = line.match(/^(\*{1,4})(?:\s*\(\?\?\?\))?\s+([A-Z][A-Za-z]+):\s*(.*)$/);
            if (!m) return;
            // Feature ratings are read in order: top feature first, bottom feature second.
            const features = [...m[3].matchAll(/\((\*{1,4}|0 stars)\)/g)].map(f => starsOf(f[1]));
            add(resolve(m[2]), { section, stars: starsOf(m[1]), features, uncertain: /\(\?\?\?\)/.test(line) }, lineNo);
        } else if (section === "subclass") {
            const stage = line.match(/^(\*{1,5}|\(\?\?\?\))[^A-Za-z]*(?:yes 5 \| )?(Foundation|Specialization|Mastery):/);
            if (stage && subclass) {
                guide[subclass].stages[stage[2].toLowerCase()] = starsOf(stage[1]);
                return;
            }
            const head = line.match(/^(\*{1,4}|\(\?\?\?\))\s+([^:]{3,40}):$/);
            if (head) {
                subclass = resolve(head[2]);
                add(subclass, { section, stars: starsOf(head[1]), stages: {} }, lineNo);
            }
        }
    });
    return guide;
}

// ---------------------------------------------------------------- compare

function cmdCompare() {
    const { ratings, aliases } = loadUserscript();
    const siteEn = readJson(out("cards-en.json"));
    const guide = parseGuide(fs.readFileSync(out("guide.txt"), "utf8"), siteEn);
    writeJson(out("guide-ratings.json"), guide);

    // Guide slugs are site slugs; map them to rating keys the same way the userscript does.
    const guideByKey = {};
    for (const [slug, entry] of Object.entries(guide)) {
        const key = ratingKeyFor(slug, ratings, aliases) || ratingKeyFor("playtest-" + slug, ratings, aliases) || slug;
        guideByKey[key] = { ...entry, guideSlug: slug };
    }

    const rows = { stars: [], features: [], stages: [], notInGuide: [], notInScript: [], deadKeys: [], unratedCards: [], staleAliases: [], unknownQuotes: [] };
    for (const [key, v] of Object.entries(ratings)) {
        const g = guideByKey[key];
        if (!g) { rows.notInGuide.push(`${key} = ${v.stars}`); continue; }
        if (g.stars !== v.stars) rows.stars.push(`${key}: script ${v.stars}, guide ${g.stars ?? "(???)"} (guide line ${g.line})`);
        (v.features || []).forEach((f, i) => {
            if (g.features?.[i] !== f.stars) rows.features.push(`${key} / ${f.name}: script ${f.stars}, guide ${g.features?.[i] ?? "missing"}`);
        });
        for (const st of STAGES) {
            const s = v.stages?.[st]?.stars;
            if (s !== undefined && g.stages?.[st] !== s) rows.stages.push(`${key} / ${st}: script ${s}, guide ${g.stages?.[st] ?? "missing"}`);
        }
    }
    for (const [key, g] of Object.entries(guideByKey)) {
        if (!ratings[key]) rows.notInScript.push(`${g.guideSlug} = ${g.stars} (guide line ${g.line})`);
    }
    const resolved = new Set(Object.keys(siteEn).map(s => ratingKeyFor(s, ratings, aliases)).filter(Boolean));
    for (const key of Object.keys(ratings)) if (!resolved.has(key)) rows.deadKeys.push(key);
    for (const [slug, card] of Object.entries(siteEn)) {
        if (!/-(specialization|mastery)$/.test(slug) && !ratingKeyFor(slug, ratings, aliases)) {
            rows.unratedCards.push(`${card.section}/${slug} (${card.title})`);
        }
    }

    for (const alias of Object.keys(aliases)) {
        if (!siteEn[alias] && !siteEn["playtest-" + alias]) rows.staleAliases.push(alias);
    }
    rows.unknownQuotes = unknownRussianQuotes(ratings);

    const section = (title, help, list) => `## ${title}\n\n${help}\n\n${list.length ? list.map(x => `- ${x}`).join("\n") : "None."}\n`;
    const report = [
        `# Ratings audit report\n\nGenerated ${new Date().toISOString()} from \`.audit/\`. Guide entries parsed: ${Object.keys(guide).length}. Script entries: ${Object.keys(ratings).length}.\n`,
        section("Star differences", "The overall star value differs from the guide.", rows.stars),
        section("Ancestry feature differences", "Feature ratings are compared by position: top feature, then bottom feature.", rows.features),
        section("Subclass stage differences", "Foundation, Specialization or Mastery differs.", rows.stages),
        section("Script entries without a guide star rating", "The guide rates these in prose only, or not at all. Confirm the source of each value.", rows.notInGuide),
        section("Guide ratings missing from the script", "Add a rating, or add the spelling to GUIDE_NAME_FIXES if the parser matched the wrong name.", rows.notInScript),
        section("Dead rating keys", "No site card resolves to these keys. Add a SLUG_ALIASES entry or rename the key.", rows.deadKeys),
        section("Site cards without a rating", "Ratable site cards with no rating key. Many are expected (playtest classes, cards the guide does not rate).", rows.unratedCards),
        section("Stale slug aliases", "SLUG_ALIASES entries whose site slug no longer exists.", rows.staleAliases),
        section("Unknown quoted Russian names", "Text in «» in a Russian comment that is not in any site card or the terminology page.", rows.unknownQuotes)
    ].join("\n");
    fs.writeFileSync(out("report.md"), report);
    console.log(report);
    return rows;
}

// Returns quoted Russian names that appear nowhere in the site cards or the terminology page.
function unknownRussianQuotes(ratings) {
    const corpus = normalizeName([
        ...Object.values(readJson(out("cards-ru.json"))).flatMap(c => [c.title || "", c.text]),
        fs.readFileSync(out("terms.txt"), "utf8")
    ].join("\n")).replace(/ё/g, "е");
    const comments = Object.entries(ratings).flatMap(([key, v]) => [
        [key, v.comment?.ru],
        ...(v.features || []).map(f => [`${key}/${f.name}`, f.comment?.ru]),
        ...STAGES.map(st => [`${key}/${st}`, v.stages?.[st]?.comment?.ru])
    ]).filter(([, ru]) => ru);
    const unknown = [];
    for (const [id, ru] of comments) {
        for (const m of ru.matchAll(/«([^»]+)»/g)) {
            const name = normalizeName(m[1]).replace(/ё/g, "е");
            // Compare the first five letters of each word, so that an inflected name still matches.
            const stem = new RegExp(name.split(" ").map(w => w.slice(0, 5).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("[а-я]* "), "i");
            if (!QUOTE_ALLOWLIST.has(m[1]) && !stem.test(corpus)) unknown.push(`${id}: «${m[1]}»`);
        }
    }
    return unknown;
}

// ---------------------------------------------------------------- verify

// Fails when the ratings no longer match the live site or the guide.
async function cmdVerify() {
    await cmdFetch();
    const rows = cmdCompare();
    const problems = [
        ...rows.stars.filter(x => !EDITORIAL_RATINGS.has(x.split(":")[0])),
        ...rows.features, ...rows.stages.filter(x => !EDITORIAL_RATINGS.has(x.split(" / ")[0])),
        ...rows.notInGuide.filter(x => !EDITORIAL_RATINGS.has(x.split(" = ")[0])).map(x => `no guide rating: ${x}`),
        ...rows.notInScript.map(x => `guide rating missing from script: ${x}`),
        ...rows.deadKeys.map(x => `dead rating key: ${x}`),
        ...rows.unratedCards.filter(x => !EXPECTED_UNRATED.has(x.split(" ")[0].split("/")[1])).map(x => `unrated site card: ${x}`),
        ...rows.staleAliases.map(x => `stale alias: ${x}`),
        ...rows.unknownQuotes.map(x => `unknown quoted name: ${x}`)
    ];
    if (problems.length) {
        console.error(`\nVerification failed with ${problems.length} problem(s):\n` + problems.map(p => `- ${p}`).join("\n"));
        process.exit(1);
    }
    console.log("\nVerification passed: ratings match the guide and every key resolves to a live site card.");
}

// ---------------------------------------------------------------- export

function cmdExport() {
    const { ratings, aliases } = loadUserscript();
    const site = Object.fromEntries(LANGS.map(l => [l, readJson(out(`cards-${l}.json`))]));
    const siteSlugFor = {};
    for (const slug of Object.keys(site.en)) {
        const key = ratingKeyFor(slug, ratings, aliases);
        if (key) (siteSlugFor[key] ??= []).push(slug);
    }
    const card = (key, stage) => {
        const slugs = siteSlugFor[key] || [];
        const slug = slugs.find(s => stage && s.endsWith("-" + stage)) || slugs.find(s => !/-(specialization|mastery)$/.test(s)) || slugs[0];
        if (!slug) return {};
        return { siteSlug: slug, enTitle: site.en[slug].title, ruTitle: site.ru[slug]?.title, enText: site.en[slug].text, ruText: site.ru[slug]?.text };
    };
    const records = [];
    for (const [key, v] of Object.entries(ratings)) {
        if (v.comment) records.push({ id: key, stars: v.stars, en: v.comment.en, ru: v.comment.ru, ...card(key) });
        for (const f of v.features || []) records.push({ id: `${key}/${f.name}`, stars: f.stars, en: f.comment.en, ru: f.comment.ru, ...card(key) });
        for (const st of STAGES) {
            const s = v.stages?.[st];
            if (s?.comment) records.push({ id: `${key}/${st}`, stars: s.stars, en: s.comment.en, ru: s.comment.ru, ...card(key, st) });
        }
    }
    writeJson(out("comments.json"), records);
    console.log(`${records.length} comment records written to .audit/comments.json`);
}

const commands = { fetch: cmdFetch, compare: cmdCompare, export: cmdExport, verify: cmdVerify };
const cmd = process.argv[2];
if (cmd === "all") {
    await cmdFetch();
    cmdCompare();
    cmdExport();
} else if (commands[cmd]) {
    await commands[cmd]();
} else {
    console.error("Usage: node scripts/audit/ratings-audit.mjs <fetch|compare|export|all|verify>");
    process.exit(2);
}
