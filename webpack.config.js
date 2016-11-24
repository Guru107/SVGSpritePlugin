var SVGSpritePlugin = require('./SVGSpritePlugin')
var AssetsPlugin = require('assets-webpack-plugin')
var assetsPluginInstance = new AssetsPlugin({path:'public'})

module.exports = {
    entry:'./index.js',
    output:{
        filename:'bundle.js',
        path:'public',
        publicPath:'/static/'
    },
    plugins: [
        new SVGSpritePlugin({
            source:'./svg/location/*.svg',
            'manifestFile':'svg-assets.json',
            spriteConfig:{
                dest:'public/icons',
                mode:{
                    symbol:{
                       dest:'.',
                       sprite:'location-sprite.svg',
                       bust:true
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
        }),
        new SVGSpritePlugin({
            source:'./svg/position/*.svg',
            'manifestFile':'svg-assets.json',
            spriteConfig:{
                dest:'public/icons',
                mode:{
                    symbol:{
                       dest:'.',
                       sprite:'position-sprite.svg',
                       bust:true
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
        }),
        assetsPluginInstance
    ]
}
