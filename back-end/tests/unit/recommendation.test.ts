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
  it("Should get recommendations by id error not_found", async () => {
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

describe("Test suite votes recommendations", () => {
  it("Should upvote recommendation sucess ", async () => {
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

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {});

    await recommendationService.upvote(recommendation.id);

    expect(recommendationRepository.updateScore).toBeCalled();
  });
  it("Should upvote recommendation error not_found ", async () => {
    const recommendation: Recommendation = {
      id: 1,
      name: faker.lorem.words(2),
      youtubeLink: "https://youtu.be/7DRFjThtC14",
      score: 1,
    };
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {});

    const response = recommendationService.upvote(recommendation.id);

    expect(response).rejects.toEqual({ type: "not_found", message: "" });
    expect(recommendationRepository.updateScore).not.toBeCalled();
  });
  it("Should downvote recommendation sucess ", async () => {
    const recommendation: Recommendation = {
      id: 1,
      name: faker.lorem.words(2),
      youtubeLink: "https://youtu.be/7DRFjThtC14",
      score: 3,
    };
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return recommendation;
      });

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {
        return recommendation;
      });

    await recommendationService.downvote(recommendation.id);

    expect(recommendationRepository.updateScore).toBeCalled();
  });
  it("Should downvote recommendation error not_found ", async () => {
    const recommendation: Recommendation = {
      id: 1,
      name: faker.lorem.words(2),
      youtubeLink: "https://youtu.be/7DRFjThtC14",
      score: 4,
    };
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {});

    const response = recommendationService.downvote(recommendation.id);

    expect(response).rejects.toEqual({ type: "not_found", message: "" });
    expect(recommendationRepository.updateScore).not.toBeCalled();
  });
});
