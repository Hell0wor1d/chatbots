//
//  Author:
//       Kev7n <root@kev7n.com>
//
//  Copyright (c) 2016 kev7n.com
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Lesser General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Lesser General Public License for more details.
//
//  You should have received a copy of the GNU Lesser General Public License
//  along with this program.  If not, see <http:#www.gnu.org/licenses/>.

var args = require('yargs').argv,
    gulp = require('gulp'),
    rev = require('gulp-rev'), //- add hashcode to assets
    cleanCSS = require('gulp-clean-css'), //mini css
    path = require('path'),
    flip = require('css-flip'),
    through = require('through2'),
    $ = require('gulp-load-plugins')(),
    gulpsync = $.sync(gulp),
    PluginError = $.util.PluginError,
    del = require('del'),
    revCollector = require('gulp-rev-collector'), //- location replacement
    shell = require('gulp-shell');
//browserSync = require('browser-sync');

// production mode (see build task)
var isProduction = false;
// styles sourcemaps
var useSourceMaps = false;

// Angular template cache
// Example:
//    gulp --usecache
var useCache = args.usecache;

// ignore everything that begins with underscore
var hidden_files = '**/_*.*';
var ignored_files = '!' + hidden_files;

// MAIN PATHS
var paths = {
    app: '../app/',
    markup: 'pug/',
    styles: 'less/',
    scripts: 'js/'
};

// VENDOR CONFIG
var vendor = {
    // vendor scripts required to start the app
    base: {
        source: require('./vendor.base.json'),
        dest: paths.app + 'static/js',
        name: 'base.js'
    },
    // vendor scripts to make the app work. Usually via lazy loading
    app: {
        source: require('./vendor.json'),
        dest: paths.app + 'static/vendor'
    }
};


// SOURCES CONFIG 
var source = {
    scripts: [paths.scripts + 'app.js',
        // custom modules
        paths.scripts + 'modules/**/*.module.js',
        paths.scripts + 'modules/**/*.js'
    ],
    templates: {
        index: [paths.markup + 'index.*'],
        views: [paths.markup + '**/*.*', '!' + paths.markup + 'index.*']
    },
    styles: {
        app: [paths.styles + '*.*'],
        watch: [paths.styles + '**/*']
    }
};

// BUILD TARGET CONFIG 
var build = {
    scripts: paths.app + '/static/js',
    styles: paths.app + '/static/css',
    templates: {
        index: paths.app + '/templates/',
        views: paths.app + '/static/',
        cache: paths.app + '/static/js/' + 'templates.js'
    }
};

// PLUGINS OPTIONS

var prettifyOpts = {
    indent_char: ' ',
    indent_size: 3,
    unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u', 'pre', 'code']
};

var vendorUglifyOpts = {
    mangle: {
        except: ['$super'] // rickshaw requires this
    }
};

var tplCacheOptions = {
    root: 'app',
    filename: 'templates.js',
    //standalone: true,
    module: 'app.core',
    base: function (file) {
        return file.path.split('pug')[1];
    }
};

var injectOptions = {
    name: 'templates',
    transform: function (filepath) {
        return 'script(src=\'' +
            filepath.substr(filepath.indexOf('app')) +
            '\')';
    }
};

//---------------
// TASKS
//---------------


// JS APP
gulp.task('scripts:app', function () {
    log('Building scripts..');
    // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src(source.scripts)
        .pipe($.jsvalidate())
        .on('error', handleError)
        .pipe($.if(useSourceMaps, $.sourcemaps.init()))
        .pipe($.concat('app.js'))
        .pipe($.ngAnnotate())
        .on('error', handleError)
        .pipe($.if(isProduction, $.uglify({
            preserveComments: 'some'
        })))
        .on('error', handleError)
        .pipe($.if(useSourceMaps, $.sourcemaps.write()))
        .pipe(gulp.dest(build.scripts));
});

// VENDOR BUILD
gulp.task('vendor', gulpsync.sync(['vendor:base', 'vendor:app']));

// Build the base script to start the application from vendor assets
gulp.task('vendor:base', function () {
    log('Copying base vendor assets..');
    return gulp.src(vendor.base.source)
        .pipe($.expectFile(vendor.base.source))
        .pipe($.if(isProduction, $.uglify()))
        .pipe($.concat(vendor.base.name))
        .pipe(gulp.dest(vendor.base.dest));
});

// copy file from bower folder into the app vendor folder
gulp.task('vendor:app', function () {
    log('Copying vendor assets..');

    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');

    return gulp.src(vendor.app.source, {
        base: 'bower_components'
    })
        .pipe($.expectFile(vendor.app.source))
        .pipe(jsFilter)
        .pipe($.if(isProduction, $.uglify(vendorUglifyOpts)))
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.if(isProduction, cleanCSS()))
        .pipe(cssFilter.restore())
        .pipe(gulp.dest(vendor.app.dest));

});

// APP LESS
gulp.task('styles:app', function () {
    log('Building application styles..');
    return gulp.src(source.styles.app)
        .pipe($.if(useSourceMaps, $.sourcemaps.init()))
        .pipe($.less())
        .on('error', handleError)
        .pipe($.if(isProduction, cleanCSS()))
        .pipe($.if(useSourceMaps, $.sourcemaps.write()))
        //.pipe(rev())
        .pipe(gulp.dest(build.styles));
    //.pipe(rev.manifest())  //- 生成一个rev-manifest.json
    //.pipe(gulp.dest(build.rev));
});

// pug
gulp.task('templates:index', ['templates:views'], function () {
    log('Building index..');

    var tplscript = gulp.src(build.templates.cache, {
        read: false
    });
    return gulp.src(source.templates.index)
        .pipe($.if(useCache, $.inject(tplscript, injectOptions))) // inject the templates.js into index
        .pipe($.pug())
        .on('error', handleError)
        .pipe($.htmlPrettify(prettifyOpts))
        .pipe(gulp.dest(build.templates.index));
});

// pug
gulp.task('templates:views', function () {
    log('Building views.. ' + (useCache ? 'using cache' : ''));

    if (useCache) {

        return gulp.src(source.templates.views)
            .pipe($.pug())
            .on('error', handleError)
            .pipe($.angularTemplatecache(tplCacheOptions))
            .pipe($.if(isProduction, $.uglify({
                preserveComments: 'some'
            })))
            .pipe(gulp.dest(build.scripts));
    } else {

        return gulp.src(source.templates.views)
            .pipe($.if(!isProduction, $.changed(build.templates.views, {
                extension: '.html'
            })))
            .pipe($.pug())
            .on('error', handleError)
            .pipe($.htmlPrettify(prettifyOpts))
            .pipe(gulp.dest(build.templates.views));
    }
});

//---------------
// WATCH
//---------------

// Rerun the task when a file changes
gulp.task('watch', function () {
    log('Starting watch and sync to app..');

    // $.livereload.listen();

    gulp.watch(source.scripts, ['scripts:app']);
    gulp.watch(source.styles.watch, ['styles:app', 'styles:app:rtl']);
    gulp.watch(source.templates.views, ['templates:views']);
    gulp.watch(source.templates.index, ['templates:index']);

    // a delay before triggering browser reload to ensure everything is compiled
    var livereloadDelay = 1500;
    // list of source file to watch for live reload
    var watchSource = [].concat(
        source.scripts,
        source.styles.watch,
        source.templates.views,
        source.templates.index
    );

    gulp
        .watch(watchSource)
        .on('change', function (event) {
            setTimeout(function () {
                log('file has been changed, ' + event.path);
                gulpsync.sync([
                    'vendor',
                    'assets'
                ]);
                // $.livereload.changed(event.path);
            }, livereloadDelay);
        });

});

// lint javascript
gulp.task('lint', function () {
    return gulp
        .src(source.scripts)
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe($.jshint.reporter('fail'));
});

// Remove all files from the build paths
gulp.task('clean', function (done) {
    var delconfig = [].concat(
        build.styles,
        build.scripts,
        build.templates.index + 'index.html',
        build.templates.views + 'views',
        build.templates.views + 'pages',
        vendor.app.dest
    );

    log('Cleaning: ' + $.util.colors.blue(delconfig));
    // force: clean files outside current directory
    del(delconfig, {
        force: true
    }, done);
});

// add hash code to assets css
// https://github.com/sindresorhus/gulp-rev
gulp.task('assets:css', function () {
    // by default, gulp would pick `assets/css` as the base,
    // so we need to set it explicitly:
    return gulp.src([build.styles + '/*.css'])
    //.pipe(gulp.dest('build/assets'))  // copy original assets to build dir
        .pipe(rev())
        .pipe(gulp.dest(build.styles)) // write rev'd assets to build dir
        .pipe(rev.manifest())
        .pipe(gulp.dest(build.styles)); // write manifest to build dir
});

// add hash code js
gulp.task('assets:js', function () {
    return gulp.src([build.scripts + '/*.js'])
    //.pipe(gulp.dest('build/assets'))  // copy original assets to build dir
        .pipe(rev())
        .pipe(gulp.dest(build.scripts)) // write rev'd assets to build dir
        .pipe(rev.manifest())
        .pipe(gulp.dest(build.scripts)); // write manifest to build dir
});

// add version to assets
gulp.task('rev', function () {
    gulp.src([paths.app + '/static/**/*.json', build.templates.index + 'index.html']) //- 读取 rev-manifest.json 文件以及需要进行css/js名替换的文件
        .pipe(revCollector()) //- 执行文件内css/js名的替换
        .pipe(gulp.dest(build.templates.index)); //- 替换后的文件输出的目录
});

// build version
gulp.task('assets:version', gulpsync.sync([
    'assets:css',
    'assets:js',
    'rev'
]));

//---------------
// MAIN TASKS
//---------------

// build for production (minify)
gulp.task('build', gulpsync.sync([
    'prod',
    'vendor',
    'assets',
    'assets:version'
]));

gulp.task('run', shell.task(['cd ../app/ && python ../app/dev.py']));

gulp.task('prod', function () {
    log('Starting production build...');
    isProduction = true;
});

// build with sourcemaps (no minify)
gulp.task('sourcemaps', ['usesources', 'default']);
gulp.task('usesources', function () {
    useSourceMaps = true;
});

// default (no minify)
gulp.task('default', gulpsync.sync([
    'vendor',
    'assets',
    'watch'
]), function () {

    log('************');
    log('* All Done * You can start editing your code, the changes will be synced to your app assets folder automatically..');
    log('************');

});

gulp.task('assets', [
    'scripts:app',
    'styles:app',
    'templates:index',
    'templates:views'
]);


/////////////////////


// Error handler
function handleError(err) {
    log(err.toString());
    this.emit('end');
}

// log to console using 
function log(msg) {
    $.util.log($.util.colors.blue(msg));
}
