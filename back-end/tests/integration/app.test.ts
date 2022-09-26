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
});
