const gulp = require('gulp');
const debug = require('gulp-debug');
const babel = require("gulp-babel");
const sourcemaps = require('gulp-sourcemaps');
const ui5preload = require('gulp-ui5-preload');
const uglify = require('gulp-uglify');

var bToMinify = false;
// var bGulpV4 = gulp.series ? true : false;

const NAMESPACE = "cloudui5";
const DIST_PATH = "dist/";
const SRC_PATH = "src/";

/**
 * Function that compiles ALL the typescript files and converts them into JS
 * in the staging folder.
 */
function compileAllTS() {
    var sFinalDest = `${DIST_PATH}`;

    return function () {

        var stream = gulp.src([
            `${SRC_PATH}**/*.ts`,
            `!${SRC_PATH}**/*.d.ts`,
        ]);

        stream = stream.pipe(sourcemaps.init())
            .pipe(debug({ title: "TS file with sourcemaps" }));

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

        if (!bToMinify) {
            stream = stream.pipe(sourcemaps.write());
        }

        stream = stream.pipe(gulp.dest(sFinalDest));

        stream = stream.pipe(debug({ title: "Compiled TS file " }));

        return stream;
    };
}

function compileUI5() {
    return function() {
        var stream = gulp.src([
            `${DIST_PATH}**/*.js`,
            `!${DIST_PATH}/index.js`,
            `!${DIST_PATH}**/*-preload.js`,
        ]);
    
        stream = stream.pipe(uglify({ mangle: false }))
            .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); });
        stream = stream.pipe(ui5preload({
            base: `${DIST_PATH}`,
            namespace: NAMESPACE,
            isLibrary: true
        }))
            .pipe(gulp.dest(DIST_PATH));

        return stream;
    }
}

function copyLibraryDef() {
    return function() {
        var stream = gulp.src([
            `${SRC_PATH}library.js`,
        ])
            .pipe(gulp.dest(DIST_PATH));

        return stream;
    }
}

// exports.default = gulp.series(compileAllTS(), createDeclarations());
exports.default = gulp.series(compileAllTS(), compileUI5(), copyLibraryDef());