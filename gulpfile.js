const gulp = require("gulp");
const plugins = require("gulp-load-plugins")();

const del = require("del");
const deleteEmpty = require("delete-empty");
const lazypipe = require("lazypipe");
const mainBowerFiles = require("main-bower-files");
const wiredep = require("wiredep").stream;

gulp.task("clean-css", () =>
  del(["./public/**/*.css", "!./public/libs/**/*"]));

gulp.task("sass", ["clean-css"], () =>
  gulp.src(["./public/**/*.scss", "!./public/libs/**/*"])
    .pipe(plugins.plumber())
    .pipe(plugins.sass.sync().on("error", plugins.sass.logError))
    .pipe(gulp.dest("./public")));

gulp.task("inject", ["clean-css", "sass"], () =>
  gulp.src("./public/index.src.html")
    .pipe(plugins.plumber())
    .pipe(plugins.rename("index.html"))
    .pipe(wiredep())
    .pipe(plugins.inject(
      gulp.src(["./public/**/*.js", "!./public/libs/**/*"]).pipe(plugins.babel({ presets: ['es2015'] })).pipe(plugins.angularFilesort()),
      { ignorePath: "/public", relative: true }
    ))
    .pipe(plugins.inject(
      gulp.src(["./public/**/*.css", "!./public/libs/**/*"], { read: false }),
      { ignorePath: "/public", relative: true }
    ))
    .pipe(gulp.dest("./public")));

gulp.task("watch", ["inject"], () =>
  gulp.watch(["./public/**/*.scss", "!./public/libs/**/*"], ["sass"]));

gulp.task("clean", () =>
  del("./dist"));

gulp.task("copy", ["clean", "inject"], () =>
  gulp.src(["./public/**/*", "!./public/index.src.html", "!./public/**/*.scss", "!./public/libs/**/*"])
    .pipe(plugins.plumber())
    .pipe(plugins.if("*.css", plugins.cssretarget({ root: "/public" })))
    .pipe(gulp.dest("./dist")));

gulp.task("deps", ["copy"], () =>
  gulp.src(mainBowerFiles(), { base: "./public/libs" })
    .pipe(plugins.plumber())
    .pipe(plugins.if("*.css", plugins.cssretarget({ root: "/public" })))
    .pipe(gulp.dest("./dist/libs")));

gulp.task("minify", ["deps"], () =>
  gulp.src("./dist/index.html")
    .pipe(plugins.plumber())
    .pipe(plugins.useref({}, lazypipe().pipe(plugins.sourcemaps.init, { loadMaps: true })))
    .pipe(plugins.if("*.css", plugins.cleanCss()))
    .pipe(plugins.if("*.js", plugins.babel({ presets: ['es2015'] })))
    .pipe(plugins.if("*.js", plugins.uglify()))
    .pipe(plugins.sourcemaps.write("."))
    .pipe(gulp.dest("./dist")));

gulp.task("dist", ["clean-css", "minify"], () =>
  del(["./dist/**/*.{css,js}", "!./dist/scripts.js", "!./dist/styles.css"]).then(function () {
    return deleteEmpty.sync("./dist");
  }));

gulp.task("install", ["clean-css", "dist"]);
