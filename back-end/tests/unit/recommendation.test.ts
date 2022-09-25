import { CreateRecommendationData } from "./../../src/services/recommendationsService";
import { jest } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { recommendationService } from "../../src/services/recommendationsService";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";

jest.mock("../../src/repositories/recommendationRepository");

beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});

describe("Test suite insert recommendation", () => {
  it("Should create recommendation", async () => {
    const recommendation: CreateRecommendationData = {
      name: faker.lorem.words(2),
      youtubeLink:
        "https://www.youtube.com/watch?v=7DRFjThtC14&ab_channel=%ED%94%BC%EC%8B%9D%EB%8C%80%ED%95%99PsickUniv",
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
  
});
