import fs from 'co-fs'
import Mock from 'mockjs'
import mkdirp from 'mkdirp'
import pathToRegexp from 'path-to-regexp'
import {join, normalize, resolve} from 'path'

export default function(root = '.', options = {}){
    root = normalize(resolve(root))
    options.routes = clone(options.routes || [])

    options = Object.assign({
        routes : null,
        index : '/index'
    }, options)

    for(let route of options.routes){
        route.url = pathToRegexp(route.url)
    }

    mkdirp.sync(root)

    return function *(next){
        yield next

        if(this.body){
            return
        }

        for(let route of options.routes){
            let matched

            if(this.path === '/'){
                break
            }

            if(!(matched = route.url.exec(this.path))){
                continue
            }

            this.path = route.controller
        }

        let path = join(root, (this.path === '/' ? options.index : this.path) + '.js')

        try{
            if((yield fs.stat(path)).isFile()){
                this.body = Mock.mock(yield _interopRequireDefault(require(path)).default)
            }
        }catch(err){
            if (~['ENOENT', 'ENAMETOOLONG', 'ENOTDIR'].indexOf(err.code)){
                return
            }
        }
    }
}

function _interopRequireDefault(obj){
    return obj && obj.__esModule ? obj : {default: obj}
}

function clone(obj){
    return JSON.parse(JSON.stringify(obj))
}
