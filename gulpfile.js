/*var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload');
    // Styles任务
gulp.task('styles', function() {
    //编译sass
    return gulp.src('sass/index.scss')
    .pipe(sass())
    //添加前缀
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    //保存未压缩文件到我们指定的目录下面
    .pipe(gulp.dest(''))
    //给文件添加.min后缀
    .pipe(rename({ suffix: '.min' }))
    //压缩样式文件
    .pipe(minifycss())
    //输出压缩文件到指定目录
    .pipe(gulp.dest('assets'))
    //提醒任务完成
    .pipe(notify({ message: 'Styles task complete' }));
});
*/
//包含处理包
var gulp=require('gulp'),
    notify=require('gulp-notify'),
    autoprefixer=require('gulp-autoprefixer'),
    sass=require('gulp-sass');
//创建处理任务

gulp.task('cssTask',function(){
    //用gulp.src找到路径
    return gulp.src('./scss/index.scss')
    //编译sass
    .pipe(sass())
    //添加浏览器前缀
    .pipe(autoprefixer('last 2 version','safari 5','ie 8','ie 9','opera 12.1','ios6','android 4'))
    //用gulp.dest保存未压缩文件到指定目录
    .pipe(gulp.dest('maxcss'))
    .pipe(notify({message:'cssTask is ok ^_^!!'}));
});
//默认任务
gulp.task('default', function() {
    gulp.start('cssTask');
});
//监听自动执行
gulp.task('watch',function(){
    gulp.watch('scss/*.scss','cssTask');
})