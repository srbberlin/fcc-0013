const gulp = require('gulp')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const babel = require('gulp-babel')
const browserSync = require('browser-sync')

var config = {
  cssin:    __dirname + '/sass/**/*.sass',
  jsin:     __dirname + '/babel/**/*.js',
  htmlin:   __dirname + '/html/**/*.html',
  assetsin: __dirname + '/assets/**/*',
  cssout:   __dirname + '/docs/css/',
  jsout:    __dirname + '/docs/js/',
  htmlout:  __dirname + '/docs/'
}

function reload () {
  browserSync.reload()
}

function html () {
  let path = config.htmlin
  return gulp.src(path)
    .pipe(gulp.dest(config.htmlout))
}

function assets () {
  let path = config.assetsin
  return gulp.src(path)
    .pipe(gulp.dest(config.htmlout))
}

function css () {
  let path = config.cssin
  return gulp.src(path)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.cssout))
}

function babl () {
  let path = config.jsin
  return gulp.src(path)
    .pipe(babel().on('error', e => {
      console.log('babel', e)
    }))
    .pipe(gulp.dest(config.jsout))
}

function serve () {
  browserSync({
    server: config.htmlout
  })

  gulp.watch(config.jsin, () => gulp.series(babl, reload))
  gulp.watch(config.cssin, () => gulp.series(css, reload))
  gulp.watch(config.htmlin, () => gulp.series(html, reload))
  gulp.watch(config.assetsin, () => gulp.series(assets, reload))
}

exports.build = function () {
  gulp.series(build, gulp.parallel(html, assets, babel, sass))
}

exports.default = serve
