const gulp = require('gulp')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const babel = require('gulp-babel')
//const concat = require('gulp-concat')
const browserSync = require('browser-sync')
//bootconst sequence = require('gulp-series')
const del = require('del')

var config = {
  base:   __dirname + '/',
  html:   '**/*.html',
  cssin:  'sass/**/*.sass',
  cssout: 'css/',
  jsin:   'babel/**/*.js',
  jsout:  'js/',
}

gulp.task('reload', function() {
  console.log('')
  browserSync.reload()
})

gulp.task('serve', ['sass', 'babel'], function() {
  console.log('serve')
  browserSync({
    server: config.base
  })

  gulp.watch(config.html, ['reload'])
  gulp.watch(config.jsin, ['babel', 'reload'])
  gulp.watch(config.cssin, ['sass', 'reload'])
})

gulp.task('sass', function() {
  let path = config.base + config.cssin
  console.log('sass', path)
  return gulp.src(path)
    .pipe(sourcemaps.init())
    .pipe(sass())
    //.pipe(autoprefixer({
    //  browsers: ['last 3 versions']
    //}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.base + config.cssout))
    .pipe(browserSync.stream())
})

gulp.task('babel', function() {
  let path = config.base + config.jsin
  console.log('babel', path)
  return gulp.src(path)
    .pipe(babel())
    .pipe(gulp.dest(config.base + config.jsout))
    .pipe(browserSync.stream())
})

gulp.task('clean', function() {
  let paths = [config.base + config.jsout + '/*.js', config.base + config.cssout + '/*.css']
  let res;
  console.log('clean', [config.base + config.js + '/*.js', config.base + config.css + '/*.css'])
  res = del(paths)
  res.then(function (a) {
    console.log('clean', a)
  }).catch( function (a) {
    console.log('clean', a)
  })
  return res
})

gulp.task('build', ['babel', 'sass'])

gulp.task('default', ['serve'])

  
  
