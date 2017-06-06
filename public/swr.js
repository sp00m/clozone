/* eslint-disable no-console, default-case */

((window) => {

  const setupServiceWorker = () => {
    window.addEventListener("load", () => {
      window.navigator.serviceWorker.register("clozone-@version.sw.js").then((registration) => {
        registration.onupdatefound = () => {

          registration.installing.onstatechange = () => {
            switch (registration.installing.state) {

            case "installed":
              if (window.navigator.serviceWorker.controller) {
                console.log("New or updated content is available.");
              } else {
                console.log("Content is now available offline!");
              }
              break;

            case "redundant":
              console.error("The installing service worker became redundant.");
              break;

            }
          };

        };
      }).catch((e) => {
        console.error("Error during service worker registration:", e);
      });
    });
  };

  if (window.clozone.production) {
    if ("serviceWorker" in window.navigator) {
      setupServiceWorker();
    } else {
      console.log("Service workers not available :(");
    }
  } else {
    console.log("Not in production: service worker not set up.");
  }

})(window);
