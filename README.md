gulp-rjs2
====
> Requirejs plugin for gulp, support component mode

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]

## Install

Install with [npm](https://npmjs.org/package/gulp-rjs2)

```
npm install --save-dev gulp-rjs2
```

## Usage

```js
var rjs = require('gulp-rjs2');

// build libs.js
gulp.task('rjs-libs', function() {
  // deps
  return rjs({
    baseUrl: 'public/teambition/en',
    mainConfigFile: 'public/teambition/en/main.js',
    name: '../../bower_components/almond/almond',
    out: 'libs.js',
    include: ['libraries'],
    insertRequire: ['libraries'],
    removeCombined: true,
    findNestedDependencies: true,
    optimizeCss: 'none',
    optimize: 'none',
    skipDirOptimize: true,
    wrap: false
  })
  .pipe(uglify())
  .pipe(gulp.dest('public/temp/libs/js'));
});

// build deps.js
gulp.task('rjs-deps', function() {
  // deps
  return rjs({
    baseUrl: 'public/teambition/en',
    mainConfigFile: 'public/teambition/en/main.js',
    name: 'dependencies',
    out: 'deps.js',
    exclude: ['libraries'],
    removeCombined: true,
    findNestedDependencies: true,
    optimizeCss: 'none',
    optimize: 'none',
    skipDirOptimize: true,
    wrap: false
  })
  .pipe(uglify())
  .pipe(gulp.dest('public/temp/teambition/js'));
});

// build app.js
gulp.task('rjs-app', function() {
  return rjs({
    baseUrl: 'public/teambition/en',
    mainConfigFile: 'public/teambition/en/main.js',
    name: 'main',
    out: 'app.js',
    exclude: ['libraries', 'dependencies'],
    removeCombined: true,
    findNestedDependencies: true,
    optimizeCss: 'none',
    optimize: 'none',
    skipDirOptimize: true,
    wrap: true
  })
  .pipe(uglify())
  .pipe(gulp.dest('public/temp/teambition/js'));
});

// build component.js with namespace
gulp.task('create-org-component-rjs', function() {
  return rjs({
    baseUrl: 'public/create-organization/js',
    mainConfigFile: 'public/create-organization/js/app.js',
    name: 'component',
    out: 'component.js',
    exclude: ['libraries'],
    componentNamespace: 'com-create-organization',
    removeCombined: true,
    findNestedDependencies: true,
    optimizeCss: 'none',
    optimize: 'none',
    skipDirOptimize: true,
    wrap: true
  })
  .pipe(gulp.dest('public/components/create-organization'));
});
```

## License

MIT © [Teambition](http://teambition.com)

[npm-url]: https://npmjs.org/package/gulp-rjs2
[npm-image]: http://img.shields.io/npm/v/gulp-rjs2.svg

[travis-url]: https://travis-ci.org/teambition/gulp-rjs2
[travis-image]: http://img.shields.io/travis/teambition/gulp-rjs2.svg
