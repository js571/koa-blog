var User = require('../models').User;
var request = require('co-supertest');
var expect = require('chai').expect;
var crypto = require('crypto');
var app = require('../app');

function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

describe('/user', function() {
    var agent = request.agent(app);

    before(function(done) {
        User.remove({ name: 'test@2016' });
        User.create({
            name: 'test@2016',
            email: 'maat@ixiaopu.com',
            password: md5('123456'),
            nickname: '这是nickname'
        }, done)
    });

    after(function(done) {
        User.remove({ name: 'test@2016' });
        User.remove({ name: '123456789012' });
        User.remove({ name: 'test_maat' }, done);
    });

    it('GET /user', function*(done) {
        var res = yield agent.get('/user');
        expect(res.body).to.have.property('a', 1233);
        done();
    });

    it('POST /登录：正常情况', function*(done) {
        var res = yield agent
            .post('/login')
            .send({
                name: 'test@2016',
                password: '123456'
            });
        expect(res.body).to.have.property('status', 1);
        done();
    });

    it('POST /登录：密码错误', function*(done) {
        var res = yield agent
            .post('/login')
            .send({
                name: 'test@2016',
                password: '1234564'
            });
        expect(res.body).to.have.property('status', 0);
        done();
    });

    it('POST /登录：用户名错误', function*(done) {
        var res = yield agent
            .post('/login')
            .send({
                name: 'test@20164',
                password: '123456'
            });
        expect(res.body).to.have.property('status', 0);
        done();
    });

    it('POST /登录：用户名为空', function*(done) {
        var res = yield agent
            .post('/login')
            .send({
                name: '',
                password: '123456'
            });
        expect(res.body).to.have.property('status', 0);
        done();
    });

    it('POST /登录：密码为空', function*(done) {
        var res = yield agent
            .post('/login')
            .send({
                name: 'test@2016',
                password: ''
            });
        expect(res.body).to.have.property('status', 0);
        done();
    });

    it('POST /创建用户：正常情况', function*(done) {
        var res = yield agent
            .post('/user')
            .send({
                name: 'test_maat',
                email: 'maat@ixiaopu.com',
                password: '123456',
                re_password: '123456',
                nickname: '这是nickname'
            });
        expect(res.body).to.have.property('status', 1);
        done();
    });

    it('POST /创建用户：用户名少于4个字符', function*(done) {
        var res = yield agent
            .post('/user')
            .send({
                name: '123',
                email: 'maat@ixiaopu.com',
                password: '123456',
                re_password: '123456',
                nickname: '这是nickname'
            });
        expect(res.body).to.have.property('status', 0);
        done();
    });

    it('POST /创建用户：用户名大于12个字符', function*(done) {
        var res = yield agent
            .post('/user')
            .send({
                name: '1234567890123',
                email: 'maat@ixiaopu.com',
                password: '123456',
                re_password: '123456',
                nickname: '这是nickname'
            });
        expect(res.body).to.have.property('status', 0);
        done();
    });
    it('POST /创建用户：密码小于6字', function*(done) {
        var res = yield agent
            .post('/user')
            .send({
                name: '1234567890',
                email: 'maat@ixiaopu.com',
                password: '12345',
                re_password: '12345',
                nickname: '这是nickname'
            });
        expect(res.body).to.have.property('status', 0);
        done();
    });
    it('POST /创建用户：密码大于32字', function*(done) {
        var res = yield agent
            .post('/user')
            .send({
                name: '1234567890',
                email: 'maat@ixiaopu.com',
                password: '000000000000000000000000000000000',
                re_password: '000000000000000000000000000000000',
                nickname: '这是nickname'
            });
        expect(res.body).to.have.property('status', 0);
        done();
    });
    it('POST /创建用户：邮箱格式不正确', function*(done) {
        var res = yield agent
            .post('/user')
            .send({
                name: '1234567890',
                email: 'maat@@ixiaopu.com',
                password: '123456',
                re_password: '123456',
                nickname: '这是nickname'
            });
        expect(res.body).to.have.property('status', 0);
        done();
    });
    it('POST /创建用户：个性签名大于50字', function*(done) {
        var res = yield agent
            .post('/user')
            .send({
                name: '1234567890',
                email: 'maat@ixiaopu.com',
                password: '123456',
                re_password: '123456',
                nickname: '这是nickname',
                signature: '000000000000000000000000000000000000000000000000000000000000000000'
            });
        expect(res.body).to.have.property('status', 0);
        done();
    });
    it('POST /创建用户：两次密码不一致', function*(done) {
        var res = yield agent
            .post('/user')
            .send({
                name: '1234567890',
                email: 'maat@ixiaopu.com',
                password: '123456',
                re_password: '1234566',
                nickname: '这是nickname',
                signature: '1123'
            });
        expect(res.body).to.have.property('status', 0);
        done();
    });
});
