import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';


const PATHS = {
    stylesheets: 'source/**/*.scss',
    javascripts: 'source/**/*.js',
    templates: 'source/**/*.html',
    images: 'source/images/**/*'
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


gulp.task('copystatic', () => {
    return gulp.src([PATHS.templates, PATHS.images])
        .pipe(gulp.dest(BUILD_DIRECTORY));
});


gulp.task('build', ['buildcss', 'buildjs', 'copystatic']);


gulp.task('watch', () => {
    gulp.watch(PATHS.stylesheets, ['buildcss']);
    gulp.watch(PATHS.javascripts, ['buildjs']);
    gulp.watch([PATHS.templates, PATHS.images], ['copystatic']);
});


gulp.task('default', ['build', 'watch']);
