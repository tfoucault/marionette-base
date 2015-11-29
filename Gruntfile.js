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
        src: ["public/templates/**/*.html"],
        dest: "public/scripts/tpls/precompiled.handlebars.js"
      }
    }
  });

  // Requires the needed plugin
  grunt.loadNpmTasks('grunt-contrib-handlebars');
};