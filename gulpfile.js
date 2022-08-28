let project_folder = 'dist',
    source_folder = 'src',
    path = {
        'build': {
            'html': project_folder + '/',
            'css':  project_folder + '/css/',
            'js':  project_folder + '/js/',
            'img':  project_folder + '/img/',
            'fonts':  project_folder + '/fonts/',
            'icons':  project_folder + '/icons/',
        },
        'src': {
            'html': source_folder + '/*.html',
            'css':  source_folder + '/scss/*.scss',
            'js':  source_folder + '/js/**/*.js',
            'img':  source_folder + '/img/**/*.{jpg,png,webp,gif}',
            'icons':  source_folder + '/icons/**/*.svg',
            'fonts':  source_folder + '/fonts/**/*.ttf',
        },
        'watch': {
            'html': source_folder + '/**/*.html',
            'css':  source_folder + '/scss/**/*.scss',
            'js':  source_folder + '/js/**/*.js',
            'img':  source_folder + '/img/**/*.{jpg,png,webp,svg,gif}',
            'icons':  source_folder + '/icons/**/*.svg',
        },
        'clean': './' + project_folder + '/'
    },
    svgConfig = {
        shape: {
            dimension: {
                maxWidth: 500,
                maxHeight: 500
            },
            spacing: {
                padding: 0
            },
            transform: [{
                "svgo": {
                    "plugins": [
                        { removeViewBox: false },
                        { removeUnusedNS: false },
                        { removeUselessStrokeAndFill: true },
                        { cleanupIDs: false },
                        { removeComments: true },
                        { removeEmptyAttrs: true },
                        { removeEmptyText: true },
                        { collapseGroups: true },
                    ]
                }
            }]
        },
        mode: {
            symbol: {
                dest : '.',
                sprite: 'sprite.svg'
            }
        }
    };

let {src, dest} = require('gulp'),
    gulp = require('gulp'),
    browswersync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include'),
    del = require('del'),
    scss = require('gulp-sass')(require('sass')),
    gropup_media = require('gulp-group-css-media-queries'),
    clean_css = require('gulp-clean-css'),
    clean_js = require('gulp-uglify-es').default,
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    svgSprite = require('gulp-svg-sprite'),
    ttf2woff = require('gulp-ttf2woff'),
    ttf2woff2 = require('gulp-ttf2woff2'),
    sort = require('gulp-sort');

function browserSync(){
    browswersync.init({
        server:{
            baseDir: path.clean
        },
        port: 3000,
        notify: false
    });
}

function html(){
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browswersync.stream())
}

function css(){
    return src(path.src.css)
        .pipe(sort())
        .pipe(concat('style.scss'))
        .pipe(
            scss({
                outputStyle: 'expanded'
            })
        )
        .pipe(
            gropup_media()
        )
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(
            rename({
                'extname': '.min.css'
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browswersync.stream())
}

function js(){
    return src(path.src.js)
        .pipe(concat('script.js'))
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(clean_js())
        .pipe(
            rename({
                'extname': '.min.js'
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browswersync.stream())
}

function img(){
    return src(path.src.img)
        .pipe(dest(path.build.img))
        .pipe(browswersync.stream())
}

function icons(){
    return src(path.src.icons)
        .pipe(svgSprite(svgConfig))
        .pipe(dest(path.build.icons))
        .pipe(browswersync.stream())
}

function fonts(){
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts))
}

function watchFiles(params){
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.img], img)
    gulp.watch([path.watch.icons], icons)
}

function clean(params){
    return del(path.clean)
}

let build = gulp.series(clean, gulp.parallel(js, css, img, html), icons, fonts);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fonts = fonts;
exports.icons = icons;
exports.img = img;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;