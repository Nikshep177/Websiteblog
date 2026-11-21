const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const host = "127.0.0.1";
const port = 3000;
const root = __dirname;
const pages = new Map([
  ["/", "index.html"],
  ["/index.html", "index.html"],
  ["/myself.html", "myself.html"],
  ["/style.css", "style.css"],
]);
const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
]);

const server = http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method Not Allowed");
    return;
  }

  const pathname = new URL(request.url, "http://localhost").pathname;
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
