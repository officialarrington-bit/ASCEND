import { readFileSync, writeFileSync } from "node:fs";
let html = readFileSync("dist/index.html", "utf8");
const images = [
  ["chase-arrington-headshot.webp", "image/webp"],
  ["campbell-volleyball-champions.webp", "image/webp"],
  ["kamden-sixkiller-2026.webp", "image/webp"],
  ["campbell-athletics-c.svg", "image/svg+xml"],
];
html = html.replace(
  /<script type="module" crossorigin src="([^"]+)"><\/script>/,
  (_, url) =>
    '<script type="module">' +
    images.reduce((js, [name, mime]) => js.replaceAll("/images/" + name, `data:${mime};base64,` + readFileSync("public/images/" + name).toString("base64")), readFileSync("dist" + url, "utf8")).replace(/<\/script/gi, "<\\/script") +
    "</script>",
);
html = html.replace(
  /<link rel="stylesheet" crossorigin href="([^"]+)">/,
  (_, url) => "<style>" + readFileSync("dist" + url, "utf8") + "</style>",
);
writeFileSync("dist/ascend-demo.html", html);
console.log("Created dist/ascend-demo.html: standalone, no server required.");

