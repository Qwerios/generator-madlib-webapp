module.exports = function( grunt )
{
    var sourceFiles = [ "./lib/index.coffee", "./lib/**/*.hbs" ];
    var watchFiles  = [ "./lib/**/*.coffee", "./lib/**/*/js", "./lib/**/*.hbs", "./lib/**/*.html" ];
    var sassFiles   = [ "./lib/sass/**/*.scss", "./lib/sass/**/*.sass" ];

    grunt.initConfig(
    {
        pkg: grunt.file.readJSON( "package.json" ),
        clean:
        {
            dist:
            {
                src: [ "dist" ]
            },
            uglify:
            {
                src: [ "dist/lib/bundle.js" ]
            }
        },
        watch:
        {
            options:
            {
                livereload: true
            },
            sass:
            {
                files: sassFiles,
                tasks: [ "compass:debug", "copy:dist", "string-replace:debug" ]
            }
        },
        browserify:
        {
            dist:
            {
                files:
                {
                    "dist/lib/bundle.js": sourceFiles
                },
                options:
                {
                    browserifyOptions:
                    {
                        extensions: [ ".js", ".coffee", ".hbs" ]
                    }
                }
            },
            debug:
            {
                files:
                {
                    "dist/lib/bundle.js": sourceFiles
                },
                options:
                {
                    watch: true,
                    browserifyOptions:
                    {
                        extensions: [ ".js", ".coffee", ".hbs" ]
                    },
                    bundleOptions:
                    {
                        debug: true
                    }
                }
            },
            watch:
            {
                files:
                {
                    "dist/lib/bundle.js": sourceFiles
                },
                options:
                {
                    watch: true,
                    browserifyOptions:
                    {
                        extensions: [ ".js", ".coffee", ".hbs" ]
                    },
                    bundleOptions:
                    {
                        debug: true
                    }
                }
            }
        },
        uglify:
        {
            dist:
            {
                files:
                {
                    "dist/lib/bundle.min.js": [ "dist/lib/bundle.js" ]
                }
            }
        },
        "string-replace":
        {
            dist:
            {
                files:
                {
                    "dist/lib/index.html": "lib/index.html"
                },
                options:
                {
                    replacements:
                    [
                        {
                            pattern:     "bundle.min.js",
                            replacement: "bundle.min.js?build=" + ( grunt.option( "bambooNumber" ) || +( new Date() ) )
                        }
                    ]
                }
            },
            debug:
            {
                files:
                {
                    "dist/lib/index.html": "lib/index.html"
                },
                options:
                {
                    replacements:
                    [
                        {
                            pattern: "bundle.min.js",
                            replacement: "bundle.js?build=" + ( grunt.option( "bambooNumber" ) || +( new Date() ) )
                        }
                    ]
                }
            }
        },
        copy:
        {
            dist:
            {
                files:
                [
                    {
                        expand: true,
                        cwd: "src",
                        src: [ "**/*", "!**/*.coffee", "!collections/**", "!models/**", "!views/**", "!routers/**", "!sass/**", "!vendor/**", "!style/images/icons/*.{png,gif,jpg}" ],
                        dest: "dist/lib"
                    }
                ]
            }
        },
        compress:
        {
            dist:
            {
                options:
                {
                    archive: "dist/<%= pkg.name %>-<%= pkg.version %>.zip"
                },
                expand: true,
                cwd:    "dist/lib",
                src:    [ "**/*" ],
                dest:   "."
            },
            debug:
            {
                options:
                {
                    archive: "dist/<%= pkg.name %>-<%= pkg.version %>-DEBUG.zip"
                },
                expand: true,
                cwd:    "dist/lib",
                src:    [ "**/*" ],
                dest:   "."
            }
        },
        compass:
        {
            config: "config.rb",
            dist:
            {
                options:
                {
                    sassDir:     "lib/sass",
                    cssDir:      "dist/lib/style",
                    environment: "production"
                }
            },
            debug:
            {
                options:
                {
                    sassDir:     "lib/sass",
                    cssDir:      "dist/lib/style",
                    outputStyle: "nested"
                }
            }
        },
        mochaTest:
        {
            test:
            {
                options:
                {
                    reporter: "spec",
                    require: "coffee-script",
                    timeout: 30000
                },
                src: [ "test/**/*.js", "test/**/*.coffee" ]
            }
        }
    } );

    grunt.loadNpmTasks( "grunt-browserify"       );
    grunt.loadNpmTasks( "grunt-contrib-watch"    );
    grunt.loadNpmTasks( "grunt-contrib-clean"    );
    grunt.loadNpmTasks( "grunt-contrib-copy"     );
    grunt.loadNpmTasks( "grunt-contrib-compress" );
    grunt.loadNpmTasks( "grunt-contrib-compass"  );
    grunt.loadNpmTasks( "grunt-contrib-uglify"   );
    grunt.loadNpmTasks( "grunt-mocha-test"       );
    grunt.loadNpmTasks( "grunt-string-replace"   );

    grunt.registerTask( "writeBuildFile", "Create build description file", function()
    {
        var pkg       = grunt.file.readJSON( "package.json" );
        var buildInfo =
        {
            number:     grunt.option( "bambooNumber" ) || +( new Date() ),
            key:        grunt.option( "bambooKey"    ) || "LOCALBUILD",
            name:       pkg.name,
            version:    pkg.version,
            created:    new Date()
        };
        return grunt.file.write( "dist/lib/build.json", JSON.stringify(buildInfo, null, "  " ) );
    } );

    grunt.registerTask( "default", [ "clean:dist", "browserify:dist", "uglify:dist", "clean:uglify", "compass:dist", "copy:dist", "string-replace:dist", "writeBuildFile", "compress:dist" ] );
    grunt.registerTask( "debug", [ "clean:dist", "browserify:debug", "compass:debug", "copy:dist", "string-replace:debug", "writeBuildFile", "compress:debug" ] );
    grunt.registerTask( "dev", [ "clean:dist", "browserify:debug", "compass:debug", "copy:dist", "string-replace:debug", "watch" ] );
    return grunt.registerTask( "test", [ "mochaTest" ] );
};
