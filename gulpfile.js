var gulp = require("gulp");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var webpack = require('webpack-stream');

gulp.task("build", function () {
  return gulp.src(["src/index.js"])
    .pipe(webpack({  
        watch: true,
        output: {
            filename: "game.js"
        },
        resolve: {
            extensions: ['','.js']
        },
        module: {
            loaders: [
                { test: /\.(js)$/, loader: 'babel?presets[]=es2015!', exclude: /(node_modules)/, }
            ]
        }})
    )
    .pipe(gulp.dest("./js/"));
});