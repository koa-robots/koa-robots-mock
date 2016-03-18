import fs from 'fs'
import koa from 'koa'
import mock from '../dist'
import request from 'supertest'

describe('mock', () => {
    it('normal', (done) => {
        var app = koa()

        app.use(mock('test/mock'))

        fs.writeFile('test/mock/index.js', 'export default {"a":"b"}', function(err){
            request(app.listen())
                .get('/')
                .expect('{"a":"b"}', done)
        })
    })

    it('not found', (done) => {
        var app = koa()

        app.use(mock('test/mock'))

        request(app.listen())
            .get('/hello')
            .expect(404, done)
    })

    it('special url', (done) => {
        var app = koa()

        app.use(mock('test/mock', {
            routes : [
                {url : '/:category/:title', controller : '/test'}
            ]
        }))

        fs.writeFile('test/mock/test.js', 'export default {"hello":"world"}', function(err){
            request(app.listen())
                .get('/hello/world')
                .expect('{"hello":"world"}', done)
        })
    })

    it('special url not found', (done) => {
        var app = koa()

        app.use(mock('test/mock', {
            routes : [
                {url : '/:category/:title', controller : '/test2'}
            ]
        }))

        request(app.listen())
            .get('/test2')
            .expect(404, done)
    })

    it('mock data', (done) => {
        var app = koa()

        app.use(mock('test/mock'))

        fs.writeFile('test/mock/data.js', 'export default {"string1|10":"★"}', function(err){
            request(app.listen())
                .get('/data')
                .expect('{"string1":"★★★★★★★★★★"}', done)
        })
    })
})
