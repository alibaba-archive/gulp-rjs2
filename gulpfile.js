'use strict'

var gulp = require('gulp')
var gulpSequence = require('gulp-sequence')

gulp.task('test', function (cb) {
  return cb()
})

gulp.task('default', gulpSequence('test'))
