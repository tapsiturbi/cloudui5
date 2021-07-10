const gulp = require('gulp');
const debug = require('gulp-debug');
const babel = require("gulp-babel");
const sourcemaps = require('gulp-sourcemaps');

// const ts = require("typescript");
const ts = require("gulp-typescript");
// const rename = require("gulp-rename");

var bToMinify = false;
// var bGulpV4 = gulp.series ? true : false;

const DIST_PATH = "dist/";
const SRC_PATH = "src/";

/**
 * Function that compiles ALL the typescript files and converts them into JS
 * in the staging folder.
 */
function compileAllTS() {
    var sFinalDest = `${DIST_PATH}`;

    return function() {

        var stream = gulp.src([
            `${SRC_PATH}**/*.ts`,
            `!${SRC_PATH}**/*.d.ts`,
        ]);

        // only get files that have changed
        // if ( !bToMinify ) {
        //     stream = stream.pipe(changed(sFinalDest, {extension: ".js"}))
        //         .pipe(debug({ title: "TS file [changed]" }));
        // }

        // include sourcemaps only if not minifying
        // if ( !bToMinify ) {
            stream = stream.pipe(sourcemaps.init())
                .pipe(debug({ title: "TS file with sourcemaps" }));
        // }

        // run babel twice:
        // 1. first to remove arrow functions and return types
        // 2. second, convert to UI5
        stream = stream.pipe(babel({
                presets: [
                    "@babel/preset-typescript",
                    // "@babel/preset-env",
                ],
                plugins: [
                    ["@babel/plugin-proposal-class-properties", { "loose": true }],
                    "@babel/plugin-transform-flow-strip-types",
                    "@babel/plugin-transform-arrow-functions"
                ],
            }))
            .on('error', function (err) { console.log("Error1: ", err.toString()); })
            .pipe(babel({
                presets: ["transform-ui5"]
            }))
            .on('error', function (err) { console.log("Error2: ", err.toString()); });

        if ( !bToMinify ) {
            stream = stream.pipe(sourcemaps.write());
        }

        stream = stream.pipe(gulp.dest(sFinalDest));

        stream = stream.pipe(debug({ title: "Compiled TS file " }));

        return stream;
    };
}

function createDeclarations() {
    return function() {
        var stream = gulp.src([
            `${SRC_PATH}**/*.ts`,
            `!${SRC_PATH}**/*.d.ts`,
        ]);

        var tsProject = ts.createProject("tsconfig.json", {"emitDeclarationOnly": true});
        // var stream = tsProject.src();
        stream = stream.pipe(tsProject()).dts;
        // stream = stream.pipe(debug({ title: "TSC called" }));

        // stream = stream.pipe(rename((path) => {
        //     path.extname = ".d.ts";
        // }));
        stream = stream.pipe(gulp.dest('dist'));

        return stream;
    }
}

// exports.default = gulp.series(compileAllTS(), createDeclarations());
exports.default = gulp.series(compileAllTS());