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

async function insertVote(id: number, score: number) {
  const rows = await prisma.recommendation.update({
    where: {
      id,
    },
    data: {
      score,
    },
  });
  return rows;
}

async function insertRecommendations(qte: number, score: number) {
  const recommendations = [];
  for (let i = 0; i < qte; i++) {
    const recommendation = {
      name: faker.lorem.words(2) + i,
      youtubeLink: "https://youtu.be/7DRFjThtC14",
      score: i,
    };
    const insertedRecommendation = await prisma.recommendation.create({
      data: {
        ...recommendation,
      },
    });
    recommendations.push(insertedRecommendation);
  }
  return recommendations;
}

const recommendationFactory = {
  insertVote,
  createRecommendation,
  insertRecommendation,
  insertRecommendations,
};

export default recommendationFactory;
