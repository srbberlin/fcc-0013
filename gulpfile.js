const gulp = require('gulp')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const babel = require('gulp-babel')
const browserSync = require('browser-sync')
const del = require('del')

var config = {
  base:    __dirname + '/',
  cssin:   __dirname + '/sass/**/*.sass',
  jsin:    __dirname + '/babel/**/*.js',
  cssout:  __dirname + '/css/',
  jsout:   __dirname + '/js/'
}

gulp.task('reload', function () {
  browserSync.reload()
})

gulp.task('serve', ['sass', 'babel'], function () {
  browserSync({
    server: config.htmlout
  })

  gulp.watch(config.html, ['reload'])
  gulp.watch(config.jsin, ['babel', 'reload'])
  gulp.watch(config.cssin, ['sass', 'reload'])
  gulp.watch(config.imgin, ['images', 'reload'])
  gulp.watch(config.htmlin, ['html', 'reload'])
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

gulp.task('build', ['babel', 'sass'])

gulp.task('default', ['serve'])
