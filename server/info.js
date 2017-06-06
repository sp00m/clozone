/* eslint-disable strict */

const os = require("os");
const exec = require("child_process").execSync;
const env = process.env;

exports = {

  gen: () => [{
    name: "Node.js Version",
    value: process.version.replace("v", "")
  }, {
    name: "NPM Version",
    value: exec("npm --version").toString().replace(os.EOL, "")
  }, {
    name: "OS Type",
    value: os.type()
  }, {
    name: "OS Platform",
    value: os.platform()
  }, {
    name: "OS Architecture",
    value: os.arch()
  }, {
    name: "OS Release",
    value: os.release()
  }, {
    name: "CPU Cores",
    value: os.cpus().length
  }, {
    name: "Gear Memory",
    value: `${env.OPENSHIFT_GEAR_MEMORY_MB}MB`
  }, {
    name: "NODE_ENV",
    value: env.NODE_ENV
  }],

  poll: () => [{
    name: "Free Memory",
    value: `${Math.round(os.freemem() / (1024 * 1024))}MB`
  }, {
    name: "Uptime",
    value: `${os.uptime()}s`
  }]

};
