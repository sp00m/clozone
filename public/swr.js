/* eslint-disable no-console, default-case */

((window) => {

  if ("serviceWorker" in window.navigator) {

    window.addEventListener("load", () => {
      window.navigator.serviceWorker.register("clozone.sw.js").then((registration) => {
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

  } else {
    console.log("Service workers not available :(");
  }

})(window);
