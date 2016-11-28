var User = require('../models').User;
var request = require('co-supertest');
var expect = require('chai').expect;
var crypto = require('crypto');
var app = require('../app');
var id;

function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

describe('/user', function() {
    var agent = request.agent(app);

    before(function(done) {
        done();
    });

    after(function *(done) {
        User.remove().where('name').in(['test2016', '123', '1234567890123']).exec();
        done();
    });

    it('POST /创建用户：正常情况', function*(done) {
        var res = yield agent
            .post('/user')
            .send({
                name: 'test2016',
                email: 'maat@ixiaopu.com',
                password: '123456',
                re_password: '123456',
                nickname: '这是nickname'
            });
        var userInfo = yield User.findOne({name: 'test2016'}).exec();
        id = userInfo._id;
        expect(res.body).to.have.property('status', 1);
        done();
    });

    it('POST /创建用户：已存在用户名的情况', function*(done) {
        var res = yield agent
            .post('/user')
            .send({
                name: 'test2016',
                email: 'maat@ixiaopu.com',
                password: '123456',
                re_password: '123456',
                nickname: '这是nickname'
            });
        expect(res.body).to.have.property('status', 0);
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
                name: 'test2016',
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
                name: 'test2016',
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
                name: 'test2016',
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
                name: 'test2016',
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
                name: 'test2016',
                email: 'maat@ixiaopu.com',
                password: '123456',
                re_password: '1234566',
                nickname: '这是nickname',
                signature: '1123'
            });
        expect(res.body).to.have.property('status', 0);
        done();
    });

    it('POST /登录：正常情况', function*(done) {
        var res = yield agent
            .post('/login')
            .send({
                name: 'test2016',
                password: '123456'
            });
        expect(res.body).to.have.property('status', 1);
        done();
    });

    it('POST /登录：密码错误', function*(done) {
        var res = yield agent
            .post('/login')
            .send({
                name: 'test2016',
                password: '1234564'
            });
        expect(res.body).to.have.property('status', 0);
        done();
    });

    it('POST /登录：用户名错误', function*(done) {
        var res = yield agent
            .post('/login')
            .send({
                name: 'test20164',
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
                name: 'test2016',
                password: ''
            });
        expect(res.body).to.have.property('status', 0);
        done();
    });


    it('GET /用户列表：正常情况没输page,size', function*(done) {
        var res = yield agent
            .get('/user')
            .send();
        var body = res.body;
        var count = body.data.count;
        var list = body.data.list;
        expect(body).to.have.property('status', 1);
        expect(list.length).to.be.at.most(count).and.to.be.at.least(0);
        done();
    });
    it('GET /用户列表：正常情况输入page,size', function*(done) {
        var res = yield agent
            .get('/user?page=0&size=10')
            .send();
        var body = res.body;
        var count = body.data.count;
        var list = body.data.list;
        expect(body).to.have.property('status', 1);
        if (list.length > 0) {
            expect(body).to.not.have.deep.ownProperty('data.list[0].password');
        }
        expect(list.length).to.be.at.most(count).and.to.be.at.least(0);
        done();
    });
    it('GET /用户列表：用户数据不应该展现password', function*(done) {
        var res = yield agent
            .get('/user?page=0&size=10')
            .send();
        var body = res.body;
        var list = body.data.list;
        if (list.length > 0) {
            expect(body).to.not.have.deep.ownProperty('data.list[0].password');
        }
        done();
    });
    it('GET /用户列表：正常情况输入错误的page,size，应该进行纠正', function*(done) {
        var res = yield agent
            .get('/user?page=aaa&size=3')
            .send();
        var body = res.body;
        var count = body.data.count;
        var list = body.data.list;
        expect(body).to.have.property('status', 1);
        expect(list.length).to.be.at.most(count).and.to.be.at.least(0);
        done();
    });

    it('GET /用户信息', function*(done) {
        var res = yield agent
            .get('/user/' + id)
            .send();
        var body = res.body;
        expect(body).to.have.property('status', 1);
        done();
    });

    it('PUT /修改用户信息: 正常情况', function*(done) {
        var res = yield agent
            .put('/user')
            .send({
                email: 'maat2@ixiaopu.com'
            });
        expect(res.body).to.have.property('status', 1);
        done();
    });

    it('GET /修改用户获取用户信息', function*(done) {
        var res = yield agent
            .get('/user/' + id)
            .send();
        var body = res.body;
        expect(body).to.have.deep.property('data.email', 'maat2@ixiaopu.com');
        done();
    });

    it('PUT /修改用户信息:用户名少于4个字符', function*(done) {
        var res = yield agent
            .put('/user')
            .send({
                name: '123'
            });
        expect(res.body).to.have.property('status', 0);
        done();
    });

    it('PUT /修改用户信息:用户名大于12个字符', function*(done) {
        var res = yield agent
            .put('/user')
            .send({
                name: '1234567890123'
            });
        expect(res.body).to.have.property('status', 0);
        done();
    });
    it('PUT /修改用户信息:密码小于6字', function*(done) {
        var res = yield agent
            .put('/user')
            .send({
                password: '12345',
                re_password: '12345'
            });
        expect(res.body).to.have.property('status', 0);
        done();
    });
    it('PUT /修改用户信息:密码大于32字', function*(done) {
        var res = yield agent
            .put('/user')
            .send({
                password: '000000000000000000000000000000000',
                re_password: '000000000000000000000000000000000'
            });
        expect(res.body).to.have.property('status', 0);
        done();
    });
    it('PUT /修改用户信息:邮箱格式不正确', function*(done) {
        var res = yield agent
            .put('/user')
            .send({
                email: 'maat@@ixiaopu.com'
            });
        expect(res.body).to.have.property('status', 0);
        done();
    });
    it('PUT /修改用户信息:个性签名大于50字', function*(done) {
        var res = yield agent
            .put('/user')
            .send({
                signature: '000000000000000000000000000000000000000000000000000000000000000000'
            });
        expect(res.body).to.have.property('status', 0);
        done();
    });
    it('PUT /修改用户信息:两次密码不一致', function*(done) {
        var res = yield agent
            .put('/user')
            .send({
                password: '123456',
                re_password: '1234566'
            });
        expect(res.body).to.have.property('status', 0);
        done();
    });

    it('DELETE /删除用户', function*(done) {
        var res = yield agent
            .delete('/user/' + id)
            .send();
        var body = res.body;
        expect(body).to.have.property('status', 1);
        done();
    });
});
