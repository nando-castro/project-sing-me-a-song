import { recommendationRepository } from "./../../src/repositories/recommendationRepository";
import { Recommendation } from "@prisma/client";
import { CreateRecommendationData } from "./../../src/services/recommendationsService";
import { jest } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { recommendationService } from "../../src/services/recommendationsService";

jest.mock("../../src/repositories/recommendationRepository");

beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});

describe("Test suite insert recommendation", () => {
  it("Should create recommendation", async () => {
    const recommendation: CreateRecommendationData = {
      name: faker.lorem.words(2),
      youtubeLink: "https://youtu.be/7DRFjThtC14",
    };

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {});
    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementationOnce((): any => {});

    await recommendationService.insert(recommendation);
    expect(recommendationRepository.create).toBeCalled();
  });
  it("Should create recommendation names must be unique return conflict", async () => {
    const recommendation: CreateRecommendationData = {
      name: faker.lorem.words(2),
      youtubeLink: "https://youtu.be/7DRFjThtC14",
    };

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {
        return "data";
      });

    const response = recommendationService.insert(recommendation);
    expect(response).rejects.toEqual({
      type: "conflict",
      message: "Recommendations names must be unique",
    });
    expect(recommendationRepository.create).not.toBeCalled();
  });
});

describe("Test suite get recommendations", () => {
  it("Should get all recommendations", async () => {
    const recommendation: Recommendation[] = [
      {
        id: 1,
        name: faker.lorem.words(2),
        youtubeLink: "https://youtu.be/7DRFjThtC14",
        score: 5,
      },
    ];

    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {
        return recommendation;
      });

    const response = await recommendationService.get();
    expect(response).toEqual(recommendation);
  });
  it("Should get recommendations by id sucess", async () => {
    const recommendation: Recommendation = {
      id: 1,
      name: faker.lorem.words(2),
      youtubeLink: "https://youtu.be/7DRFjThtC14",
      score: 1,
    };

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return recommendation;
      });

    const response = await recommendationService.getById(recommendation.id);
    expect(response).toEqual(recommendation);
  });
  it("Should get recommendations by id sucess", async () => {
    const recommendation: Recommendation = {
      id: 1,
      name: faker.lorem.words(2),
      youtubeLink: "https://youtu.be/7DRFjThtC14",
      score: 1,
    };
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {});

    const response = recommendationService.getById(recommendation.id);
    expect(response).rejects.toEqual({ type: "not_found", message: "" });
  });
});
