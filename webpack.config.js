var SVGSpritePlugin = require('./SVGSpritePlugin')
module.exports = {
    entry:'./index.js',
    output:{
        filename:'bundle.js',
        path:'public'
    },
    plugins: [
        new SVGSpritePlugin({
            source:'./svg/**/*.svg',
            spriteConfig:{
                dest:'public/icons',
                mode:{
                    symbol:{
                       sprite:'my-sprite.svg' 
                    }
                },
                shape:{
                    id:{
                        generator:'icon-%s'
                    },
                    transform:['svgo']
                }
            },
            destination:'icons'
        })
    ]
}
