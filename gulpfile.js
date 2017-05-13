const gulp = require("gulp");
const $ = require("gulp-load-plugins")();

const del = require("del");
const deleteEmpty = require("delete-empty");
const lazypipe = require("lazypipe");
const mainBowerFiles = require("main-bower-files");
const runSequence = require("run-sequence");
const wiredep = require("wiredep").stream;

const version = require("./package").version;
const outputScriptsFile = `app-${version}.min.js`;
const outputStylesFile = `app-${version}.min.css`;

gulp.task("-clean-css", () =>
  del(["./public/**/*.css", "!./public/libs/**/*"]));

gulp.task("-sass", () =>
  gulp.src(["./public/**/*.scss", "!./public/libs/**/*"])
    .pipe($.plumber())
    .pipe($.sass.sync().on("error", $.sass.logError))
    .pipe(gulp.dest("./public")));

gulp.task("-inject", ["-sass"], () =>
  gulp.src("./public/index.src.html")
    .pipe($.plumber())
    .pipe($.rename("index.html"))
    .pipe(wiredep())
    .pipe($.inject(
      gulp.src(["./public/**/*.js", "!./public/libs/**/*"]).pipe($.babel({ presets: ["es2015"] })).pipe($.angularFilesort()),
      { ignorePath: "/public", relative: true }
    ))
    .pipe($.inject(
      gulp.src(["./public/**/*.css", "!./public/libs/**/*"], { read: false }),
      { ignorePath: "/public", relative: true }
    ))
    .pipe(gulp.dest("./public")));

gulp.task("-watch", ["-inject"], () =>
  $.watchSass(["./public/**/*.scss", "!./public/libs/**/*"])
    .pipe($.plumber())
    .pipe($.sass())
    .pipe(gulp.dest("./public")));

gulp.task("watch", (done) =>
  runSequence("-clean-css", "-watch", done));

gulp.task("-clean-dist", () =>
  del("./dist"));

gulp.task("-copy-src", ["-clean-dist", "-inject"], () =>
  gulp.src(["./public/**/*", "!./public/index.src.html", "!./public/**/*.scss", "!./public/libs/**/*"])
    .pipe($.plumber())
    .pipe($.if("*.css", $.cssretarget({ root: "/public" })))
    .pipe(gulp.dest("./dist")));

gulp.task("-copy-deps", ["-copy-src"], () =>
  gulp.src(mainBowerFiles(), { base: "./public/libs" })
    .pipe($.plumber())
    .pipe($.if("*.css", $.cssretarget({ root: "/public" })))
    .pipe(gulp.dest("./dist/libs")));

gulp.task("-minify", ["-copy-deps"], () =>
  gulp.src("./dist/index.html")
    .pipe($.plumber())
    .pipe($.replace("@outputScriptsFile", outputScriptsFile))
    .pipe($.replace("@outputStylesFile", outputStylesFile))
    .pipe($.useref({}, lazypipe()
      .pipe($.sourcemaps.init, { loadMaps: true })
      .pipe(() => $.if("*.css", $.cleanCss()))
      .pipe(() => $.if("*.js", $.babel({ presets: ["es2015"] })))
      .pipe(() => $.if("*.js", $.uglify()))))
    .pipe($.sourcemaps.write("."))
    .pipe(gulp.dest("./dist")));

gulp.task("-dist", ["-minify"], () =>
  del(["./dist/**/*.{css,js}", `!./dist/${outputScriptsFile}`, `!./dist/${outputStylesFile}`]).then(() => deleteEmpty.sync("./dist")));

gulp.task("dist", (done) =>
  runSequence("-clean-css", "-dist", done));
