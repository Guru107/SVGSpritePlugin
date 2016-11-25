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

}
/**
 *
 * @param {object} compiler
 * @param {object} compilation
 */
function thiscompilationCallback(compiler,compilation) {
    compilation.plugin('optimize-assets',optimizeAssetsEventCallback.bind(this,compiler,compilation))
}

function optimizeAssetsEventCallback(compiler,compilation,assets,done){

    const source = this.options.source,
        destination = this.options.destination,
        spriteConfig = this.options.spriteConfig,
        manifestFile = this.options.manifestFile || 'svg-assets.json',
        fullManifestPath = path.join(compiler.options.output.path +'/'+ manifestFile),
        _self = this,
        manifestExists = fs.existsSync(fullManifestPath)
        console.log('Manifest Exits: ',manifestExists)
        console.log('Manifest File: ',fullManifestPath)
    let manifestObject = {}
    if(manifestExists){
        manifestObject = JSON.parse(fs.readFileSync(fullManifestPath,'utf-8'))
    }

    const matchedPaths = glob.sync(source).map(function(files){
        return path.join(compiler.options.context,files)
    })
    console.log(matchedPaths)

    const spriter = SVGSprite(spriteConfig)

    matchedPaths.forEach(function(filename){
        spriter.add(filename,null,fs.readFileSync(filename,{encoding:'utf-8'}))
    })

    spriter.compile(function(err,result){
        if(err) {
            throw err
        }

        const outputPath = destination ? compiler.options.output.path+'/'+destination : compiler.options.output.path


            compiler.outputFileSystem.mkdirp(outputPath,function(err){
                if(err)
                    throw err
                writeAllFiles.call(_self,compiler,compilation,result,spriteConfig,manifestObject,function(response,manifest){
                    fs.writeFile(fullManifestPath,JSON.stringify(manifest),function(err){
                        if(err)
                            throw err

                        done()
                    })
                })
            })

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
            Promise.all(deferedArray).then(function(response){
                callback(response[0],tempManifest)
            },function(err){
                if(err)
                    throw err
            })
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
