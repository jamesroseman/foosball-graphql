const gulp = require('gulp');
const ts = require('gulp-typescript');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

gulp.task('copy-schemas', function() {
    gulp.src(['src/**/*.graphql'], { "base" : "src/schema/" })
        .pipe(gulp.dest('dist/schema'))
});

gulp.task('transpile', () => {
  gulp.start('copy-schemas')
  const tsResult = tsProject.src()
    .pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('watch', ['transpile'], () => {
  gulp.watch('src/**/*.ts', ['transpile', 'copy-schemas']);
});

gulp.task('assets', function() {
  return gulp.src(JSON_FILES)
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['watch', 'assets']);
