const version = require("./package").version;
const gulp = require("gulp");
const $ = require("gulp-load-plugins")();

const del = require("del");
const deleteEmpty = require("delete-empty");
const lazypipe = require("lazypipe");
const mainBowerFiles = require("main-bower-files");
const runSequence = require("run-sequence");
const wiredep = require("wiredep").stream;

const paths = {
  src: (() => {
    const dir = "./public";
    const files = `${dir}/**/*`;
    const htmlFile = `${dir}/index.src.html`;
    const jsFiles = `${files}.js`;
    const cssFiles = `${files}.css`;
    const scssFiles = `${files}.scss`;
    const libDir = `${dir}/libs`;
    const libFiles = `${libDir}/**/*`;
    return { dir, files, htmlFile, jsFiles, cssFiles, scssFiles, libDir, libFiles };
  })(),
  dest: (() => {
    const dir = "./dist";
    const htmlFileName = "index.html";
    const htmlFile = `${dir}/${htmlFileName}`;
    const libDir = `${dir}/libs`;
    const jsFiles = `${dir}/**/*.js`;
    const cssFiles = `${dir}/**/*.css`;
    const jsFileName = `app-${version}.min.js`;
    const cssFileName = `app-${version}.min.css`;
    const jsFile = `${dir}/${jsFileName}`;
    const cssFile = `${dir}/${cssFileName}`;
    return { dir, htmlFileName, htmlFile, libDir, jsFiles, cssFiles, jsFileName, cssFileName, jsFile, cssFile };
  })()
};

const but = (path) => `!${path}`;
const abs = (path) => path.replace(/^\.+/, "");

gulp.task("-clean-css", () =>
  // delete all the CSS files (except the ones belonging to libs):
  del([paths.src.cssFiles, but(paths.src.libFiles)]));

gulp.task("-sass", ["-clean-css"], () =>
  // read all the SCSS files (but the ones belonging to libs):
  gulp.src([paths.src.scssFiles, but(paths.src.libFiles)])
    .pipe($.plumber())
    // compile them:
    .pipe($.sass())
    // generate the CSS files next to the corresponding SASS files:
    .pipe(gulp.dest(paths.src.dir)));

gulp.task("-inject", () =>
  // read the HTML source file:
  gulp.src(paths.src.htmlFile)
    .pipe($.plumber())
    // create a copy so that the original one is not overwritten:
    .pipe($.rename(paths.dest.htmlFileName))
    // inject the Bower dependencies files:
    .pipe(wiredep())
    .pipe($.inject(
      // inject the JS source files (except the ones belong to libs):
      gulp.src([paths.src.jsFiles, but(paths.src.libFiles)])
        // first transpile them:
        .pipe($.babel({ presets: ["es2015"] }))
        // then sort them in the right order:
        .pipe($.angularFilesort()),
      // update injected paths so that source dir is not taken into account:
      { ignorePath: abs(paths.src.dir), relative: true }
    ))
    .pipe($.inject(
      // inject the generated CSS source files (except the ones belong to libs):
      gulp.src([paths.src.cssFiles, but(paths.src.libFiles)], { read: false }),
      // update injected paths so that source dir is not taken into account:
      { ignorePath: abs(paths.src.dir), relative: true }
    ))
    // create the output HTML file next to the original one:
    .pipe(gulp.dest(paths.src.dir)));

gulp.task("-watch", ["-inject"], () => {
  // watch for SCSS files (except the ones belong to libs):
  $.watchSass([paths.src.scssFiles, but(paths.src.libFiles)])
    .pipe($.plumber())
    // compile then:
    .pipe($.sass())
    // generate the CSS files next to the corresponding SASS files:
    .pipe(gulp.dest(paths.src.dir));
  // watch for CSS and JS files (except the ones belonging to libs):
  $.watch([paths.src.jsFiles, paths.src.cssFiles, but(paths.src.libFiles)])
    .pipe($.if(
      // if the file has just been added or deleted:
      (file) => "add" === file.event || "unlink" === file.event,
      // then rerun the -inject task so that the file can be injected and the HTML updated:
      $.fn(() => gulp.start("-inject"))
    ));
});

gulp.task("watch", (done) =>
  // first run -sass, then start watching:
  runSequence("-sass", "-watch", done));

gulp.task("-clean-dist", () =>
  // remove the destination dir:
  del(paths.dest.dir));

gulp.task("-copy-src", ["-clean-dist", "-inject"], () =>
  // read all input files (except the HTML source file, the SCSS files and ones beloning to libs):
  gulp.src([paths.src.files, but(paths.src.htmlFile), but(paths.src.scssFiles), but(paths.src.libFiles)])
    .pipe($.plumber())
    // update CSS files so that relative URL are updated:
    .pipe($.if("*.css", $.cssretarget({ root: abs(paths.src.dir) })))
    // copy them all into the destination dir:
    .pipe(gulp.dest(paths.dest.dir)));

gulp.task("-copy-deps", ["-copy-src"], () =>
  // read all libs files:
  gulp.src(mainBowerFiles(), { base: paths.src.libDir })
    .pipe($.plumber())
    // update CSS files so that relative URL are updated:
    .pipe($.if("*.css", $.cssretarget({ root: abs(paths.src.dir) })))
    // copy them all into the destination dir:
    .pipe(gulp.dest(paths.dest.libDir)));

gulp.task("-minify", ["-copy-deps"], () =>
  // read the generated HTML file:
  gulp.src(paths.dest.htmlFile)
    .pipe($.plumber())
    // set the final JS file name:
    .pipe($.replace("@jsFileName", paths.dest.jsFileName))
    // set the final CSS file name:
    .pipe($.replace("@cssFileName", paths.dest.cssFileName))
    // concat all listed source files:
    .pipe($.useref({}, lazypipe()
      // generate the source maps to that they reference the original files:
      .pipe($.sourcemaps.init, { loadMaps: true })
      // minify CSS files:
      .pipe(() => $.if("*.css", $.cleanCss()))
      // transpile JS files:
      .pipe(() => $.if("*.js", $.babel({ presets: ["es2015"] })))
      // minify JS files:
      .pipe(() => $.if("*.js", $.uglify()))))
    .pipe($.sourcemaps.write("."))
    .pipe(gulp.dest(paths.dest.dir)));

gulp.task("-dist", ["-minify"], () =>
  // delete JS and CSS files, except the concatenated/minified final ones:
  del([paths.dest.jsFiles, paths.dest.cssFiles, but(paths.dest.jsFile), but(paths.dest.cssFile)])
    // delete empty directories:
    .then(() => deleteEmpty.sync(paths.dest.dir)));

gulp.task("dist", (done) =>
  // first run -sass, then start creating dist:
  runSequence("-sass", "-dist", done));
