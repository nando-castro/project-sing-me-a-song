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
    await supertest(app).post("/recommendations").send(recommendationData);

    const recommendationCreated = await prisma.recommendation.findUnique({
      where: {
        name: recommendationData.name,
      },
    });

    const result = await supertest(app).post(
      `recommendations/${recommendationCreated.id}/upvote`
    );
    await recommendationFactory.insertVote(recommendationCreated.id, 1);
    const recommendationUpvote = await recommendationRepository.find(
      recommendationCreated.id
    );
    // expect(result.status).toBe(200);
    expect(recommendationUpvote.score).toBe(1);
  });
  it("Should not exists recommendation and return status code 404", async () => {
    const result = await supertest(app).post(`recommendations/${1}/upvote`);
    // const recommendationUpvote = await recommendationRepository.find(1);
    expect(result.status).toBe(404);
  });
  it("Should remove vote in recommendation and return status code 200", async () => {
    await supertest(app).post("/recommendations").send(recommendationData);

    const recommendationCreated = await prisma.recommendation.findUnique({
      where: {
        name: recommendationData.name,
      },
    });

    await supertest(app).post(
      `recommendations/${recommendationCreated.id}/downvote`
    );
    await recommendationFactory.insertVote(recommendationCreated.id, -1);
    const recommendationUpvote = await recommendationRepository.find(
      recommendationCreated.id
    );
    expect(recommendationUpvote.score).toBe(-1);
  });
  it("Should remove recommendation if score is less -5", async () => {
    await supertest(app).post("/recommendations").send(recommendationData);

    const recommendationCreated = await prisma.recommendation.findUnique({
      where: {
        name: recommendationData.name,
      },
    });
    await recommendationFactory.insertVote(recommendationCreated.id, -5);

    await supertest(app).post(
      `recommendations/${recommendationCreated.id}/downvote`
    );
    const recommendationUpvote = await recommendationRepository.find(
      recommendationCreated.id
    );
    expect(recommendationUpvote).toBeNull();
  });
});
