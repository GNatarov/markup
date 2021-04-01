let {src,dest} = require('gulp');
let gulp = require('gulp');
let browsersync = require('browser-sync').create();
let fileinclude = require('gulp-file-include');
let del = require('del');
let scss = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer');
let group_media = require('gulp-group-css-media-queries');
let clean_css = require('gulp-clean-css');
let rename = require('gulp-rename');
let uglify = require('gulp-uglify-es').default;
let imagemin = require('gulp-imagemin');
let ttf2woff = require('gulp-ttf2woff');
let ttf2woff2 = require('gulp-ttf2woff2');
let fs = require('fs')


function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/",
        },
        port: 4000,
        notify: false
    })
}


function clean() {
    return del(path.clean)
}


let project_folder= "public";
let source_folder="src";

let path = {
    build:{
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/",
    },
    src:{
        html: [source_folder + "/*.html", "!"+source_folder + "/_*.html"],
        css: source_folder + "/scss/style.scss",
        js: source_folder + "/js/index.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: source_folder + "/fonts/*.ttf",
    },
    watch:{
        html: source_folder + "/**/*.html",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    },
    clean:"./" + project_folder + "/"
}


function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function fonts() {
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts))
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts))
}

function images() {
    return src(path.src.img)
    .pipe(imagemin({
        progressive: true,
        svgPlugin: [{removeViewBox: false}],
        interlaced: true,
        optimizationLevel: 3,
    }))
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(scss({
            outputStyle: "expanded",
        }))
        .pipe(group_media())
        .pipe(autoprefixer({
            overrideBrowserlist: ["last 5 version"],
            cascade: true
        }))
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

// function fontsStyle() {
//     let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss')
//     if(file_content == '') {
//         fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
//         return fs.readdir(path.build.fonts, function(err, items){
//             if(items) {
//                 let c_fontname;
//                 for (let i = 0; i < items.length; i++) {
//                     let fontname = items[i].split('.');
//                     if(c_fontname != fontname) {
//                         fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontfile + '")')
//                     })
                    
//                 }
//             }
//         })
//     }
// }

// function cb() {
    
// }

function watchFiles() {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.img], images)
}


let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts));
let watch = gulp.parallel(build,watchFiles,browserSync);



exports.fonts = fonts
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;