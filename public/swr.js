/* eslint-disable no-console */

((window) => {

  "use strict";

  const registerServiceWorker = () => {
    window.addEventListener("load", () => {
      window.navigator.serviceWorker.register("clozone.sw.js").catch((error) => {
        console.error("Error during service worker registration:", error);
      });
    });
  };

  if (!window.clozone.production) {
    console.log("Not in production: service worker not registered.");
  } else if ("serviceWorker" in window.navigator) {
    registerServiceWorker();
  } else {
    console.warn("Service workers not available.");
  }

})(window);
