'use strict';

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify-es').default;
var cleanCSS = require('gulp-clean-css');


gulp.task('js', function () {
    return gulp.src('app/js/*.js')
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});

gulp.task('vendor', function () {
    return gulp.src('app/js/vendor/*.js')
        .pipe(gulp.dest('dist/js/vendor'))
})

gulp.task('css', function () {
    return gulp.src('app/css/**/*.css')
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'))
});

gulp.task('popup', function () {
    return gulp.src('app/popup.html')
        .pipe(gulp.dest('dist'))
});

gulp.task('img', function () {
    return gulp.src('app/img/**/*')
        .pipe(gulp.dest('dist/img/'))
});

gulp.task('manifest', function () {
    return gulp.src('app/manifest.json')
        .pipe(gulp.dest('dist'))
});

gulp.task('watch', function () {
    gulp.watch('app/css/**/*.css', gulp.series('css'));
    gulp.watch('app/js/**/*.js', gulp.series('js'));
    gulp.watch('app/popup.html', gulp.series('popup'));
    gulp.watch('app/manifest.json', gulp.series('manifest'));
    gulp.watch('app/img/**/*', gulp.series('img'));
});

gulp.task('default',  gulp.parallel('img', 'js', 'vendor', 'css', 'popup', 'manifest', 'watch'));

gulp.task('build', gulp.parallel('img', 'js', 'vendor', 'css', 'popup', 'manifest'));
