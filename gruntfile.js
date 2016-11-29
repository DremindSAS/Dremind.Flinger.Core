module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';\n',
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
            },
            FlingerJS: {
                src: [
                    './src/Cross.js',
                    './src/SocketHub.js',
                    './src/*.js',
                    '!./src/FlingerInit.js',
                    './src/FlingerInit.js'
                ],
                dest: './build/flinger.js'
            }
        },
        uglify: {
            FlingerMinJS: {
                files: {
                    './build/flinger.min.js': './build/flinger.js'
                }
            }
        },
        copy: {
            FlingerJSTest: {
                files: [
                    {expand: true, src: ['./build/*'], dest: './test/', filter: 'isFile'},
                ]
                
            }
        },
        watch: {
            files: ['./src/*.js'],
            tasks: ['default']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['concat', 'uglify', 'copy']);
};