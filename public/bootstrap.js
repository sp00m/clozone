((window) => {

  window.clozone = Object.freeze({

    production: (/^https:\/\/www\.clo\.zone(?:(?::\d+)?\/.*)?$/).test(window.location.href)

  });

})(window);
