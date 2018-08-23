((window) => {

  "use strict";

  const version = "@version";

  const production = "@production" === "true";

  const v = (production)
    ? (() => {
      const replacements = new Map();
      return (path) => {
        if (!replacements.has(path)) {
          replacements.set(path, path.replace(/(?=\.[a-z0-9]+$)/, `-${version}`));
        }
        return replacements.get(path);
      };
    })()
    : (path) => path;

  window.clozone = Object.freeze({ version, production, v });

})(window);
