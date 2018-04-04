const gulp = require('gulp')
const runSeq = require('run-sequence')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const babel = require('gulp-babel')
const browserSync = require('browser-sync')

var config = {
  cssin:   __dirname + '/sass/**/*.sass',
  jsin:    __dirname + '/babel/**/*.js',
  htmlin:  __dirname + '/html/**/*.html',
  cssout:  __dirname + '/docs/css/',
  jsout:   __dirname + '/docs/js/',
  htmlout: __dirname + '/docs/'
}

gulp.task('reload', function () {
  browserSync.reload()
})

gulp.task('serve', ['html', 'sass', 'babel'], function () {
  browserSync({
    server: config.htmlout
  })

  gulp.watch(config.jsin, () => runSeq(['babel', 'reload']))
  gulp.watch(config.cssin, () => runSeq(['sass', 'reload']))
  gulp.watch(config.htmlin, () => runSeq(['html', 'reload']))
})

gulp.task('html', function () {
  let path = config.htmlin
  return gulp.src(path)
    .pipe(gulp.dest(config.htmlout))
})

gulp.task('sass', function () {
  let path = config.cssin
  return gulp.src(path)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.cssout))
})

gulp.task('babel', function () {
  let path = config.jsin
  return gulp.src(path)
    .pipe(babel().on('error', e => {
      console.log('babel', e)
    }))
    .pipe(gulp.dest(config.jsout))
})

gulp.task('build', ['html', 'babel', 'sass'])

gulp.task('default', ['serve'])
