/// <reference types="cypress" />

context("Assertions", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });
  describe("Page Opens Test", () => {
    it('finds the content "type"', () => {
      //cy.contains("Learn React");
    });
  });
});
