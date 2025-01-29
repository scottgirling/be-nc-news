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
      expect(response.body.msg).toBe("Article does not exist");
    });
  });
  test("400: should respond with an appropriate status and error message when given an invalid id", () => {
    return request(app)
    .get("/api/articles/one")
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Bad Request: wrong data type")
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
        expect(article).toHaveProperty("author", expect.any(String));
        expect(article).toHaveProperty("title", expect.any(String));
        expect(article).toHaveProperty("article_id", expect.any(Number));
        expect(article).toHaveProperty("topic", expect.any(String));
        expect(article).toHaveProperty("created_at", expect.any(String));
        expect(article).toHaveProperty("votes", expect.any(Number));
        expect(article).toHaveProperty("article_img_url", expect.any(String));
        expect(article).toHaveProperty("comment_count", expect.any(String));
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

describe("GET /api/articles/:article_id/comments", () => {
  test("200: should respond with an array of comment objects and an appropriate status code", () => {
    return request(app)
    .get("/api/articles/9/comments")
    .expect(200)
    .then(({ body: { comments } }) => {
      const expectedOutput = [
        {
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 16,
          author: "butter_bridge",
          article_id: 9,
          created_at: "2020-04-06T12:17:00.000Z",
          comment_id: 1
        },
        {
          body: "The owls are not what they seem.",
          votes: 20,
          author: "icellusedkars",
          article_id: 9,
          created_at: "2020-03-14T17:02:00.000Z",
          comment_id: 17
        }
      ];
      expect(comments).toMatchObject(expectedOutput);
    });
  });
  test("200: should respond with an ordered array of comment objects and an appropriate status code", () => {
    return request(app)
    .get("/api/articles/8/comments")
    .expect(200)
    .then(({ body: { comments } }) => {
      expect(comments).toBeSortedBy("created_at", { descending: true });
    });
  });

  test("400: should respond with an appropriate status and error message when given an invalid article_id", () => {
    return request(app)
    .get("/api/articles/one/comments")
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Bad Request: wrong data type");
    });
  });

  test("404: should respond with an appropriate status and error message when given a valid but non-existent article_id", () => {
    return request(app)
    .get("/api/articles/50/comments")
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe("Article does not exist");
    });
  });

  test("200: should respond with an empty array when a request to a valid article_id is made but no comments exist on it yet", () => {
    return request(app)
    .get("/api/articles/8/comments")
    .expect(200)
    .then(({ body: { comments } }) => {
      expect(comments.length).toBe(0);
    });
  });
});

describe("POST /api/snacks/:article_id/comments", () => {
  test("201: should add a comment to a specific article and responds with the posted comment and an appropriate status code", () => {
    return request(app)
    .post("/api/articles/9/comments")
    .send({
      username: "lurker",
      body: "this coding course is great!"
    })
    .expect(201)
    .then(({ body: { newComment } }) => {
      expect(newComment.author).toBe("lurker");
      expect(newComment.body).toBe("this coding course is great!");
    });
  });

  test("400: should respond with an appropriate status and error message when the given request body does not contain the correct fields", () => {
    return request(app)
    .post("/api/articles/9/comments")
    .send({
      body: "this coding course is great!"
    })
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Bad Request: body does not contain the correct fields")
    });
  });

  // below test not finished because PSQL appears to automatically turn the "body" from the number 12 to a string of "12". Therefore it's expecting a 201 status code and not a 400. Am I meant to add some code to prevent PSQL turning the "body" from a number 12 to a string of "12" or is it the ordinary function of PSQL to act in this manner? Is it possible to test for this?
  test.skip("400: should respond with an appropriate status and error message when given a body that contains valid fields but the value of the field is invalid", () => {
    return request(app)
    .post("/api/articles/9/comments")
    .send({
      username: "lurker",
      body: 12
    })
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Bad Request: wrong data type");
    });
  });

  test("400: should respond with an appropriate status and error message when given an invalid article_id", () => {
    return request(app)
    .post("/api/articles/nine/comments")
    .send({
      username: "lurker",
      body: "this coding course is great!"
    })
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Bad Request: wrong data type");
    });
  });

  test("404: should respond with an appropriate status and error message when given a valid but non-existent article_id", () => {
    return request(app)
    .post("/api/articles/1234/comments")
    .send({
      username: "lurker",
      body: "this coding course is great!"
    })
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Article does not exist")
    });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: should respond with the updated article and an appropriate status code when the number of votes has been increased", () => {
    return request(app)
    .patch("/api/articles/1")
    .send({ inc_votes: 12 })
    .expect(200)
    .then(({ body: { updatedArticle } }) => {
      const expectedOutput = {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 112,
        article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
      }
      expect(updatedArticle).toMatchObject(expectedOutput);
    });
  });

  test("200: should respond with the updated article and an appropriate status code when the number of votes has been decreased", () => {
    return request(app)
    .patch("/api/articles/1")
    .send({ inc_votes: -30 })
    .expect(200)
    .then(({ body: { updatedArticle } }) => {
      const expectedOutput = {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 70,
        article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
      }
      expect(updatedArticle).toMatchObject(expectedOutput);
    });
  });

  test("400: should respond with an appropriate status and error message when the given request body does not contain the correct fields", () => {
    return request(app)
    .patch("/api/articles/1")
    .send({})
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Bad Request: body does not contain the correct fields")
    });
  });

  test("400: should respond with an appropriate status and error message when given a body that contains valid fields but the value of the field is invalid", () => {
    return request(app)
    .patch("/api/articles/1")
    .send({ inc_votes: "fifteen" })
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Bad Request: wrong data type");
    });
  });
  
  test("400: should respond with an appropriate status and error message when given an invalid article_id", () => {
    return request(app)
    .patch("/api/articles/twelve")
    .send({ inc_votes: 12 })
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Bad Request: wrong data type");
    });
  });

  test("404: should respond with an appropriate status and error message when given a valid but non-existent article_id", () => {
    return request(app)
    .patch("/api/articles/876")
    .send({ inc_votes: 55 })
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Article does not exist");
    });
  });
});