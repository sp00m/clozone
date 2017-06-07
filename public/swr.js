/* eslint-disable no-console, default-case */

((window) => {

  "use strict";

  const registrationMatchesServiceWorkerFilePath = (registration) => {
    const serviceWorker = registration.installing || registration.waiting || registration.active;
    return serviceWorker && serviceWorker.scriptURL && serviceWorker.scriptURL.endsWith("clozone.sw.js");
  };

  const unregisterObsoleteServiceWorkersQuietly = () =>
    window.navigator.serviceWorker.getRegistrations().then((registrations) =>
      Promise.all(registrations
        .filter((registration) => !registrationMatchesServiceWorkerFilePath(registration))
        .map((registration) =>
          registration.unregister().then((unregistered) =>
            unregistered ? Promise.resolve() : Promise.reject("Service worker not unregistered.")
          ).catch((error) => {
            console.warn("Error while unregistering service worker:", error);
          })
        ))
    ).catch((error) => {
      console.warn("Error while getting registrations:", error);
    });

  const registerServiceWorker = () => {
    window.navigator.serviceWorker.register("clozone.sw.js").catch((error) => {
      console.error("Error during service worker registration:", error);
    });
  };

  if (!window.clozone.production) {
    console.log("Not in production: service worker not registered.");
  } else if ("serviceWorker" in window.navigator) {
    unregisterObsoleteServiceWorkersQuietly().then(registerServiceWorker);
  } else {
    console.warn("Service workers not available.");
  }

})(window);
