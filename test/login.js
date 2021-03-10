const chai = require("chai");
const expect = chai.expect;

const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const agent = chai.request.agent("http://localhost:3000");

describe("login functionality", function () {
  it("a user can login", function(done) {
    agent.post("/login")
    .set("content-type", "application/x-www-form-urlencoded")
    .send({ username: "123456", password: "password" })
    .end(function(err, res) {
      expect(res).to.redirectTo("http://localhost:3000/profile/");
      done();
    })
  })
  it("a logged in user can access the profile page", function (done) {
    agent.get("/profile").end(function (err, res) {
      expect(res.statusCode).to.equal(200);
      expect(res.text).to.include("Profile");
      done();
    });
  });
  it("a nonlogged in user is redirected to the login page", function (done) {
    chai
      .request("http://localhost:3000")
      .get("/profile")
      .end(function (err, res) {
        expect(res).to.redirectTo("http://localhost:3000/login/");
        done();
      });
  });
});
