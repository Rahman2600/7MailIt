/// <reference types="cypress" />

const { ThreeDRotation } = require("@material-ui/icons");

context("Assertions", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  describe("TEmplate Tests", () => {

    it('login success and navigates to BasicTemplate_withImage', () => {

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

      //click ready
      cy.get('a[href*="campaignPage/BasicTemplate_withImage.docx"]').first().click()
      cy.wait(5000);

      cy.get('img[class="img-rounded"]')
        .should('be.visible');
    });
  });
});

