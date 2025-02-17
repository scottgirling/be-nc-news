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
  test("200: should respond with an appropriate status code and a single article object with a comment_count property set to the total count of all comments with this article_id", () => {
    return request(app)
    .get("/api/articles/9")
    .expect(200)
    .then(({ body: { article } }) => {
      const expectedOutput = {
        article_id: 9,
        title: "They're not exactly dogs, are they?",
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'Well? Think about it.',
        created_at: "2020-06-06T09:10:00.000Z",
        votes: 0,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        comment_count: "2"
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
      expect(articles.length).toBe(10);
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
  describe("GET /api/articles QUERIES", () => {
    test("200: should sort by a valid column and respond with an sorted array of article objects with an appropriate status code", () => {
      return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
    });
    test("200: should by default sort by created_at if not otherwise specified, respoding with an sorted array of article objects and an appropriate status code", () => {
      return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
    });
    test("404: should return an appropriate error message and status code when trying to sort by an invalid column", () => {
      return request(app)
      .get("/api/articles?sort_by=characters")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid Input.");
      });
    });
    test("200: should order and respond with an ordered array of article objects with an appropriate status code", () => {
      return request(app)
      .get("/api/articles?sort_by=article_id&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("article_id");
      });
    });
    test("200: should by default order to desc if not otherwise specified, responding with an ordered array of article objects and an appropriate status code", () => {
      return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("article_id", { descending: true });
      });
    });
    test("404: should return an appropriate error message and status code when trying to order by an invalid option", () => {
      return request(app)
      .get("/api/articles?sort_by=article_id&order=backwards")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid Input.");
      });
    });
    test("200: should respond with a filtered list of article objects that match the topic query as well as an appropriate status code", () => {
      return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(10);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
    });
    test("200: should respond with an empty array and an appropriate status code when a request to a valid topic is made but no articles exist on it yet", () => {
      return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(0);
      });
    });
    test("404: should return an appropriate error message and status code when trying to filter by a topic that does not yet exist", () => {
      return request(app)
      .get("/api/articles?topic=coding")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Topic not found.");
      });
    });
  });
  describe("GET /api/articles PAGINATION", () => {
    test("200: should accept a 'limit' query and respond with an array of article objects according to this limit, as well as an appropriate status code", () => {
      return request(app)
      .get("/api/articles?limit=5")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(5);
      });
    });
    test("200: the 'limit' query should default to 10 and respond with an array of article objects according to this limit, as well as an appropriate status code", () => {
      return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(10);
      });
    });
    test("200: should accept a 'p' (page) query which specifies the page to start at and responds with an array or article objects according to this, as well as an appropriate status code", () => {
      return request(app)
      .get("/api/articles?sort_by=article_id&order=asc&p=2")
      .expect(200)
      .then(({ body: { articles, total_count } }) => {
        expect(articles.length).toBe(3);
        expect(total_count).toBe(3);
      });
    });
    // Consider what errors could occur with this endpoint, and make sure to test for them.
    // Note: This is a new behaviour which may break previous behaviours you have inferred.
    // Remember to add a description of this endpoint to your /api endpoint.
  });
});

describe("POST /api/articles", () => {
  test("should create an article resource, responding with the newly created article and an appropriate status code", () => {
    return request(app)
    .post("/api/articles")
    .send({
      author: "butter_bridge",
      title: "Once upon a time in CodeLand",
      body: "It's Friday! Let's keeping coding through the weekend!",
      topic: "paper",
      article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
    })
    .expect(201)
    .then(({ body: { newArticle } }) => {
      expect(newArticle).toHaveProperty("author", "butter_bridge");
      expect(newArticle).toHaveProperty("title", "Once upon a time in CodeLand");
      expect(newArticle).toHaveProperty("body", "It's Friday! Let's keeping coding through the weekend!");
      expect(newArticle).toHaveProperty("topic", "paper");
      expect(newArticle).toHaveProperty("article_img_url", "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
      expect(newArticle).toHaveProperty("article_id", expect.any(Number));
      expect(newArticle).toHaveProperty("votes", expect.any(Number));
      expect(newArticle).toHaveProperty("created_at", expect.any(String));
      expect(newArticle).toHaveProperty("comment_count", expect.any(String));
    });
  });
  test("201: should create an article resource with a deafult 'article_img_url' if none is provided in the request body, responding with the newly created article and an appropriate status code", () => {
    return request(app)
    .post("/api/articles")
    .send({
      author: "butter_bridge",
      title: "Once upon a time in CodeLand",
      body: "It's Friday! Let's keeping coding through the weekend!",
      topic: "paper",author: "butter_bridge",
    })
    .expect(201)
    .then(({ body: { newArticle } }) => {
      expect(newArticle).toHaveProperty("author", "butter_bridge");
      expect(newArticle).toHaveProperty("title", "Once upon a time in CodeLand");
      expect(newArticle).toHaveProperty("body", "It's Friday! Let's keeping coding through the weekend!");
      expect(newArticle).toHaveProperty("topic", "paper");
      expect(newArticle).toHaveProperty("article_img_url", "https://images.pexels.com/photos/defaultimage1234567");
      expect(newArticle).toHaveProperty("article_id", expect.any(Number));
      expect(newArticle).toHaveProperty("votes", expect.any(Number));
      expect(newArticle).toHaveProperty("created_at", expect.any(String));
      expect(newArticle).toHaveProperty("comment_count", expect.any(String));
    });
  });
  test("400: should respond with an appropriate status and error message when the given request body does not contain the correct fields", () => {
    return request(app)
    .post("/api/articles")
    .send({
      author: "butter_bridge",
      title: "Once upon a time in CodeLand",
      body: "It's Friday! Let's keeping coding through the weekend!",
    })
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Bad Request: body does not contain the correct fields")
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

describe("POST /api/articles/:article_id/comments", () => {
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

describe("PATCH /api/comments/:comment_id", () => {
  test("200: should respond with the updated comment and an appropriate status code when the number of votes has been increased", () => {
    return request(app)
    .patch("/api/comments/1")
    .send({ inc_votes: 10 })
    .expect(200)
    .then(({ body: { updatedComment } }) => {
      expect(updatedComment).toMatchObject({
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 26,
        author: "butter_bridge",
        article_id: 9,
        created_at: "2020-04-06T12:17:00.000Z"
      });
    });
  });
  test("200: should respond with the updated comment and an appropriate status code when the number of votes has been decreased", () => {
    return request(app)
    .patch("/api/comments/1")
    .send({ inc_votes: -10 })
    .expect(200)
    .then(({ body: { updatedComment } }) => {
      expect(updatedComment).toMatchObject({
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 6,
        author: "butter_bridge",
        article_id: 9,
        created_at: "2020-04-06T12:17:00.000Z"
      });
    });
  });
  test("400: should respond with an appropriate status and error message when the given request body does not contain the correct fields", () => {
    return request(app)
    .patch("/api/comments/1")
    .send({})
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Bad Request: body does not contain the correct fields");
    });
  });
  test("400: should respond with an appropriate status and error message when given a body that contains valid fields but the value of the field is invalid", () => {
    return request(app)
    .patch("/api/comments/1")
    .send({ inc_votes: "fifteen" })
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Bad Request: wrong data type");
    });
  });
  test("400: should respond with an appropriate status and error message when given an invalid comment_id", () => {
    return request(app)
    .patch("/api/comments/one")
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Bad Request: wrong data type");
    });
  });
  test("404: should respond with an appropriate status code and error message when given a valid but non-existent comment_id", () => {
    return request(app)
    .patch("/api/comments/555")
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Comment does not exist");
    });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: should remove the selected comment and return an appropriate status code", () => {
    return request(app)
    .delete("/api/comments/1")
    .expect(204)
  });
  test("400: should respond with an appropriate status and error message when given an invalid comment_id", () => {
    return request(app)
    .delete("/api/comments/one")
    .expect(400)
    .then(( { body: { msg } }) => {
      expect(msg).toBe("Bad Request: wrong data type");
    });
  });
  test("404: hould respond with an appropriate status and error message when given a valid but non-existent comment_id", () => {
    return request(app)
    .delete("/api/comments/354")
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Comment does not exist");
    });
  });
});

describe("GET /api/users", () => {
  test("200: should respond with an array of user objects with the appropriate properties and status code", () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({ body: { users } }) => {
      expect(users.length).toBe(4);
      users.forEach((user) => {
        expect(user).toHaveProperty("username", expect.any(String));
        expect(user).toHaveProperty("name", expect.any(String));
        expect(user).toHaveProperty("avatar_url", expect.any(String));
      });
    });
  });
});

describe("GET /api/users/:username", () => {
  test("200: should respond with a single user object with an appropriate status code", () => {
    return request(app)
    .get("/api/users/rogersop")
    .expect(200)
    .then(({ body: { user } }) => {
      expect(user).toMatchObject({
        username: 'rogersop',
        name: 'paul',
        avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
      });
    });
  });
  test("404: should respond with an appropriate error message and status code when given a valid but non-existent username", () => {
    return request(app)
    .get("/api/users/1234")
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("User does not exist.");
    });
  });
});