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
