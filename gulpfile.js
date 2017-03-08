const Del = require('del');
const Gulp = require('gulp');
const ESLint = require('gulp-eslint');
const Sourcemaps = require('gulp-sourcemaps');
const Babel = require('gulp-babel');

const srcDir = './src';
const buildDir = './build';

Gulp.task('clean', cb => {
  return Del([buildDir], cb);
});

Gulp.task('js-compile', ['clean'], function () {
  return Gulp.src([`${srcDir}/index.js`])
    .pipe(ESLint())
    .pipe(ESLint.format())
    .pipe(ESLint.failAfterError())
    .pipe(Sourcemaps.init())
    .pipe(Babel())
    .pipe(Sourcemaps.write('.'))
    .pipe(Gulp.dest(buildDir));
});

Gulp.task('files-copy', ['clean'], function () {
  return Gulp.src(['./package.json', './README.md', './LICENSE'])
    .pipe(Gulp.dest(buildDir));
});

Gulp.task('default', ['clean', 'js-compile', 'files-copy']);