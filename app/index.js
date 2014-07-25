( function()
{
    "use strict";
    var util    = require( "util" );
    var path    = require( "path" );
    var yeoman  = require( "yeoman-generator" );

    // Determine packageName based on current folder name
    //
    var fullPath    = process.cwd();
    var packageName = fullPath.split( path.sep ).pop()

    var MadlibWebappGenerator = module.exports = function MadlibWebappGenerator( args, options, config )
    {
        yeoman.generators.Base.apply( this, arguments );

        this.on( "end", function( )
        {
            this.installDependencies(
            {
                skipInstall: options[ "skip-install" ]
            } );
        } );

        this.pkg         = JSON.parse( this.readFileAsString( path.join( __dirname, "../package.json" ) ) );
        this.currentYear = new Date().getFullYear()
    };

    util.inherits( MadlibWebappGenerator, yeoman.generators.Base );

    MadlibWebappGenerator.prototype.askFor = function askFor( )
    {
        var callback = this.async();

        // Have Yeoman greet the user
        //
        console.log( this.yeoman );

        // Ask the user for the webapp details
        //
        var prompts = [
            {
                name:       "packageName"
            ,   message:    "What is the name of this webapp?"
            ,   default:    packageName
            }
        ,   {
                name:       "packageDescription"
            ,   message:    "What is the purpose (description) of this webapp?"
            }
        ,   {
                name:       "mainName"
            ,   message:    "What is the main JavaScript file name of this webapp?"
            ,   default:    "index"
            }
        ,   {
                name:       "authorName"
            ,   message:    "What is your name?"
            ,   default:    this.user.git.username
            }
        ,   {
                name:       "authorEmail"
            ,   message:    "What is your email?"
            ,   default:    this.user.git.email
            }
        ,   {
                name:       "coffee"
            ,   message:    "Would you like to use CoffeeScript?"
            ,   type:       "confirm"
            ,   default:    true
            }
        ];

        this.prompt( prompts, function( props )
        {
            this.packageName        = props.packageName;
            this.packageDescription = props.packageDescription;
            this.mainName           = props.mainName;
            this.authorName         = props.authorName;
            this.authorEmail        = props.authorEmail;

            // Store the CoffeeScript preference for future sub-generator use
            //
            this.config.set( "coffee", props.coffee )

            callback();
        }.bind( this ) );
    };

    MadlibWebappGenerator.prototype.app = function app( )
    {
        // Create base folders
        //
        this.mkdir( "lib"  );
        this.mkdir( "test" );

        // Create Backbone folders
        //
        this.mkdir( "lib/models"        );
        this.mkdir( "lib/collections"   );
        this.mkdir( "lib/routers"       );
        this.mkdir( "lib/views"         );

        // Create vendor library folder
        //
        this.mkdir( "lib/vendor"        );

        // Create compass folders
        //
        this.mkdir( "lib/sass"          );
        this.mkdir( "lib/style"         );
        this.mkdir( "lib/style/images"  );


        this.template( "_package.json",     "package.json"      );
        this.template( "README.md",         "README.md"         );
        this.template( "lib/index.html",    "lib/index.html"    );
        this.template( "LICENSE",           "LICENSE"           );

        this.copy( "lib/config.rb",         "lib/config.rb" );

        if ( this.config.get( "coffee" ) === true )
        {
            this.copy( "lib/index.coffee",      "lib/" + this._.slugify( this.mainName ) + ".coffee" );
            this.copy( "GruntFile.coffee",      "GruntFile.coffee"  );
        }
        else
        {
            this.copy( "lib/index.js",          "lib/" + this._.slugify( this.mainName ) + ".js"     );
            this.copy( "GruntFile.js",          "GruntFile.js"  );
        }
    };

    MadlibWebappGenerator.prototype.projectfiles = function projectfiles( )
    {
        this.copy( "editorconfig",  ".editorconfig" );
        this.copy( "jshintrc",      ".jshintrc"     );
        this.copy( "gitignore",     ".gitignore"    );
    };
} )();