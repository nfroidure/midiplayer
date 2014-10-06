module.exports = function(grunt) {

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    
    grunt.initConfig({
        clean: ['dist'],
        
        browserify: {
            lib: {
                src: 'src/MIDIPlayer.js',
                dest: 'dist/MIDIPlayer.js',
                options: {
                    standalone: 'MIDIPlayer'
                }
            }
        },

        watch: {
            code: {
                files: ['src/**/*.js', 'tests/**/*.js'],
                tasks: ['dist', 'mochaTest']
            }
        },

        mochaTest: {
          test: {
            options: {
              reporter: 'spec'
            },
            src: ['tests/**/*.js']
          }
        }
    });

    grunt.registerTask('dist', [
        'clean',
        'browserify'
    ]);

    grunt.registerTask('test', [
        'mochaTest',
        'watch'
    ]);

    grunt.registerTask('default', [
        'test'
    ]);
};
