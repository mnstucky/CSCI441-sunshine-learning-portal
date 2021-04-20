require("dotenv").config();
const { addTestUser, deleteTestUser, deleteTestThreads } = require("../model/test.js");

const chai = require("chai");
const expect = chai.expect;

const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const agent = chai.request.agent("http://localhost:3000");

describe("discussion board functionality", function () {
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
  it("a user can create a thread", function (done) {
    agent
      .post("/api/createthread")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({ title: "Thread For Testing" })
      .end((err, res) => {
        expect(res).to.redirectTo("http://localhost:3000/discussions/");
        done();
      });
  });
  it("a user can create a post", function (done) {
    agent
      .post("/api/createpost")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({ threadid: 1111, posttext: "This is a test post." })
      .end((err, res) => {
        expect(res).to.redirectTo("http://localhost:3000/discussions/displaythread?threadId=1111");
        done();
      });
  });
  after(async () => {
    // Delete dummy account after testing
    await deleteTestUser();
    // Delete dummy threads after testing
    await deleteTestThreads();
  });
});
