var SVGSprite = require('svg-sprite')
var glob = require('glob')
var path = require('path')
var fs = require('fs')
function SVGSpritePlugin(options){
    //Setup plugin options
    this.options = options
}
SVGSpritePlugin.prototype.apply = function(compiler) {
    const source = this.options.source,
        spriteConfig = this.options.spriteConfig
    compiler.plugin('this-compilation',function(compilation){
        console.log('This Compilation')

        compilation.plugin('optimize-assets',function(assets,done){
            console.log('Optimize Assets')
           const matchedPaths = glob.sync(source)
           .map(function(files){
               return path.join(__dirname,files)
           })
           
          
           const spriter = SVGSprite(spriteConfig)
           matchedPaths.forEach(function(filename){
               spriter.add(filename,null,fs.readFileSync(filename,{encoding:'utf-8'}))
           })
           
           spriter.compile(function(err,result){
               if(err){
                   throw err
               }
               const contents = result.symbol.sprite.contents.toString('utf-8')
              console.log('Result: ',contents)
           })
           
        })

    })

    compiler.plugin('done',function(){
        console.log('Hello World')
    })
}

module.exports = SVGSpritePlugin
