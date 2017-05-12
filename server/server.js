const http = require("http");
const fs = require("fs");
const path = require("path");
const contentTypes = require("./utils/content-types");
const sysInfo = require("./utils/sys-info");
const env = process.env;
const production = env.NODE_ENV === "production";

const server = http.createServer((req, res) => {

  const url = req.url + (req.url === "/" ? "index.html" : "");

  // IMPORTANT: Your application HAS to respond to GET /health with status 200
  //            for OpenShift health monitoring

  if (url === "/health") {
    res.writeHead(200);
    res.end();
  } else if (url === "/info/gen" || url === "/info/poll") {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-cache, no-store");
    res.end(JSON.stringify(sysInfo[url.slice(6)]()));
  } else {
    fs.readFile((production ? "./dist" : "./public") + url, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Not found");
      } else {
        const ext = path.extname(url).slice(1);
        if (contentTypes[ext]) {
          res.setHeader("Content-Type", contentTypes[ext]);
        }
        if (ext === "html") {
          res.setHeader("Cache-Control", "no-cache, no-store");
        }
        res.end(data);
      }
    });
  }
});

server.listen(env.NODE_PORT || 3000, env.NODE_IP || "localhost", () => {
  console.log(`Application worker ${process.pid} started...`);
});
