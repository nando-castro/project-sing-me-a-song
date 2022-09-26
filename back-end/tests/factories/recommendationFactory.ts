import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database";
import { CreateRecommendationData } from "../../src/services/recommendationsService";

function createRecommendation() {
  const recommendation: CreateRecommendationData = {
    name: faker.lorem.words(2),
    youtubeLink: "https://youtu.be/7DRFjThtC14",
  };

  return recommendation;
}

async function insertRecommendation(recommendation: CreateRecommendationData) {
  const response = await prisma.recommendation.create({
    data: recommendation,
  });

  return response;
}

const recommendationFactory = {
  createRecommendation,
  insertRecommendation,
};

export default recommendationFactory;
