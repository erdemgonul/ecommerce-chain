const request = require('supertest');

const app = require('../src/app');

let token = null;
var successcheck = function (res) {
    if (res.body.success === false) return new Error("success false");
}

var datacheck = function (res){
    var temp = res.body.data;
    if(temp.username!=="nadir" || temp.firstName!=="nadir" || temp.lastName!=="yuceer" || temp.email !== "nadir@gmail.com") return new Error("data does not match");
}


function signin() {
    it('responds with accesstoken', (done) => {
        request(app)
            .post('/api/v1/auth/signin')
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
}

describe('GET /api/v1', () => {
    it('responds with a json message', (done) => {
        request(app)
            .get('/api/v1')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, {
                message: 'API - 👋🌎🌍🌏'
            }, done);
    });
});

describe('signup', () => {
    it('signs up the user', (done) => {
        request(app)
            .post('/api/v1/auth/signup')
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
});

describe('signin', () => {
    signin();
});

describe('getuserdetailswithtoken', () => {
    signin();
    it('responds with data', (done) => {
        request(app)
            .post('/api/v1/user/get/details')
            .send({"userName": "nadir"})
            .set('Authorization', 'Bearer ' + token)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(datacheck)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                token = res.accessToken;
                return done();
            });
    });
});