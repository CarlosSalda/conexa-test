const axios = require("axios");
const base_url = 'http://localhost:5000/bd'

describe("End to End", () => {
  describe("Post Requests Tests", () => {
    it("should return 403 because user already registered /register", async () => {
      try {
        const data = {
          email: "usuar@gmail.com",
          password: "1421412",
        };

        const response = await axios.post(`${base_url}/register`, data);
        expect(response.status).toBe(404);
      } catch (error) {
        expect(error.response.status).toBe(403);
      }
    });

    it("should return 200 /login", async () => {
      const data = {
        email: "usuar@gmail.com",
        password: "1421412",
      };
      const response = await axios.post(`${base_url}/login`, data);
      expect(response.status).toBe(200);
    })
  });
  describe("Get Requests Tests", () => {
    it("should return 200 /users", async () => {
      const data = {
        email: "usuar@gmail.com",
        password: "1421412",
      };
      const response_post = await axios.post(`${base_url}/login`, data);

      const token = response_post.data.token;
      const response = await axios.get(`${base_url}/users`, {
        headers: {
          Authorization: token,
        }
      });

      expect(response.status).toBe(200);
      expect(response.data.length).toBeGreaterThan(0);
    });

    it("should return 403 /users", async () => {
      try {
        await axios.get(`${base_url}/users`);

      } catch (error) {
        expect(error.response.status).toBe(403);
      }
    });
  });
});