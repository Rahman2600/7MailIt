/// <reference types="cypress" />

context("Assertions", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });
  describe("Page Opens Sign-In Page", () => {
    it('finds the content "type"', () => {
      cy.contains("Sign in");
    });
  });
});
