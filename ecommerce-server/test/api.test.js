const request = require('supertest');

const app = require('../src/app');

let token = null;
var successcheck = function (res) {
    if (res.body.success === false) return new Error("success false");
}

function appget(path) {
    return request(app)
        .get(path)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);
}

function apppost(path, data) {
    return req = request(app)
        .post(rootdir + path)
        .send(data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);
}

var datacheck = function (res) {
    var temp = res.body.data;
    if (temp.username !== "nadir" || temp.firstName !== "nadir" || temp.lastName !== "yuceer" || temp.email !== "nadir@gmail.com") return new Error("data does not match");
}
var datacheckafter = function (res) {
    var temp = res.body.data;
    if (temp.username !== "nadir" || temp.firstName !== "ahmet" || temp.lastName !== "yuceer" || temp.email !== "nadir@gmail.com") return new Error("data does not match");
}
const rootdir = "/api/v1";

describe('GET /api/v1', () => {
    it('responds with a json message', (done) => {
        appget(rootdir).expect(200, {
            message: 'API - 👋🌎🌍🌏'
        }, done);
    });
});

describe('Smooth Sign-up, Sign-in and user_info management', () => {
    it('signup', (done) => {
        apppost('/auth/signup', {
            "userName": "nadir",
            "firstName": "nadir",
            "lastName": "yuceer",
            "email": "nadir@gmail.com",
            "password": "123456"
        }).expect(200, {"success": true})
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });
    it('sign-in responds with accesstoken', (done) => {
        apppost('/auth/signin', {"userName": "nadir", "password": "123456"})
            .expect(200)
            .expect(successcheck)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                token = res.body.accessToken;
                return done();
            });
    });
    it('getuserdetails', (done) => {
        apppost('/user/get/details', {"userName": "nadir"})
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect(datacheck, done())
    });
    it('setuserdetails', (done) => {

        let data = {
            "firstName": "ahmet",
        }
        apppost('/user/get/details', data)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect(successcheck, done())

    });
    it('getuserdetailsafterchange', (done) => {
        apppost('/user/get/details', {"userName": "nadir"})
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect(datacheckafter, done())
    });
});

describe('Corner cases', () => {
    it('Reject in not proper info for signup', (done) => {
        apppost('/auth/signup', {
            "userName": "nadir",
            "firstName": "nadir",
            "lastName": "yuceer",
            "email": "nadir@gmail.com",
            "password": "12"
        }).expect(422, done())
    });
    it('sign-in wrong username or password', (done) => {
        apppost('/auth/signin', {"userName": "nadir", "password": "1234"})
        request(app)
            .expect(200, {success: false}, done())
    });

});