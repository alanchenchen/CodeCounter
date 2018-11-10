/**
 * @module count文件时的默认注释规则、默认过滤忽视的文件(夹)和默认二进制文件的类型
 * 
 **/

const Rule = {
    js: [
        {
            block: { start: '/*', end: '*/' },
            row: '//'
        }
    ],
    go: [
        {
            block: { start: '/*', end: '*/' },
            row: '//'
        }
    ],
    jsx: [
        {
            block: { start: '/*', end: '*/' },
            row: '//'
        }
    ],
    vue: [
        {
            block: { start: '/*', end: '*/' },
            row: '//'
        },
        {
            block: { start: '<!--', end: '-->' }
        }
    ],
    html: [
        {
            block: { start: '<!--', end: '-->' }
        }
    ],
    css: [
        {
            block: { start: '/*', end: '*/' }
        }
    ],
    java: [
        {
            block: { start: '/*', end: '*/' },
            row: '//'
        }
    ],
    c: [
        {
            block: { start: '/*', end: '*/' },
            row: '//'
        }
    ],
    cpp: [
        {
            block: { start: '/*', end: '*/' },
            row: '//'
        }
    ]
}

const ExcludePath = [
    'node_modules',
    '.git',
    '.gitignore',
    '.npmignore'
]

const BinaryType = ['jpg', 'png', 'jpeg', 'exe', 'pptx', 'ppt', 'docx', 'doc', 'xlsx', 'xls', 'pdf']

module.exports = {
    Rule,
    ExcludePath,
    BinaryType
}