"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
// const cp = require("child_process");
const cssnano = require("cssnano");
const del = require("del");
//const eslint = require("gulp-eslint");
const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const pug = require('gulp-pug');

// Custom directory structure of your project
const
	pugSource   = "./pug/**/!(_)*.pug",
	pugIncludes = "./pug/includes/**/*.pug",
	jsSource    = "./assets/**/*.js",
	jsDest      = "./_site/assets/",
	imgSource   = "./assets/images/**/*",
	imgDest     = "./_site/images",
	scssSources = "./assets/scss/**/*.scss",
	scssDest    = "./_site/css/",
	htmlSource  = "./html/**/*.html",
	site = "./_site/"

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: site
    },
    port: 7000
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean assets
function clean() {
  return del(["./_site/assets/"]);
}

// Optimize Images
function images() {
  return gulp
    .src(imgSource)
    .pipe(newer(imgDest))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest(imgDest));
}

// CSS task
function css() {
  return gulp
    .src(scssSources)
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(gulp.dest(scssDest))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest(scssDest))
    .pipe(browsersync.stream());
}

/*
// Lint scripts
function scriptsLint() {
  return gulp
    .src([jsSource, "./gulpfile.js"])
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}
*/

// Transpile, concatenate and minify scripts
function scripts() {
  return gulp
	.src(jsSource)
	//.pipe(plumber())
	.pipe(gulp.dest(jsDest))
	.pipe(browsersync.stream())
}

// Render pug files to HTML
function renderPug() {
	return gulp.src(pugSource)
		.pipe(pug())
		//.pipe(htmlbeautify(options))
		.pipe(gulp.dest(site))
		//.pipe(browserSync.stream())
}

// define complex tasks
//const jsLint = gulp.series(scriptsLint, scripts);
const build  = gulp.series(clean, gulp.parallel(renderPug, css, images, scripts));
const watch  = gulp.parallel(watchFiles, browserSync);

// Watch files
function watchFiles() {
  gulp.watch(scssSources, css);
  gulp.watch(jsSource, scripts);
  gulp.watch([pugSource, pugIncludes], gulp.series(renderPug, browserSyncReload))
  /*
  gulp.watch(
    [
      pugSource,
	  htmlSource
    ],
    gulp.series(build, browserSyncReload)
  );
  */
  gulp.watch(imgSource, images);
}

// export tasks
exports.images = images;
exports.css = css;
exports.scripts = scripts;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = build;
