/**
 * @module count文件时的默认注释规则
 * 
 */

module.exports = {
    js: [
            {
                multiple: {start: '/*', end: '*/'},
                single: '//'
            }
    ],
    jsx: [
            {
                multiple: {start: '/*', end: '*/'},
                single: '//'
            }
    ],
    java: [
            {
                multiple: {start: '/*', end: '*/'},
                single: '//'
            }
    ],
    html: [
            {
                multiple: {start: '<!--', end: '-->'} 
            }
    ],
    css: [
            {
                multiple: {start: '/*', end: '*/'} 
            }
    ],
    vue: [
            {
                multiple: {start: '/*', end: '*/'},
                single: '//'
            },
            {
                multiple: {start: '<!--', end: '-->'} 
            }
    ]
}