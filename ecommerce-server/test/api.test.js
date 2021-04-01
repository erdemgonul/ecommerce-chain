const request = require('supertest');

const app = require('../src/app');

let token = null;
var successcheck = function (res) {
    if (res.body.success === false) return new Error("success false");
}

var datacheck = function (res) {
    var temp = res.body.data;
    if (temp.username !== "nadir" || temp.firstName !== "nadir" || temp.lastName !== "yuceer" || temp.email !== "nadir@gmail.com") return new Error("data does not match");
}
var datacheckafter = function (res) {
    var temp = res.body.data;
    if (temp.username !== "ahmet" || temp.firstName !== "nadir" || temp.lastName !== "yuceer" || temp.email !== "nadir@gmail.com") return new Error("data does not match");
}
const rootdir = "/api/v1";


describe('GET /api/v1', () => {
    it('responds with a json message', (done) => {
        request(app)
            .get(rootdir)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, {
                message: 'API - 👋🌎🌍🌏'
            }, done);
    });
});

describe('Sign-in, Sign-up and user_info management', () => {
    it('signup', (done) => {
        request(app)
            .post(rootdir + '/auth/signup')
            .send({
                "userName": "nadir",
                "firstName": "nadir",
                "lastName": "yuceer",
                "email": "nadir@gmail.com",
                "password": "123456"
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, {"success": true})
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });
    it('sign-in responds with accesstoken', (done) => {
        request(app)
            .post(rootdir + '/auth/signin')
            .send({"userName": "nadir", "password": "123456"})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
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
        request(app)
            .post(rootdir + '/user/get/details')
            .send({"userName": "nadir"})
            .set('Authorization', 'Bearer ' + token)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(datacheck,done())
    });
    it('setuserdetails', (done) => {

        let data = {
            "firstName": "ahmet",
        }
        request(app)
            .post(rootdir + '/user/get/details')
            .send(data)
            .set('Authorization', 'Bearer ' + token)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(successcheck, done())

    });
    it('getuserdetailsafterchange', (done) => {
        request(app)
            .post(rootdir + '/user/get/details')
            .send({"userName": "nadir"})
            .set('Authorization', 'Bearer ' + token)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(datacheckafter,done())
    });
});