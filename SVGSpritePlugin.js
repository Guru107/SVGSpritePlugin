var SVGSprite = require('svg-sprite')
var glob = require('glob')
var path = require('path')
var fs = require('fs')
function SVGSpritePlugin(options){
    //Setup plugin options
    this.options = options
}
SVGSpritePlugin.prototype.apply = function(compiler) {

    compiler.plugin('this-compilation',thiscompilationCallback.bind(this,compiler))
    compiler.plugin('emit',emitEventCallback)
}
/**
 * @func emitEventCallback
 * @param {Compilation} compilation
 */
function emitEventCallback(compilation) {

    console.log('Emit Event')
    console.log('Assets: ')
    for(let key in compilation.assets){
        if(/.svg/.test(key)){
            console.log(key)
            console.log(compilation.assets[key].basename())
        }
    }

}
/**
 *
 * @param {Compiler} compiler
 * @param {Compilation} compilation
 */
function thiscompilationCallback(compiler,compilation) {
    console.log('this-compilation Event')
    compilation.plugin('optimize-assets',optimizeAssetsEventCallback.bind(this,compiler,compilation))
}

function optimizeAssetsEventCallback(compiler,compilation,assets,done){

    const source = this.options.source,
        destination = this.options.destination,
        spriteConfig = this.options.spriteConfig,
        manifestFile = this.options.manifestFile || 'svg-assets.json',
        fullManifestPath = path.join(compiler.options.context +'/'+ manifestFile),
        _self = this,
        manifestExists = fs.existsSync(fullManifestPath)


    let manifestObject = {}
    if(manifestExists){
        manifestObject = JSON.parse(fs.readFileSync(fullManifestPath,'utf-8'))
    }

    const matchedPaths = glob.sync(source).map(function(files){
        return path.join(compiler.options.context,files)
    })


    const spriter = SVGSprite(spriteConfig)

    matchedPaths.forEach(function(filename){
        spriter.add(filename,null,fs.readFileSync(filename,{encoding:'utf-8'}))
    })

    spriter.compile(function(err,result){
        if(err) {
            console.error(err)
            throw err
        }
        for(let type in result) {
            for(let mode in result[type]){
                const spriteResult = result[type][mode]
                const contents = spriteResult.contents.toString('utf-8'),
                    path = spriteResult.path,
                    baseName = spriteResult.basename

                compilation.assets = Object.assign({},compilation.assets,{
                    [spriteConfig.mode[type].sprite]:{
                        source:() => result[type][mode],
                        size:() => contents.length,
                        basename:() => baseName
                    }
                })
            }
        }
        done()
    })

}

function writeAllFiles(compiler,compilation,result,spriteConfig,manifestObject,callback){


   let deferedArray = [],
           tempManifest = {}
    const publicPath = compiler.options.output.publicPath ? compiler.options.output.publicPath : '',
            destination = this.options.destination
             Object.keys(result).forEach(function(mode){

                for(let type in result[mode]){
                   tempManifest = Object.assign({},manifestObject,{
                        [spriteConfig.mode[mode].sprite]: publicPath+destination+'/'+result[mode][type].relative
                    })

                    deferedArray.push(writeFile(compiler.outputFileSystem,result[mode][type].path,result[mode][type].contents))
                }
            })
            // Promise.all(deferedArray).then(function(response){
            //     callback(response[0],tempManifest)
            // },function(err){
            //     if(err){
            //         console.log(err)
            //         throw err
            //     }
            // })
}

function writeFile(outputFileSystem,path,contents){
    return new Promise(function(resolve,reject){
        outputFileSystem.writeFile(path,contents,function(err){
            if(err)
                reject(err)
            resolve('success')
        })
    })
}
module.exports = SVGSpritePlugin
