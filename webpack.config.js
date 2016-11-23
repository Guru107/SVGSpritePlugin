var SVGSpritePlugin = require('./SVGSpritePlugin')
module.exports = {
    entry:'./index.js',
    output:{
        filename:'bundle.js',
        path:'public'
    },
    plugins: [
        new SVGSpritePlugin()
    ]
}
