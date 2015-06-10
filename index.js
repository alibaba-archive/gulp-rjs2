'use strict'

/**
 * https://github.com/teambition/gulp-rjs2
 * Licensed under the MIT license.
 */

var fs = require('fs')
var through = require('through2')
var gutil = require('gulp-util')
var requirejs = require('requirejs')

var push = Array.prototype.push

module.exports = function rjs (options) {
  var stream = through.obj()
  var path = options.out

  var comName = options.name
  var comNamespace = options.componentNamespace
  var excludeModules = []

  options.out = function (string) {
    if (comNamespace && options.exclude) {
      options.exclude.forEach(function (ele) {
        var filePath = options.baseUrl + ele + '.js'
        var file = fs.readFileSync(filePath, 'utf8')
        push.apply(excludeModules, matchFirstArray(file))
      })
      string = addNameSpaceForUMD(string)
    }
    stream.push(new gutil.File({
      path: path,
      contents: new Buffer(string)
    }))
  }

  requirejs.optimize(options, function (data) {
    stream.push(null)
  }, function (err) {
    console.error(err)
    stream.emit('error', err)
  })

  function addNameSpaceForUMD (string) {
    return string
      .replace(/\bdefine\(\s?['"](\S+?)['"]/g, function (match, p1) {
        // AMD Define
        if (!~excludeModules.indexOf(p1)) {
          return match.replace(p1, p1 === comName ? comNamespace : (comNamespace + '.' + p1))
        }
      })
      .replace(/\bdefine\([^\(]*?\[(.+?)\]/g, function (match, p1) {
        // AMD Deps
        var excludeModulesWithAMD = excludeModules.concat(['require', 'exports', 'module'])
        return match.replace(p1, p1.replace(/['"](\S+?)['"]/g, function (match, p1) {
          return match.replace(p1, !~excludeModulesWithAMD.indexOf(p1) ? (comNamespace + '.' + p1) : p1)
        }))
      })
      .replace(/\brequire\(\s?['"](\S+?)['"]\)/g, function (match, p1) {
        // CMD Require
        if (!~excludeModules.indexOf(p1)) {
          return match.replace(p1, comNamespace + '.' + p1)
        }
      })
  }

  function matchFirstArray (file) {
    var reg = /\bdefine\(\s?[^\(]*?(\[.+?\])/
    var matchValue = file.match(reg)
    if (matchValue) {
      // Convert string to array
      matchValue = JSON.parse(matchValue[1].replace(/'/g, '"'))
    } else {
      matchValue = []
    }
    return matchValue
  }

  return stream
}
