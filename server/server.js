/* eslint-disable no-console, no-magic-numbers, strict */

const express = require("express");
const version = require("../package.json").version;
const info = require("./info");
const production = "production" === process.env.NODE_ENV;
const basedir = production ? "dist" : "public";

const IS_CACHE_BUSTED = new RegExp(`-${version.replace(".", "\\.")}(?:\\.[a-z0-9]+)+$`);

const staticOptions = {
  setHeaders: (response, filePath) => {
    response.setHeader("Cache-Control", (IS_CACHE_BUSTED.test(filePath))
      ? `max-age=${365 * 24 * 60 * 60}`
      : "no-cache");
  }
};

express()

  .get("/health", (request, response) => response.send())
  .get("/info/gen", (request, response) => response.json(info.gen()))
  .get("/info/poll", (request, response) => response.json(info.poll()))

  .use("/", express.static(basedir, staticOptions))

  .listen(process.env.PORT || 80, "0.0.0.0", () => {
    console.log(`Application worker ${process.pid} started...`);
  });
