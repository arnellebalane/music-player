import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';
import nunjucks from 'gulp-nunjucks-html';


const PATHS = {
    stylesheets: 'source/**/*.scss',
    javascripts: 'source/**/*.js',
    templates: 'source/**/*.html',
    images: 'source/**/*.{svg,png,jpeg,jpg}'
};
const BUILD_DIRECTORY = 'distribution';


gulp.task('buildcss', () => {
    return gulp.src(PATHS.stylesheets)
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest(BUILD_DIRECTORY));
});


gulp.task('buildjs', () => {
    return gulp.src(PATHS.javascripts)
        .pipe(plumber())
        .pipe(babel())
        .pipe(gulp.dest(BUILD_DIRECTORY));
});


gulp.task('buildhtml', () => {
    return gulp.src(PATHS.templates)
        .pipe(plumber())
        .pipe(nunjucks({ searchPaths: ['source'] }))
        .pipe(gulp.dest(BUILD_DIRECTORY));
});


gulp.task('copystatic', () => {
    return gulp.src(PATHS.images)
        .pipe(gulp.dest(BUILD_DIRECTORY));
});


gulp.task('build', ['buildcss', 'buildjs', 'copystatic']);


gulp.task('watch', () => {
    gulp.watch(PATHS.stylesheets, ['buildcss']);
    gulp.watch(PATHS.javascripts, ['buildjs']);
    gulp.watch(PATHS.templates, ['buildhtml']);
    gulp.watch(PATHS.images, ['copystatic']);
});


gulp.task('default', ['build', 'watch']);
