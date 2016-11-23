function SVGSpritePlugin(options){
    //Setup plugin options
}
SVGSpritePlugin.prototype.apply = function(compiler) {

    compiler.plugin('compilation',function(compilation){
        console.log(compilation)

        compilation.plugin('optimize',function(){

        })

    })

    compiler.plugin('done',function(){
        console.log('Hello World')
    })
}

module.exports = SVGSpritePlugin
