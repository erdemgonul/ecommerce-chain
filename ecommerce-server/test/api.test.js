const request = require('supertest');

const app = require('../src/app');
const json = require("entities");
const http = require("http");

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

function signintest(done) {
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
        signintest(done);
    });
    it('getuserdetails', (done) => {
        apppost('/user/get/details', {"userName": "nadir"})
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect(datacheck, done())
    });
    it('setuserdetails', (done) => {

        let data = {
            "email": "nadir.yuceer@gmail.com",
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
            .expect(200, {success: false}, done)
    });

});

describe('test of search implementation', () => {
    it('search', (done) => {
        apppost('/product/search', {
            "query": "msi",
            "fullData": true
        }).expect(200)
            .expect(successcheck)
            .end((err, res) => {
                const temp = res.body['data']['products'];
                if (temp.isEmpty) return done(new Error("search result is empty"));
                else {
                    let lookup = temp[0]['title'];
                    for (let i = 0; i < temp.length; i++) {
                        if (!temp[i]['title'].toLowerCase().includes("msi")) return done(new Error("search element with no connection to the search query"));
                    }
                    return done();
                }
            })
    });
});

describe('test of filter implementation', () => {
    it('search', (done) => {
        apppost('/product/get/category', {
            "path": "clothing/bags",
            "strictMode": false
        }).expect(200)
            .expect(successcheck)
            .end((err, res) => {
                const temp = res.body['data']['products'];
                if (temp.isEmpty) return done(new Error("search result is empty"));
                else {
                    let lookup = temp[0]['categories']
                    for (let i = 0; i < temp.length; i++) {
                        if (!temp[i]['categories'].includes("clothing/bags")) return done(new Error("search element with no connection to the search query"));
                    }
                    return done();
                }
            })
    });
});

describe('test of order system', () => {
    let orderid;
    let orderdata;
    const searchdata = {
        "query": "msi",
        "fullData": true
    }

    it('signin', (done) => {
        signintest(done);
    });

    it('searchforproduct', (done) => {
        apppost('/product/search', searchdata).expect(200).end((err, res) => {
            if(err) return done(err);
            orderdata = res.body['data']['products'][0];
            return done();
        });
    });

    it('lookforsuccessfulregister', ((done) => {
        apppost('/order/create', {
            "shippingAddress": "Istanbul",
            "billingAddress": "Istanbul",
            "products": [{"sku": orderdata['sku'], "quantity": 2, "title": orderdata['title']}]
        }).set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect(successcheck)
            .end((err, res) => {
            if (err) return done(err);
            orderid = res.body['orderId'];
            return done();
        });
    }));

    it('get', (done) => {
        apppost("/order/get/all", {})
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect(successcheck)
            .end((err,res) => {
                if(err) return done(err);
                return done();
            })
    });

    it('delete', (done) => {
        apppost("/order/delete", {"orderId": orderid})
            .set('Authorization', 'Bearer ' + token)
            .expect(200,{"success":true},done);
    });
});