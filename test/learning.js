require("dotenv").config();
const { addTestUser, deleteTestUser } = require("../model/db.js");

const chai = require("chai");
const expect = chai.expect;

const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const agent = chai.request.agent("http://localhost:3000");

describe("learning track functionality", function () {
  before(async () => {
    // Create dummy account for testing
    await addTestUser();
  });
  it("a user can login", function (done) {
    agent
      .post("/login")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({ username: "999999", password: "password" })
      .end(function (err, res) {
        expect(res).to.redirectTo("http://localhost:3000/profile/");
        done();
      });
  });
  it("a user can subscribe to a track", function (done) {
    agent
      .put("/api/subscribe")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({ trackid: 3 })
      .end(function (err, res) {
        expect(res.statusCode).to.equal(201);
        done();
      });
  });
  it("a user cannot subscribe to a track twice", function (done) {
    agent
      .put("/api/subscribe")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({ trackid: 3 })
      .end(function (err, res) {
        expect(res.statusCode).to.equal(412);
        done();
      });
  });
  it("a user can unsubscribe from a track", function (done) {
    agent
      .put("/api/unsubscribe")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({ trackid: 3 })
      .end(function (err, res) {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });
  after(async () => {
    // Delete dummy account after testing
    await deleteTestUser();
  });
});
