/* eslint-disable no-console, no-magic-numbers */

const express = require("express");
const info = require("./info");
const production = "production" === process.env.NODE_ENV;

express()

  .get("/health", (request, response) => response.send())
  .get("/info/gen", (request, response) => response.json(info.gen()))
  .get("/info/poll", (request, response) => response.json(info.poll()))

  .use("/", express.static(production ? "dist" : "public", { maxage: "1y" }))

  .listen(process.env.NODE_PORT || 3000, process.env.NODE_IP || "localhost", () => {
    console.log(`Application worker ${process.pid} started...`);
  });
