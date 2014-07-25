module.exports = ( grunt ) ->
    sourceFiles = [ "./lib/index.coffee", "./lib/**/*.hbs" ]
    watchFiles  = [ "./lib/**/*.coffee", "./lib/**/*/js", "./lib/**/*.hbs", "./lib/**/*.html" ]
    sassFiles   = [ "./lib/sass/**/*.scss", "./lib/sass/**/*.sass" ]

    # Project configuration
    #
    grunt.initConfig
        pkg:    grunt.file.readJSON( "package.json" )

        # Clean the distribution folder
        #
        clean:
            dist:
                src: [ "dist" ]

            uglify:
                src: [ "dist/lib/bundle.js" ]

        # Watch the files for changes and rebuild as needed
        #
        watch:
            options:
                livereload: true

            sass:
                files: sassFiles
                tasks: [ "compass:debug", "copy:dist", "string-replace:debug" ]


        # Bundle the code modules
        #
        browserify:
            dist:
                files:
                    "dist/lib/bundle.js": sourceFiles

                options:
                    browserifyOptions:
                        extensions:         [ ".js", ".coffee", ".hbs" ]

            debug:
                files:
                    "dist/lib/bundle.js": sourceFiles

                options:
                    watch:                  true
                    browserifyOptions:
                        extensions:         [ ".js", ".coffee", ".hbs" ]

                    bundleOptions:
                        debug:              true

            watch:
                files:
                    "dist/lib/bundle.js": sourceFiles

                options:
                    watch:                  true

                    browserifyOptions:
                        extensions:         [  ".js", ".coffee", ".hbs" ]

                    bundleOptions:
                        debug:              true

        # Optimize the JavaScript code
        #
        uglify:
            dist:
                files:
                    "dist/lib/bundle.min.js": [ "dist/lib/bundle.js" ]

        # Add the build number to the bundle loader for cache busting reasons
        #
        "string-replace":
            dist:
                files:
                    "dist/lib/index.html": "lib/index.html"
                options:
                    replacements: [
                        pattern:        "bundle.min.js"
                        replacement:    "bundle.min.js?build=" + ( grunt.option( "bambooNumber" ) or +( new Date() ) )
                    ]
            debug:
                files:
                    "dist/lib/index.html": "lib/index.html"
                options:
                    replacements: [
                        pattern:        "bundle.min.js"
                        replacement:    "bundle.js?build=" + ( grunt.option( "bambooNumber" ) or +( new Date() ) )
                    ]

        # Prepare the dist folder
        #
        copy:
            dist:
                files:
                    [
                        expand: true
                        cwd: "src"
                        src:
                            [
                                "**/*"
                                "!**/*.coffee"
                                "!collections/**"
                                "!models/**"
                                "!views/**"
                                "!routers/**"
                                "!sass/**"
                                "!vendor/**"
                                "!style/images/icons/*.{png,gif,jpg}"
                            ]
                        dest: "dist/lib"
                    ]

        # Create the distribution archive
        #
        compress:
            dist:
                options:
                    archive: "dist/<%= pkg.name %>-<%= pkg.version %>.zip"
                expand: true
                cwd:    "dist/lib"
                src:    [ "**/*" ]
                dest:   "."

            debug:
                options:
                    archive: "dist/<%= pkg.name %>-<%= pkg.version %>-DEBUG.zip"
                expand: true
                cwd:    "dist/lib"
                src:    [ "**/*" ]
                dest:   "."

        # Setup the SASS compiling using compass
        #
        compass:
            config:                 "config.rb"
            dist:
                options:
                    sassDir:        "lib/sass"
                    cssDir:         "dist/lib/style"
                    environment:    "production"

            debug:
                options:
                    sassDir:        "lib/sass"
                    cssDir:         "dist/lib/style"
                    outputStyle:    "nested"

        mochaTest:
            test:
                options:
                    reporter:   "spec"
                    require:    "coffee-script"
                    timeout:    30000
                src: [ "test/**/*.js", "test/**/*.coffee" ]


    # These plug-ins provide the necessary tasks
    #
    grunt.loadNpmTasks "grunt-browserify"
    grunt.loadNpmTasks "grunt-contrib-watch"
    grunt.loadNpmTasks "grunt-contrib-clean"
    grunt.loadNpmTasks "grunt-contrib-copy"
    grunt.loadNpmTasks "grunt-contrib-compress"
    grunt.loadNpmTasks "grunt-contrib-compass"
    grunt.loadNpmTasks "grunt-contrib-uglify"
    grunt.loadNpmTasks "grunt-mocha-test"
    grunt.loadNpmTasks "grunt-string-replace"

    # Write the build file
    #
    grunt.registerTask( "writeBuildFile", "Create build description file", () ->
        # Get the bamboo variables if they are present
        #
        pkg       = grunt.file.readJSON( "package.json" )
        buildInfo =
            number:     grunt.option( "bambooNumber" ) or +( new Date() )
            key:        grunt.option( "bambooKey"    ) or "LOCALBUILD"
            name:       pkg.name
            version:    pkg.version
            created:    new Date()

        grunt.file.write( "dist/lib/build.json", JSON.stringify( buildInfo, null, "  " ) )
    )

    # Default tasks
    #
    grunt.registerTask "default",
    [
        "clean:dist"
        "browserify:dist"
        "uglify:dist"
        "clean:uglify"
        "compass:dist"
        "copy:dist"
        "string-replace:dist"
        "writeBuildFile"
        "compress:dist"
    ]

    grunt.registerTask "debug",
    [
        "clean:dist"
        "browserify:debug"
        "compass:debug"
        "copy:dist"
        "string-replace:debug"
        "writeBuildFile"
        "compress:debug"
    ]

    grunt.registerTask "dev",
    [
        "clean:dist"
        "browserify:debug"
        "compass:debug"
        "copy:dist"
        "string-replace:debug"
        "watch"
    ]

    grunt.registerTask "test",
    [
        "mochaTest"
    ]