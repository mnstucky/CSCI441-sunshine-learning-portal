require("dotenv").config();
const { addTestUser, deleteTestUser } = require("../model/test.js");

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
  it("a user cannot post a result to an unsubscribed track", function (done) {
    agent
      .put("/api/results")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({ userid: "999999", trackid: 3, test: "pretestscore", score: 5 })
      .end((err, res) => {
        expect(res.statusCode).to.equal(412);
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
  it("a subscribed user should be reflected in the database", (done) => {
    agent.get("/api?action=getusertracks").end((err, res) => {
      expect(res.body).to.include(3);
      done();
    });
  });
  it("a subscribed user should have zero scores", done => {
    agent.get("/api?action=getresults&track=3").end((err, res) => {
      expect(res.body.pretestscore).to.equal(0);
      expect(res.body.practicescore1).to.equal(0);
      expect(res.body.practicescore2).to.equal(0);
      expect(res.body.practicescore3).to.equal(0);
      expect(res.body.postscore).to.equal(0);
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
  it("a user can post a result to a subscribed track", (done) => {
    agent
      .put("/api/results")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({ userid: "999999", trackid: 3, test: "pretestscore", score: 5 })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
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
  it("a user cannot unsubscribe from a track twice", function (done) {
    agent
      .put("/api/unsubscribe")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({ trackid: 3 })
      .end(function (err, res) {
        expect(res.statusCode).to.equal(412);
        done();
      });
  });
  after(async () => {
    // Delete dummy account after testing
    await deleteTestUser();
  });
});
