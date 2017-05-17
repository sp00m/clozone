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
  in: (() => {
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
  out: (() => {
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
  del([paths.in.cssFiles, but(paths.in.libFiles)]));

gulp.task("-sass", ["-clean-css"], () =>
  gulp.src([paths.in.scssFiles, but(paths.in.libFiles)])
    .pipe($.plumber())
    .pipe($.sass())
    .pipe(gulp.dest(paths.in.dir)));

gulp.task("-inject", () =>
  gulp.src(paths.in.htmlFile)
    .pipe($.plumber())
    .pipe($.rename(paths.out.htmlFileName))
    .pipe(wiredep())
    .pipe($.inject(
      gulp.src([paths.in.jsFiles, but(paths.in.libFiles)]).pipe($.babel({ presets: ["es2015"] })).pipe($.angularFilesort()),
      { ignorePath: abs(paths.in.dir), relative: true }
    ))
    .pipe($.inject(
      gulp.src([paths.in.cssFiles, but(paths.in.libFiles)], { read: false }),
      { ignorePath: abs(paths.in.dir), relative: true }
    ))
    .pipe(gulp.dest(paths.in.dir)));

gulp.task("-watch", ["-inject"], () => {
  $.watchSass([paths.in.scssFiles, but(paths.in.libFiles)])
    .pipe($.plumber())
    .pipe($.sass())
    .pipe(gulp.dest(paths.in.dir));
  $.watch([paths.in.jsFiles, paths.in.cssFiles, but(paths.in.libFiles)])
    .pipe($.if(
      (file) => "add" === file.event || "unlink" === file.event,
      $.fn(() => gulp.start("-inject"))
    ));
});

gulp.task("watch", (done) =>
  runSequence("-sass", "-watch", done));

gulp.task("-clean-dist", () =>
  del(paths.out.dir));

gulp.task("-copy-src", ["-clean-dist", "-inject"], () =>
  gulp.src([paths.in.files, but(paths.in.htmlFile), but(paths.in.scssFiles), but(paths.in.libFiles)])
    .pipe($.plumber())
    .pipe($.if("*.css", $.cssretarget({ root: abs(paths.in.dir) })))
    .pipe(gulp.dest(paths.out.dir)));

gulp.task("-copy-deps", ["-copy-src"], () =>
  gulp.src(mainBowerFiles(), { base: paths.in.libDir })
    .pipe($.plumber())
    .pipe($.if("*.css", $.cssretarget({ root: abs(paths.in.dir) })))
    .pipe(gulp.dest(paths.out.libDir)));

gulp.task("-minify", ["-copy-deps"], () =>
  gulp.src(paths.out.htmlFile)
    .pipe($.plumber())
    .pipe($.replace("@jsFileName", paths.out.jsFileName))
    .pipe($.replace("@cssFileName", paths.out.cssFileName))
    .pipe($.useref({}, lazypipe()
      .pipe($.sourcemaps.init, { loadMaps: true })
      .pipe(() => $.if("*.css", $.cleanCss()))
      .pipe(() => $.if("*.js", $.babel({ presets: ["es2015"] })))
      .pipe(() => $.if("*.js", $.uglify()))))
    .pipe($.sourcemaps.write("."))
    .pipe(gulp.dest(paths.out.dir)));

gulp.task("-dist", ["-minify"], () =>
  del([paths.out.jsFiles, paths.out.cssFiles, but(paths.out.jsFile), but(paths.out.cssFile)])
    .then(() => deleteEmpty.sync(paths.out.dir)));

gulp.task("dist", (done) =>
  runSequence("-sass", "-dist", done));
