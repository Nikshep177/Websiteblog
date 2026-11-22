const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const host = "127.0.0.1";
const port = Number(process.argv[1]) || Number(process.env.PORT) || 3000;
const root = __dirname;
const pages = new Map([
  ["/", "index.html"],
  ["/index.html", "index.html"],
  ["/myself.html", "myself.html"],
  ["/style.css", "style.css"],
  ["/image/my image.jpeg", "image/my image.jpeg"],
  ["/PDF's/blog on propagators.pdf", "PDF's/blog on propagators.pdf"],
  ["/PDF's/Integer partition theorem.- math blog1.pdf", "PDF's/Integer partition theorem.- math blog1.pdf"],
  ["/PDF's/IFT.pdf", "PDF's/IFT.pdf"],
  ["/PDF's/planck distribution and quantum mech.pdf", "PDF's/planck distribution and quantum mech.pdf"],
  ["/PDF's/classical and quantum oscillator.pdf", "PDF's/classical and quantum oscillator.pdf"],
  ["/PDF's/CFT notes series -1.pdf", "PDF's/CFT notes series -1.pdf"],
  ["/PDF's/Carnatic_music_raga_emotions_quest.pdf", "PDF's/Carnatic_music_raga_emotions_quest.pdf"],
  ["/PDF's/astronomy- date of mahbharatha war.pdf", "PDF's/astronomy- date of mahbharatha war.pdf"],
]);
const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".pdf", "application/pdf"],
]);

const server = http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method Not Allowed");
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  } catch {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Bad Request");
    return;
  }

  const file = pages.get(pathname);

  if (!file) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not Found");
    return;
  }

  const filePath = path.join(root, file);
  fs.readFile(filePath, (error, content) => {
    if (error) {
      console.error(`Unable to read ${filePath}:`, error);
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Internal Server Error");
      return;
    }

    response.writeHead(200, {
      "Content-Length": content.length,
      "Content-Type": contentTypes.get(path.extname(file)),
    });
    response.end(request.method === "HEAD" ? undefined : content);
  });
});

server.listen(port, host, () => {
  console.log(`Development server running at http://${host}:${port}`);
});
