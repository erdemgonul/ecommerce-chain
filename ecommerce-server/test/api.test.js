const request = require('supertest');

const app = require('../src/app');

let token = null;
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
    it('responds with accesstoken', (done) => {
        request(app)
            .post('/api/v1/auth/signin')
            .send({"userName":"nadir","password":"123456"})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                token=res.accessToken;
                return done();
            });
    });
});