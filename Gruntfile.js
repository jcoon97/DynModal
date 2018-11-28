module.exports = function(grunt) {
    grunt.initConfig({
        ts: {
            build: {
                tsconfig: "./tsconfig.json"
            }
        },
        uglify: {
            dev: {
                options: {
                    beautify: true
                },
                files: [{
                    src: "ts-build/**/*.js",
                    dest: "build/dynmodal.min.js"
                }]
            },
            dist: {
                options: {
                    beautify: false,
                    banner: grunt.file.read("banner.txt")
                },
                files: [{
                    src: "ts-build/**/*.js",
                    dest: "dist/dynmodal.min.js"
                }]
            }
        }
    });

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-contrib-uglify-es");

    grunt.registerTask("dev", ["ts:build", "uglify:dev"]);
    grunt.registerTask("deploy", ["ts:build", "uglify:dist"]);
};