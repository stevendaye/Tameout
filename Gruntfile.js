/* Atomatings tasks in our app through a Gruntfile */
/* Configuring our Gruntfile */
require("dotenv/config");

module.exports = grunt => {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        git_head: process.env.GIT_HEAD,
        nodeunit: {
            all: ["tests/*.js"]
        },
        preprocess: {
            dist: {
                files: {
                    "views/chat.ejs": "views/chat.pre",
                    "views/layout.ejs": "views/layout.pre",
                    "js_src/src/chat.js": "js_src/src/chat.pre.js"
                }
            }
        },
        clean: {
            dist: {
                src: ["static/js/*.js"]
            }
        },
        jshint: {
            dist: {
                src: [
                    "js_src/src/*.js", "!js_src/src/md5.js",
                    "app.js", "components/*.js", "middleware/*.js", "models/*.js", "passport/*.js",
                    "queue/*.js", "redis/*.js", "routes/*.js", "socket.io/*.js", "workers/*.js", "!tests/*js"
                ]
            }
        },
        concat: {
            app: {
                src: [
                    "js_src/src/components.js", "js_src/src/models.js",
                    "js_src/src/chat.js", "js_src/src/md5.js"
                ],
                dest: ["static/js/ChatPage.js"]
            },
            frameworks: [
                "bower_components/jquery/dist/jquery.min.js",
                "bower_components/underscore/underscore-min.js",
                "bower_components/backbone/backbone.js",
                "bower_components/react/react.js",
                "bower_components/postal.js/lib/postal.js",
                "bower_components/moment/moment.js",
                "bower_components/conduitjs/lib/conduit.js",
                "bower_components/lodash/dist/lodash.js"
            ],
            dest: ["static/js/Frameworks.js"]
        },
        uglify: {
            dist: {
                files: {
                    "static/js/ChatPage.<%= git_head %>.min.js": "<%= concat.app.dest %>",
                    "static/js/Frameworks.<%= git_head %>.min.js": "<%= concat.frameworks.dest %>"
                }
            }
        },
        watch: {
            files: ["js_src/src/*.js"],
            tasks: ["default"]
        }
    });

    // Loading Grunt packages for each required task;
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-nodeunit");
    grunt.loadNpmTasks("grunt-preprocess");

    // Loading Tasks;
    grunt.registerTask("default", ["preprocess", "concat", "uglify"]);
    grunt.registerTask("test", ["nodeunit"]);
    grunt.registerTask("start", ["preprocess", "clean", "jshint", "concat"]);
    grunt.registerTask("prep", ["preprocess"]);
};
