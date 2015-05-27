'use strict';

/**
 * https://github.com/teambition/gulp-rjs2
 * Licensed under the MIT license.
 */

var fs = require('fs');
var through = require('through2');
var gutil = require('gulp-util');
var requirejs  = require('requirejs');

var PLUGIN_NAME = 'gulp-rjs2';
var PluginError = gutil.PluginError;

module.exports = function rjs(options) {
  var stream = through.obj();
  var path = options.out;

  var comName = options.name;
  var comNamespace = options.componentNamespace;
  var excludeModules = [];

  options.out = function(string) {
    if (comNamespace && options.exclude) {
      options.exclude.forEach(function(ele){
        var filePath = options.baseUrl + ele + '.js';
        var file = fs.readFileSync(filePath, 'utf8');
        excludeModules = excludeModules.concat(matchFirstArray(file));
      });
      string = addNameSpaceForUMD(string);
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

  function addNameSpaceForUMD(string) {
    return string
    .replace(/define\([\'\"](.*?)[\'\"]/g, function(match, p1) {
      // AMD Define
      if (!~excludeModules.indexOf(p1)) {
        return match.replace(p1, p1 === comName ? comNamespace : (comNamespace + '.' + p1));
      }
    })
    .replace(/define\([\w\W]*?\[([\w\W]*?)\]/g, function(match, p1) {
      // AMD Deps
      var excludeModulesWithAMD = excludeModules.concat(['require','exports','module']);
      return match.replace(p1, p1.replace(/[\'\"](.*?)[\'\"]/g, function(match, p1){
        return match.replace(p1, !~excludeModulesWithAMD.indexOf(p1) ? (comNamespace + '.' + p1) : p1);
      }));
    })
    .replace(/require\([\'\"](.*?)[\'\"]\)/g, function(match, p1) {
      // CMD Require
      if (!~excludeModules.indexOf(p1)) {
        return match.replace(p1, comNamespace + '.' + p1);
      }
    });
  }

  function matchFirstArray(file) {
    var reg = /\[(.*)\]/;
    var matchValue = file.match(reg);
    if (matchValue) {
      // Convert string to array
      matchValue = JSON.parse(matchValue[0].replace(/\'/g, '"'));
    } else {
      matchValue = [];
    }
    return matchValue;
  }

  return stream;
};
