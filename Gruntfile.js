/*jslint undef: true */
module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('./package.json'),

    exec: {
      bower_install: 'bower install',
      http_server_run: 'http-server . -p 3000',
      clean_exec: 'rm app.zip',
      compile_project: 'zip app.zip -r "assets/" "vendor/" "package.json" "index.html"',
      run_project: 'nwjs-v0.12.3-linux-x64/nw app.zip'
    },
    
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'bower_components/bootstrap/dist/css',
            src: ['**/*'],
            dest: 'vendor/bootstrap/css'
          },
          {
            expand: true,
            cwd: 'bower_components/bootstrap/dist/fonts',
            src: ['**/*'],
            dest: 'vendor/bootstrap/fonts'
          },
          {
            expand: true,
            cwd: 'bower_components/angular',
            src: [
              'angular.min.js',
              'angular.min.js.map'
            ],
            dest: 'vendor/angular/'
          },
          {
            expand: true,
            cwd: 'bower_components/angular-resource',
            src: [
              'angular-resource.min.js',
              'angular-resource.min.js.map'
            ],
            dest: 'vendor/angular/'
          },
          {
            expand: true,
            cwd: 'bower_components/angular-route',
            src: [
              'angular-route.min.js',
              'angular-route.min.js.map'
            ],
            dest: 'vendor/angular/'
          },

          {
            expand: true,
            cwd: 'bower_components/angular-animate',
            src: [
              'angular-animate.min.js',
              'angular-animate.min.js.map'
            ],
            dest: 'vendor/angular/'
          },
          {
            expand: true,
            cwd: 'bower_components/angular-sanitize',
            src: [
              'angular-sanitize.min.js',
              'angular-sanitize.min.js.map'
            ],
            dest: 'vendor/angular/'
          }
        ]
      }
    }
    
  });

  /* load every plugin in package.json */
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-copy');
  
  /* grunt tasks */
  grunt.registerTask(
    'default',
    ['exec:bower_install', 'copy']
  );

  grunt.registerTask(
    'debug',
    ['exec:http_server_run']
  );

  grunt.registerTask(
    'compile',
    ['exec:clean_exec', 'exec:compile_project']
  );

  grunt.registerTask(
    'run',
    ['exec:clean_exec', 'exec:compile_project', 'exec:run_project']
  );

};