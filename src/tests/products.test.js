import { assert } from "chai";
import { request } from "chai-http";
import server from "../../server.js";

let attendantToken, adminToken;
const productId = "510216";

describe("products route test", () => {
  before((done) => {
    request
      .execute(server)
      .post("/api/v1")
      .send({ username: "vanessasatone", password: "vanessasatone@attendant" })
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
    it("should get all products", (done) => {
      request
        .execute(server)
        .keepOpen()
        .get("/api/v1/products")
        .set("Authorization", `Bearer ${attendantToken}`)
        .end((error, res) => {
          if (error) return done(error);
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.success, true);
          done();
        });
    });

    it("should get a specific product", (done) => {
      request
        .execute(server)
        .keepOpen()
        .get("/api/v1/products/510216")
        .set("Authorization", `Bearer ${attendantToken}`)
        .end((error, res) => {
          if (error) return done(error);
          assert.equal(res.status, 200);
          assert.equal(res.body.success, true);
          done();
        });
    });

    it("should not get a product that does not exist", (done) => {
      request
        .execute(server)
        .keepOpen()
        .get("/api/v1/products/invalidId")
        .set("Authorization", `Bearer ${attendantToken}`)
        .end((error, res) => {
          if (error) return done(error);
          assert.equal(res.status, 404);
          assert.equal(res.body.success, false);
          assert.equal(res.body.message, "Product not found!");
          done();
        });
    });
  });

  describe("post requests tests", () => {
    it("should create product successfully", (done) => {
      request
        .execute(server)
        .keepOpen()
        .post("/api/v1/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          productName: "Nike Dunk High",
          productDescription: "A cool shoe",
          price: "$130",
          stock: 20,
        })
        .end((error, res) => {
          if (error) return done(error);
          assert.equal(res.status, 200);
          assert.equal(res.body.success, true);
          assert.equal(res.body.message, "product added successfully!");
          done();
        });
    });

    it("should not allow attendant to create product", (done) => {
      request
        .execute(server)
        .keepOpen()
        .post("/api/v1/products")
        .set("Authorization", `Bearer ${attendantToken}`)
        .send({
          productName: "Nike Dunk High",
          productDescription: "A cool shoe",
          price: "$130",
          stock: 20,
        })
        .end((error, res) => {
          if (error) return done(error);
          assert.equal(res.status, 403);
          assert.equal(res.body.success, false);
          assert.equal(
            res.body.message,
            "You are not allowed to access this route!"
          );
          done();
        });
    });

    it("should not create a product with missing fields", (done) => {
      request
        .execute(server)
        .keepOpen()
        .post("/api/v1/products")
        .set("Authorization", `Bearer ${adminToken}`)
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
