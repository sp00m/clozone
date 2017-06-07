((window) => {

  "use strict";

  window.clozone = Object.freeze({
    version: "@version",
    production: (/^https:\/\/www\.clo\.zone(?:(?::\d+)?\/.*)?$/).test(window.location.href)
  });

})(window);
