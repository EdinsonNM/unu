var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var concat = require('gulp-concat');
var gulpFilter = require('gulp-filter');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var stylus = require('gulp-stylus');
var sourcemaps = require('gulp-sourcemaps');
var urlAdjuster = require('gulp-css-url-adjuster');
var publishdir = 'app/public';
var dist = {
   js: publishdir + '/js/',
   css: publishdir +'/css/',
   fonts: publishdir +'/fonts/'
};
gulp.task('bower', function() {
    var jsFilter = gulpFilter('**/*.js', {restore: true});
    var cssFilter = gulpFilter('**/*.css', {restore: true});
    return gulp.src(mainBowerFiles())
        .pipe(jsFilter)
        .pipe(sourcemaps.init())
        .pipe(concat('vendors.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dist.js))
        .pipe(jsFilter.restore);
});
gulp.task('bowercss', function() {
    var cssFilter = gulpFilter('**/*.css', {restore: true});
    return gulp.src(mainBowerFiles())
        .pipe(cssFilter)
        .pipe(concat('vendors.css'))
        /*.pipe(urlAdjuster({
          replace:  ['./fonts/materialdesignicons-webfont','../fonts/materialdesignicons-webfont']
        }))*/
        .pipe(gulp.dest(dist.css))
        .pipe(cssFilter.restore);
});
gulp.task('icons', function() {
  var fontsFilter = gulpFilter('/**/*.{ttf,woff,eof,svg}', {restore: true});
  gulp.src(mainBowerFiles())
  .pipe(fontsFilter)
  .pipe(gulp.dest(dist.fonts));

  gulp.src('bower_components/components-font-awesome/fonts/**.*') 
        .pipe(gulp.dest('./app/public/fonts')); 
});
gulp.task('bundle', function() {
    return gulp.src('scripts/**/*.js')
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dist.js))
        .pipe(connect.reload());
});
gulp.task('stylus', function() {
    return gulp.src('app/styles/styls/app.styl')
        .pipe(stylus({
            compress: true
        }))
        .pipe(gulp.dest('app/styles'))
        .pipe(connect.reload());
});
gulp.task('html', function () {
  gulp.src('app/*.html')
    .pipe(connect.reload());
});


gulp.task('webserver', function() {
    connect.server({
      root:'app',
      port: 9000,
      livereload: true
    });
});
gulp.task('watch', function() {
    gulp.watch('app/styles/styls/*.styl', ['stylus']);
    gulp.watch('bower_components/**', ['bower']);
    gulp.watch(['app/*.html'], ['html']);
})
gulp.task('default', ['webserver','bower','bowercss','icons','watch','stylus']);
