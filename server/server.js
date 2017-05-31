/* eslint-disable no-console, no-magic-numbers */

const express = require("express");
const path = require("path");
const info = require("./info");
const basedir = "production" === process.env.NODE_ENV ? "dist" : "public";

express()

  .get("/health", (request, response) => response.send())
  .get("/info/gen", (request, response) => response.json(info.gen()))
  .get("/info/poll", (request, response) => response.json(info.poll()))

  .use("/", express.static(basedir, {
    maxage: "1y",
    setHeaders: (response, filePath) => {
      if (filePath === path.join(__dirname, `../${basedir}`, "index.html")) {
        response.setHeader("Cache-Control", "no-cache, no-store");
      }
    }
  }))

  .listen(process.env.NODE_PORT || 3000, process.env.NODE_IP || "localhost", () => {
    console.log(`Application worker ${process.pid} started...`);
  });
