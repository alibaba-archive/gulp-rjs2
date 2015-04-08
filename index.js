'use strict';
/*
 * https://github.com/teambition/gulp-rjs2
 *
 * Licensed under the MIT license.
 */

var through = require('through2');
var gutil = require('gulp-util');
var requirejs  = require('requirejs');

var PLUGIN_NAME = 'gulp-rjs2';
var PluginError = gutil.PluginError;

module.exports = function rjs(options) {
  var stream = through.obj();
  var path = options.out;
  var modulesName = null;
  if (options.componentModules && options.componentNamespace) {
    modulesName = options.componentModules.map(function (name) {
      return name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }).join('|');
  }

  options.out = function(string) {
    if (modulesName) {
      string = string
        .replace(new RegExp('define\\([\'\"](' + modulesName + ')', 'g'), function(match, p1) {
          return match.replace(p1, p1 === options.name ? options.componentNamespace : (options.componentNamespace + '.' + p1));
        })
        .replace(/define\([\w\W]*?\[([\w\W]*?)\]/g, function(match, p1) {
          return match.replace(p1, p1.replace(new RegExp('(' + modulesName + ')', 'g'), options.componentNamespace + '.$1'));
        })
        .replace(new RegExp("require\\('(" + modulesName + ")'\\)", 'g'), function(match, p1) {
          return match.replace(p1, options.componentNamespace + '.' + p1);
        })
        .replace(new RegExp('require\\("(' + modulesName + ')"\\)', 'g'), function(match, p1) {
          return match.replace(p1, options.componentNamespace + '.' + p1);
        });
    }
    stream.push(new gutil.File({
      path: path,
      contents: new Buffer(string)
    }));
  };

  requirejs.optimize(options, function(data) {
    stream.push(null);
  }, function(err) {
    console.error(err);
    stream.emit('error', err);
  });

  return stream;
}
