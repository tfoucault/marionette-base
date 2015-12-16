/**
 * Created by tfoucault on 28/11/2015.
 */

module.exports = function(grunt) {

  grunt.initConfig({

    "handlebars": {
      compile: {
        options: {
          // Wraps templates into define amd block
          amd: true
        },
        src: ["public/templates/**/*.hbs"],
        dest: "public/scripts/tpls/precompiled.handlebars.js"
      }
    },

    "less": {
      development: {
        files: {
          "public/styles/starter-template.css": "public/styles/starter-template.less",
          "public/styles/table-style.css": "public/styles/table-style.less"
        }
      },
      // Only process to create prod release
      production: {
        files: {
          "public/dist/css/starter-template.css": "public/styles/starter-template.less",
          "public/dist/css/table-style.css": "public/styles/table-style.less"
        }
      }
    },

    // Only process to create prod release
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'public/dist/css',
          src: ['*.css'],
          dest: 'public/dist/css',
          ext: '.min.css'
        }]
      }
    },

    // Only process to create prod release
    concat: {
      css: {
        src: [
          'public/dist/css/starter-template.min.css',
          'public/dist/css/table-style.min.css'
        ],
        dest: 'public/dist/style.min.css'
      }
    }
  });

  // Requires the needed plugin
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-less');

  // Task to run in dev when templates or styles change
  grunt.registerTask('dev','Automated tasks for dev', ['handlebars:compile','less:development']);
  grunt.registerTask('dist','Create distant package for prod', ['handlebars:compile','less:production','cssmin','concat']);
};