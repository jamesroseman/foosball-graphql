const gulp = require('gulp');
const gulpConcat = require('gulp-concat');
var run = require('gulp-run');
const ts = require('gulp-typescript');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

// Helper gulp tasks

gulp.task('concat-schemas', function() {
  gulp.src(['src/**/*.graphql'], { "base" : "src/schema/" })
    .pipe(gulpConcat('schema.graphql'))
    .pipe(gulp.dest('dist/src/schema'));
});

gulp.task('copy-schemas', function() {
  gulp.src(['src/**/*.graphql'], { "base" : "src/schema/" })
    .pipe(gulp.dest('dist/src/schema'));
});

gulp.task('gen-typings', () => {
  gulp.start('concat-schemas')
  run('../node_modules/.bin/apollo-codegen download-schema dist/src/schema/schema.graphql --output dist/src/schema/schema.json').exec()
  run('../node_modules/.bin/gql-gen --file dist/src/schema/schema.json --template typescript --out src/schema/').exec()
});

// Main gulp tasks

gulp.task('transpile', () => {
  gulp.start('concat-schemas')
  gulp.start('gen-typings')
  gulp.start('copy-schemas')
  const tsResult = tsProject.src()
    .pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('watch', ['transpile'], () => {
  gulp.watch('src/**/*.ts', ['transpile']);
});

gulp.task('assets', function() {
  return gulp.src(JSON_FILES)
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['watch', 'assets']);
