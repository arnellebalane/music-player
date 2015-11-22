import gulp from 'gulp';
import plumber from 'gulp-plumber';
import jade from 'gulp-jade';
import stylus from 'gulp-stylus';
import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';


gulp.task('templates', () => {
    return gulp.src('src/**/*.jade', { base: 'src' })
        .pipe(plumber())
        .pipe(jade())
        .pipe(gulp.dest('build'));
});


gulp.task('stylesheets', () => {
    return gulp.src('src/**/*.styl', { base: 'src' })
        .pipe(plumber())
        .pipe(stylus())
        .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
        .pipe(gulp.dest('build'));
});


gulp.task('javascripts', () => {
    return gulp.src('src/**/*.js', { base: 'src' })
        .pipe(plumber())
        .pipe(babel())
        .pipe(gulp.dest('build'));
});


gulp.task('copy', () => {
    return gulp.src([
            'src/**/images/**/*',
            'src/**/fonts/**/*'
        ], { base: 'src' })
        .pipe(gulp.dest('build'));
});


gulp.task('build', ['templates', 'stylesheets', 'javascripts', 'copy']);


gulp.task('watch', () => {
    gulp.watch('src/**/*.jade', ['templates']);
    gulp.watch('src/**/*.styl', ['stylesheets']);
    gulp.watch('src/**/*.js', ['javascripts']);
});


gulp.task('default', ['build', 'watch']);
