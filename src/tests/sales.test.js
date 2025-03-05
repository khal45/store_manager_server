import { assert } from "chai";
import { request } from "chai-http";
import server from "../../server.js";

let attendantToken, adminToken;
const saleId = "f7c6b24a-e0bc-422b-8d24-aa00a88dafc4";

describe("auth route tests", () => {
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

  describe("get requests tests", () => {
    it("should return all sale records", (done) => {
      request
        .execute(server)
        .keepOpen()
        .get("/api/v1/sales")
        .set("Authorization", `Bearer ${adminToken}`)
        .end((error, res) => {
          if (error) return done(error);
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.success, true);
          done();
        });
    });

    it("should return a single sale record", (done) => {
      request
        .execute(server)
        .keepOpen()
        .get(`/api/v1/sales/${saleId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .end((error, res) => {
          if (error) return done(error);
          assert.equal(res.status, 200);
          assert.equal(res.body.success, true);
          done();
        });
    });

    it("should not return a single sales record if the sales record is not found", (done) => {
      request
        .execute(server)
        .keepOpen()
        .get(`/api/v1/sales/invalid_id`)
        .set("Authorization", `Bearer ${adminToken}`)
        .end((error, res) => {
          if (error) return done(error);
          assert.equal(res.status, 404);
          assert.equal(res.body.success, false);
          assert.equal(res.body.message, "Sale Record not found!");
          done();
        });
    });

    it("should not return a single sales record if attendant did not create sale record", (done) => {
      request
        .execute(server)
        .keepOpen()
        .get(`/api/v1/sales/${saleId}`)
        .set("Authorization", `Bearer ${attendantToken}`)
        .end((error, res) => {
          if (error) return done(error);
          assert.equal(res.status, 403);
          assert.equal(res.body.success, false);
          assert.equal(
            res.body.message,
            "Attendant does not have access to sale record!"
          );
          done();
        });
    });
  });

  describe("post requests tests", () => {
    it("should create a new sale record", (done) => {
      request
        .execute(server)
        .keepOpen()
        .post("/api/v1/sales")
        .set("Authorization", `Bearer ${attendantToken}`)
        .send({
          productName: "Nike Dunk High",
          quantity: 2,
          paymentMethod: "card",
          unitPrice: "$120",
          status: "completed",
        })
        .end((error, res) => {
          if (error) return done(error);
          assert.equal(res.status, 200);
          assert.equal(res.body.success, true);
          assert.equal(res.body.message, "Sale record created successfully!");
          done();
        });
    });

    it("should not create a sale record with missing fields", (done) => {
      request
        .execute(server)
        .keepOpen()
        .post("/api/v1/sales")
        .set("Authorization", `Bearer ${attendantToken}`)
        .end((error, res) => {
          if (error) return done(error);
          assert.equal(res.status, 400);
          assert.equal(res.body.success, false);
          assert.equal(res.body.message, "All fields are required!");
          done();
        });
    });
  });
});
