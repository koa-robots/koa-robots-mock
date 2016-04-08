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
