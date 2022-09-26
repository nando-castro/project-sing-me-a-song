import { recommendationRepository } from "./../../src/repositories/recommendationRepository";
import supertest from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/database";
import recommendationFactory from "../factories/recommendationFactory";
import scenarioFactory from "../factories/scenarioFactory";

beforeEach(() => {
  scenarioFactory.deleteAllData();
});

const recommendationData = recommendationFactory.createRecommendation();

describe("Test POST/recommendation", () => {
  it("Should create a recommendation and return status code 201", async () => {
    const result = await supertest(app)
      .post("/recommendations")
      .send(recommendationData);

    const recommendationCreated = await prisma.recommendation.findFirst({
      where: {
        name: recommendationData.name,
      },
    });
    expect(result.status).toBe(201);
    expect(recommendationCreated).not.toBeNull();
  });
  it("Should not create a recommendation and return status code 422", async () => {
    const result = await supertest(app).post("/recommendations").send();

    expect(result.status).toBe(422);
  });
  it("Should create a recommendation already exists and return status code 409", async () => {
    await supertest(app).post("/recommendations").send(recommendationData);

    const result = await supertest(app)
      .post("/recommendations")
      .send(recommendationData);

    const recommendationCreated = await prisma.recommendation.findFirst({
      where: {
        name: recommendationData.name,
      },
    });
    expect(result.status).toBe(409);
    expect(recommendationCreated).not.toBeNull();
  });
});

describe("Test upvote and downvote in POST/recommendation/upvote", () => {
  it("Should add vote in recommendation and return status code 200", async () => {
    const recommendation = await recommendationFactory.insertRecommendation(
      recommendationData
    );

    const id = recommendation.id;

    const result = await supertest(app).post(`/recommendations/${id}/upvote`);

    const recommendationFind = await recommendationRepository.find(id);

    expect(result.status).toBe(200);
    expect(recommendationFind.score).toBe(1);
  });
  it("Should not exists recommendation and return status code 404", async () => {
    const result = await supertest(app).post(`recommendations/${1}/upvote`);
    expect(result.status).toBe(404);
  });
  it("Should remove vote in recommendation and return status code 200", async () => {
    const recommendation = await recommendationFactory.insertRecommendation(
      recommendationData
    );

    const id = recommendation.id;

    const result = await supertest(app).post(`/recommendations/${id}/downvote`);

    const recommendationFind = await recommendationRepository.find(id);

    expect(result.status).toBe(200);
    expect(recommendationFind.score).toBe(-1);
  });
  it("Should remove recommendation if score is less -5", async () => {
    const recommendation = await recommendationFactory.insertRecommendation(
      recommendationData
    );

    const id = recommendation.id;

    await recommendationFactory.insertVote(id, -5);

    await supertest(app).post(`/recommendations/${id}/downvote`);

    const recommendationFind = await recommendationRepository.find(id);

    expect(recommendationFind).toBeNull();
  });
});

describe("Test GET/recomendations", () => {
  it("Should return the last 10 most voted songs", async () => {
    await recommendationFactory.insertRecommendations(11, 0);

    const result = await supertest(app).get(`/recommendations`);

    expect(result.body.length).toBe(10);
  });
});
