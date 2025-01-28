const request = require("supertest");
const app = require("../db/app");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const endpointsJson = require("../endpoints.json");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(testData);
})

afterAll(() => {
  return connection.end();
})

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: should respond with an array of topic objects and an appropriate status code", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({ body: { topics } }) => {
      expect(topics.length).toBe(3);
      topics.forEach((topic) => {
        expect(topic).toHaveProperty("slug");
        expect(topic).toHaveProperty("description");
      });
    });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: should respond with a single article object, with the appropriate properties and status code", () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({ body: { article }}) => {
      const expectedOutput = {
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: '2020-07-09T20:11:00.000Z',
        votes: 100,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      }
      expect(article).toMatchObject(expectedOutput);
    });
  });
  test("404: should respond with an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
    .get("/api/articles/75")
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe("article does not exist");
    });
  });
  test("400: should respond with an appropriate status and error message when given an invalid id", () => {
    return request(app)
    .get("/api/articles/one")
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("bad request: invalid ID")
    });
  });
});

describe("GET /api/articles", () => {
  test("200: should respond with an array of article objects with the appropriate properties and status code", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body: { articles } }) => {
      expect(articles.length).toBe(13);
      articles.forEach((article) => {
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
        expect(article).toHaveProperty("comment_count");
        expect(article).not.toHaveProperty("body");
      });
    });
  });
  test("200: should respond with an ordered array of article objects with an appropriate status code", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body: { articles } }) => {
      expect(articles).toBeSortedBy("created_at", { descending: true });
    });
  });
});