const version = require("./package").version;
const gulp = require("gulp");
const $ = require("gulp-load-plugins")();

const del = require("del");
const deleteEmpty = require("delete-empty");
const lazypipe = require("lazypipe");
const mainBowerFiles = require("main-bower-files");
const runSequence = require("run-sequence");
const wiredep = require("wiredep").stream;

gulp.task("-clean-css", () =>
  // delete all the CSS files (except the ones belonging to libs):
  del(["./public/**/*.css", "!./public/libs/**/*"]));

gulp.task("-sass", ["-clean-css"], () =>
  // read all the SCSS files (but the ones belonging to libs):
  gulp.src(["./public/**/*.scss", "!./public/libs/**/*"])
    .pipe($.plumber())
    // compile them:
    .pipe($.sass())
    // generate the CSS files next to the corresponding SASS files:
    .pipe(gulp.dest("./public")));

gulp.task("-inject", () =>
  // read the HTML source file:
  gulp.src("./public/index.src.html")
    .pipe($.plumber())
    // create a copy so that the original one is not overwritten:
    .pipe($.rename("index.html"))
    // inject the Bower dependencies files:
    .pipe(wiredep())
    .pipe($.inject(
      // inject the JS source files (except the ones belong to libs):
      gulp.src(["./public/**/*.js", "!./public/libs/**/*"])
        // first transpile them:
        .pipe($.babel({ presets: ["es2015"] }))
        // then sort them in the right order:
        .pipe($.angularFilesort()),
      // update injected paths so that source dir is not taken into account:
      { ignorePath: "/public", relative: true }
    ))
    .pipe($.inject(
      // inject the generated CSS source files (except the ones belong to libs):
      gulp.src(["./public/**/*.css", "!./public/libs/**/*"], { read: false }),
      // update injected paths so that source dir is not taken into account:
      { ignorePath: "/public", relative: true }
    ))
    // create the output HTML file next to the original one:
    .pipe(gulp.dest("./public")));

gulp.task("-watch", ["-inject"], () => {
  // watch for SCSS files (except the ones belong to libs):
  $.watchSass(["./public/**/*.scss", "!./public/libs/**/*"])
    .pipe($.plumber())
    // compile then:
    .pipe($.sass())
    // generate the CSS files next to the corresponding SASS files:
    .pipe(gulp.dest("./public"));
  // watch for CSS and JS files (except the ones belonging to libs):
  $.watch(["./public/**/*.js", "./public/**/*.css", "!./public/libs/**/*"])
    .pipe($.if(
      // if the file has just been added or deleted:
      (file) => "add" === file.event || "unlink" === file.event,
      // then rerun the -inject task so that the file can be injected and the HTML updated:
      $.fn(() => gulp.start("-inject"))
    ));
  // watch for index.src.html changes:
  $.watch(["./public/index.src.html"])
    // then rerun the -inject task so that modifications are taken into account:
    .pipe($.fn(() => gulp.start("-inject")));
});

gulp.task("watch", (done) =>
  // first run -sass, then start watching:
  runSequence("-sass", "-watch", done));

gulp.task("-clean-dist", () =>
  // remove the destination dir:
  del("./dist"));

gulp.task("-copy-src", ["-clean-dist", "-inject"], () =>
  // read all input files (except the HTML source file, the SCSS files and ones beloning to libs):
  gulp.src(["./public/**/*", "!./public/index.src.html", "!./public/**/*.scss", "!./public/libs/**/*"])
    .pipe($.plumber())
    // update CSS files so that relative URL are updated:
    .pipe($.if("*.css", $.cssretarget({ root: "/public" })))
    // set version:
    .pipe($.if("clozone.module.js", $.replace("@version", version)))
    // copy them all into the destination dir:
    .pipe(gulp.dest("./dist")));

gulp.task("-copy-deps", ["-copy-src"], () =>
  // read all libs files:
  gulp.src(mainBowerFiles(), { base: "./public/libs" })
    .pipe($.plumber())
    // update CSS files so that relative URL are updated:
    .pipe($.if("*.css", $.cssretarget({ root: "/public" })))
    // copy them all into the destination dir:
    .pipe(gulp.dest("./dist/libs")));

gulp.task("-minify", ["-copy-deps"], () =>
  // read the generated HTML file:
  gulp.src("./dist/index.html")
    .pipe($.plumber())
    // set the final JS file name:
    .pipe($.replace("@jsFileName", `app-${version}.min.js`))
    // set the final CSS file name:
    .pipe($.replace("@cssFileName", `app-${version}.min.css`))
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
    .pipe(gulp.dest("./dist")));

gulp.task("-dist", ["-minify"], () =>
  // delete JS and CSS files, except the concatenated/minified final ones:
  del(["./dist/**/*.js", "./dist/**/*.css", `!./dist/app-${version}.min.js`, `!./dist/app-${version}.min.css`])
    // delete empty directories:
    .then(() => deleteEmpty.sync("./dist")));

gulp.task("dist", (done) =>
  // first run -sass, then start creating dist:
  runSequence("-sass", "-dist", done));
