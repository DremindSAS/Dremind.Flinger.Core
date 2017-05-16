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
            FlingerDevJS: {
                src: [
                    './src/Cross.js',
                    './src/SocketHub.js',
                    './src/EventHUB.js',
                    './src/RATHub.js',
                    './src/ScreenshotHub.js',
                    './src/FlingerInit.js'
                ],
                dest: './dev-build/flinger.js'
            },
            FlingerProductionJS: {
                src: [
                    './src/Cross.js',
                    './src/SocketHub.js',
                    './src/EventHUB.js',
                    './src/RATHub.js',
                    './src/ScreenshotHub.js',
                    './src/FlingerInit.js'
                ],
                dest: './build/flinger.js'
            }
        },
        replace: {
            FlingerBackendDevJS: {
                options: {
                    patterns: [
                        {
                            match: /{BACKEND-URI}/g,
                            replacement: 'http://localhost:3500'
                        }
                    ]
                },
                files: [
                    { expand: true, flatten: true, src: ['dev-build/flinger.js'], dest: 'dev-build/' }
                ]
            },
            FlingerBackendProductionJS: {
                options: {
                    patterns: [
                        {
                            match: /{BACKEND-URI}/g,
                            replacement: 'http://crawlerbackend.azurewebsites.net'
                        }
                    ]
                },
                files: [
                    { expand: true, flatten: true, src: ['build/flinger.js'], dest: 'build/' }
                ]
            },
            FlingerCoreDevJS: {
                options: {
                    patterns: [
                        {
                            match: /{KERNEL-URI}/g,
                            replacement: 'http://localhost:3501'
                        }
                    ]
                },
                files: [
                    { expand: true, flatten: true, src: ['dev-build/flinger.js'], dest: 'dev-build/' }
                ]
            },
            FlingerCoreProductionJS: {
                options: {
                    patterns: [
                        {
                            match: /{KERNEL-URI}/g,
                            replacement: '//crawlersite-kernel.azurewebsites.net'
                        }
                    ]
                },
                files: [
                    { expand: true, flatten: true, src: ['build/flinger.js'], dest: 'build/' }
                ]
            },
        },
        uglify: {
            FlingerProductionMinJS: {
                files: {
                    './build/flinger.min.js': './build/flinger.js'
                }
            },
            FlingerDevMinJS: {
                files: {
                    './dev-build/flinger.min.js': './dev-build/flinger.js'
                }
            }
        },
        copy: {
            FlingerProductionAssets: {
                files: [
                    { expand: true, src: ['./assets/*'], dest: './build/', filter: 'isFile' }
                ]
            },
            FlingerDevAssets: {
                files: [
                    { expand: true, src: ['./assets/*'], dest: './dev-build/', filter: 'isFile' }
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
    grunt.loadNpmTasks('grunt-replace');

    grunt.registerTask('default', ['concat', 'replace', 'uglify', 'copy']);
};