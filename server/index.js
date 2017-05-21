/* eslint-disable no-console */

const cluster = require("cluster");
const stopSignals = [
  "SIGHUP", "SIGINT", "SIGQUIT", "SIGILL", "SIGTRAP", "SIGABRT",
  "SIGBUS", "SIGFPE", "SIGUSR1", "SIGSEGV", "SIGUSR2", "SIGTERM"
];
const production = "production" === process.env.NODE_ENV;
const defaultWorkerCount = 4;

let stopping = false;

cluster.on("disconnect", () => {
  if (!production) {
    process.exit(1);
  } else if (!stopping) {
    cluster.fork();
  }
});

if (cluster.isMaster) {
  const workerCount = process.env.NODE_CLUSTER_WORKERS || defaultWorkerCount;
  console.log(`Starting ${workerCount} workers...`);
  for (let i = 0; i < workerCount; i++) {
    cluster.fork();
  }
  if (production) {
    stopSignals.forEach((signal) => process.on(signal, () => {
      console.log(`Got ${signal}, stopping workers...`);
      stopping = true;
      cluster.disconnect(() => {
        console.log("All workers stopped, exiting.");
        process.exit(0);
      });
    }));
  }
} else {
  require("./server");
}
