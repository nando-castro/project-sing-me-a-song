import { faker } from "@faker-js/faker";

const URL = "http://localhost:3000";

describe("Test Home", () => {
  it("Should create recommendation", () => {
    const recommendationData = {
      name: faker.lorem.words(2),
      youtubeLink: "https://youtu.be/7DRFjThtC14",
    };
    cy.visit(URL);

    cy.get("#name").type(recommendationData.name);
    cy.get("#link").type(recommendationData.youtubeLink);

    cy.intercept("POST", `${URL}/recommendations`).as("createRecommendations");
    cy.intercept("GET", `${URL}/recommendations`).as("getRecommendations");

    cy.get("#button").click();

    cy.wait("@createRecommendations");
    cy.wait("@getRecommendations");
    cy.contains(recommendationData.name).should("be.visible");
    cy.end();
  });
});
