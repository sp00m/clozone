/* eslint-disable no-console, no-magic-numbers, strict */

const express = require("express");
const path = require("path");
const info = require("./info");
const production = "production" === process.env.NODE_ENV;
const basedir = production ? "dist" : "public";

const staticOptions = production ? {
  maxage: "1y",
  setHeaders: (response, filepath) => {
    if (filepath === path.join(__dirname, `../${basedir}`, "index.html")) {
      response.setHeader("Cache-Control", "no-cache, no-store");
    }
  }
} : {};

express()

  .get("/health", (request, response) => response.send())
  .get("/info/gen", (request, response) => response.json(info.gen()))
  .get("/info/poll", (request, response) => response.json(info.poll()))

  .use("/", express.static(basedir, staticOptions))

  .listen(process.env.NODE_PORT || 3000, process.env.NODE_IP || "0.0.0.0", () => {
    console.log(`Application worker ${process.pid} started...`);
  });
