import { readFileSync, writeFileSync } from "node:fs";
let html = readFileSync("dist/index.html", "utf8");
html = html.replace(
  /<script type="module" crossorigin src="([^"]+)"><\/script>/,
  (_, url) =>
    '<script type="module">' +
    readFileSync("dist" + url, "utf8").replaceAll("/images/campbell-campus.jpg", "data:image/jpeg;base64," + readFileSync("public/images/campbell-campus.jpg").toString("base64")).replaceAll("/images/campbell-basketball-2016.jpg", "data:image/jpeg;base64," + readFileSync("public/images/campbell-basketball-2016.jpg").toString("base64")).replace(/<\/script/gi, "<\\/script") +
    "</script>",
);
html = html.replace(
  /<link rel="stylesheet" crossorigin href="([^"]+)">/,
  (_, url) => "<style>" + readFileSync("dist" + url, "utf8") + "</style>",
);
writeFileSync("dist/ascend-demo.html", html);
console.log("Created dist/ascend-demo.html: standalone, no server required.");

