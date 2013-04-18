module.exports = function(grunt) {
"use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
   //  grunticon: {
   //    options: {
			// src: "src/icons/",
			// dest: "dist/icons/"
	  //   }
   //  }
    grunticon: {
			options: {
				// required config
				src: "src/icons/",
				dest: "dist/icons/",

				// optional grunticon config properties

				// CSS filenames
				datasvgcss: "icons.data.svg.css",
				datapngcss: "icons.data.png.css",
				urlpngcss: "icons.fallback.css",

				// preview HTML filename
				previewhtml: "preview.html",

				// grunticon loader code snippet filename
				loadersnippet: "grunticon.loader.txt",

				// folder name (within dest) for png output
				pngfolder: "png/",

				// prefix for CSS classnames
				cssprefix: "icon-",

				// css file path prefix - this defaults to "/" and will be placed before the "dest" path when stylesheets are loaded.
				// This allows root-relative referencing of the CSS. If you don't want a prefix path, set to to ""
				cssbasepath: "/"

			}
    }
  });

	grunt.loadNpmTasks('grunt-grunticon');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['grunticon', 'concat', 'uglify']);

};