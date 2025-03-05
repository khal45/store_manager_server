import { assert } from "chai";
import { request } from "chai-http";
import server from "../../server.js";

let attendantToken, adminToken;
const userId = "9160047";

describe("user route testst", () => {
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
      .post("/api/v1")
      .send({ username: "boblious", password: "boblious@attendant" })
      .end((error, res) => {
        if (error) return done(error);
        assert.equal(res.status, 200);
        attendantToken = res.body.accessToken;
        done();
      });
  });

  describe("get requests tests", () => {
    it("should return all users", (done) => {
      request
        .execute(server)
        .keepOpen()
        .get("/api/v1/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .end((error, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.success, true);
          done();
        });
    });
  });

  describe("post requsets tests", () => {
    it("should create a new user", (done) => {
      request
        .execute(server)
        .keepOpen()
        .post("/api/v1/users/register")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          username: "newuser",
          password: "newuser@attendant",
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

    it("should not create a user with missing fields", (done) => {
      request
        .execute(server)
        .keepOpen()
        .post("/api/v1/users/register")
        .set("Authorization", `Bearer ${adminToken}`)
        .end((error, res) => {
          if (error) return done(error);
          assert.equal(res.status, 400);
          assert.equal(res.body.success, false);
          assert.equal(res.body.message, "All fields are required!");
          done();
        });
    });

    it("should not create a user that already exists", (done) => {
      request
        .execute(server)
        .keepOpen()
        .post("/api/v1/users/register")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          username: "johndoe",
          password: "johndoe@admin",
          role: "admin",
        })
        .end((error, res) => {
          if (error) return done(error);
          assert.equal(res.status, 409);
          assert.equal(res.body.success, false);
          assert.equal(res.body.message, "User already exists!");
          done();
        });
    });
  });
});
