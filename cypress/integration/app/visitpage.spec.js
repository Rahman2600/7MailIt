/// <reference types="cypress" />

const { ThreeDRotation } = require("@material-ui/icons");

context("Assertions", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });
  describe("Page Opens Test", () => {
    it('login success and navigates to first template', () => {

      // login
      cy.get('#email')
        .should('be.visible')
        .type('mountainSasquatch00@gmail.com');
      cy.get('#password')
        .should('be.visible')
        .type('teamMailIt!');
      cy.get('button[type="submit"]')
        .should('be.visible')
        .click();

      cy.wait(5000);

      // click ready
      cy.get('a[href*="/campaignPage/3fda23114tdf5"]').first().click()
      cy.wait(5000);

      cy.get('img[class="img-rounded"]')
        .should('be.visible');
    });
  });
  it('login fail', () => {

    // login
    cy.get('#email')
      .should('be.visible')
      .type('mountainSauatch00@gmail.com');
    cy.get('#password')
      .should('be.visible')
      .type('teamMailIt!');
    cy.get('button[type="submit"]')
      .should('be.visible')
      .click();

    cy.wait(5000);

    cy.url().should('eq', 'http://localhost:3000/');

  });
  

  describe("Log out test", () => {
    it('login success and navigates to first template', () => {

      // login
      cy.get('#email')
        .should('be.visible')
        .type('mountainSasquatch00@gmail.com');
      cy.get('#password')
        .should('be.visible')
        .type('teamMailIt!');
      cy.get('button[type="submit"]')
        .should('be.visible')
        .click();

      cy.wait(5000);

      // click logoff
      cy.get('a[id="logOutButton"]').click();
      cy.wait(35000);

      // validate login is visible
      cy.get('#email')
        .should('be.visible');
    });
  });
});

