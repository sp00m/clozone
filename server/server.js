/* eslint-disable no-console */

const http = require("http");
const fs = require("fs");
const path = require("path");
const contentTypes = require("./utils/content-types");
const sysInfo = require("./utils/sys-info");
const production = "production" === process.env.NODE_ENV;
const defaultPort = 3000;
const status = {
  ok: 200,
  notFound: 404
};

const server = http.createServer((req, res) => {

  const url = req.url + ("/" === req.url ? "index.html" : "");

  // keep GET /health returning 200, use by OpenShift:
  if ("/health" === url) {
    res.writeHead(status.ok);
    res.end();
  } else if ("/info/gen" === url || "/info/poll" === url) {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-cache, no-store");
    res.end(JSON.stringify(sysInfo[url.slice("/info/".length)]()));
  } else {
    fs.readFile((production ? "./dist" : "./public") + url, (err, data) => {
      if (err) {
        res.writeHead(status.notFound);
        res.end("Not found");
      } else {
        const ext = path.extname(url).slice(1);
        if (contentTypes[ext]) {
          res.setHeader("Content-Type", contentTypes[ext]);
        }
        if ("html" === ext) {
          res.setHeader("Cache-Control", "no-cache, no-store");
        }
        res.end(data);
      }
    });
  }
});

server.listen(process.env.NODE_PORT || defaultPort, process.env.NODE_IP || "localhost", () => {
  console.log(`Application worker ${process.pid} started...`);
});
