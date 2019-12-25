var gulp = require('gulp'),
	sass = require('gulp-sass'),
//	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	sourcemaps = require('gulp-sourcemaps'),
	prefix = require('gulp-autoprefixer'),
	htmlbeautify = require('gulp-html-beautify'),
	connect = require('gulp-connect'),
	pug = require('gulp-pug');

var options = { indentSize: 2 };

var pugSources = ['pug/**/!(_)*.pug'],
	pugIncludes = ['pug/includes/**/*.pug'],
	jsSources = ['assets/**/*.js'],
	imgSources = ['assets/**/*.jpg', 'assets/**/*.png'],
	sassSources = ['assets/scss/**/*.scss'],
	htmlSources = ['**/*.html', '!node_modules/**'],
	dist = 'dist';

//Local server
gulp.task('connect', function () {
	connect.server({
		host: 'localhost',
		port: 7000,
		livereload: true,
		root: 'dist'
	});
});

gulp.task('html', function() {
	gulp.src(htmlSources)
		.pipe(gulp.dest(dist))
		.pipe(connect.reload())
});

gulp.task('js', function() {
	gulp.src(jsSources)
		.pipe(sourcemaps.init())
//		.pipe(uglify())
//		.pipe(concat('script.js'))
		.pipe(sourcemaps.write(''))
		.pipe(gulp.dest('dist/assets'))
		.pipe(connect.reload())
});

gulp.task('images', function () {
	gulp.src(imgSources)
		.pipe(gulp.dest(dist))
});


gulp.task('pug', function () {
	gulp.src(pugSources)
		.pipe(pug())
		.pipe(htmlbeautify(options))
		.pipe(gulp.dest(dist))
		.pipe(connect.reload())
});

//sass compiler
gulp.task('sass', function () {
	return gulp.src(sassSources)
		.pipe(sourcemaps.init())
		.pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
		.pipe(prefix({
			browsers: ['> 1%', 'IE 9'],
			cascade: false
		}))
		.pipe(sourcemaps.write(''))
		.pipe(gulp.dest('dist/assets/css'));
});


//watch
gulp.task('watch', ['sass', 'js', 'html', 'images', 'pug'], function () {
	gulp.watch(sassSources, ['sass']);
	gulp.watch(pugSources, ['pug']);
	gulp.watch(pugIncludes, ['pug']);
	gulp.watch(imgSources, ['images'])
	//gulp.watch(htmlSources, ['html']);
});

gulp.task('default', ['sass', 'js', 'pug', 'html', 'images', 'watch', 'connect']);