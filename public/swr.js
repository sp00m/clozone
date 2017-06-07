/* eslint-disable no-console, default-case */

((window) => {

  "use strict";

  const serviceWorkerFilename = `clozone-${window.clozone.version}.sw.js`;

  const registerServiceWorker = () => {
    window.addEventListener("load", () => {
      window.navigator.serviceWorker.register(serviceWorkerFilename).catch((error) => {
        console.error("Error during service worker registration:", error);
      });
    });
  };

  if (window.clozone.production) {
    if ("serviceWorker" in window.navigator) {
      registerServiceWorker();
    } else {
      console.warn("Service workers not available.");
    }
  } else {
    console.log("Not in production: service worker not set up.");
  }

})(window);
