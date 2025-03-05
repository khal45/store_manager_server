import { assert } from "chai";
import { request } from "chai-http";
import server from "../../server.js";

let adminToken;

describe("auth route tests", () => {
  before((done) => {
    request
      .execute(server)
      .post("/api/v1")
      .send({ username: "johndoe", password: "johndoe@admin" })
      .end((error, res) => {
        if (error) return done(error);
        assert.equal(res.status, 200);
        adminToken = res.body.accessToken;
        done();
      });
  });

  before((done) => {
    request
      .execute(server)
      .keepOpen()
      .post("/api/v1/users/register")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        username: "testuser",
        password: "testuser@attendant",
        role: "attendant",
      })
      .end((error, res) => {
        if (error) return done(error);
        assert.equal(res.status, 200);
        assert.equal(res.body.success, true);
        assert.equal(res.body.message, "User added successfully!");
        done();
      });
  });

  it("should login a user that exists", (done) => {
    request
      .execute(server)
      .keepOpen()
      .post("/api/v1")
      .send({ username: "testuser", password: "testuser@attendant" })
      .end((error, res) => {
        if (error) return done(error);
        assert.equal(res.status, 200);
        assert.equal(res.body.success, true);
        done();
      });
  });

  it("should not login a user that does not exist", (done) => {
    request
      .execute(server)
      .keepOpen()
      .post("/api/v1")
      .send({ username: "invaliduser", password: "invaliduser@attendant" })
      .end((error, res) => {
        if (error) return done(error);
        assert.equal(res.status, 401);
        assert.equal(res.body.success, false);
        assert.equal(res.body.message, "user does not exist");
        done();
      });
  });

  it("should not login a user with incorrect password", (done) => {
    request
      .execute(server)
      .keepOpen()
      .post("/api/v1")
      .send({ username: "testuser", password: "invalid" })
      .end((error, res) => {
        if (error) return done(error);
        assert.equal(res.status, 401);
        assert.equal(res.body.success, false);
        assert.equal(res.body.message, "incorrect password");
        done();
      });
  });
});
