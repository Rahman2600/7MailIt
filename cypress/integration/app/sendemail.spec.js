/// <reference types="cypress" />

const { ThreeDRotation } = require("@material-ui/icons");

context("Assertions", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  describe("Send email test", () => {
    it('login success and send email', () => {

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
      cy.get('a[href*="campaignPage/BasicTemplate_withImage.docx"]').first().click()
      cy.wait(5000);

      cy.get('img[class="img-rounded"]')
        .should('be.visible');

      //single email test
      cy.get('#email-address')
        .should('be.visible')
        .type('gurveer.kaur.aulakh@gmail.com');
        cy.get('#subject-line')
        .should('be.visible')
        .type('EmailSubject');
      cy.get('input[aria-label="NAME"]')
        .should('be.visible')
        .type('abc');
      cy.get('input[aria-label="AMOUNT"]')
        .should('be.visible')
        .type('2000');
      cy.get('input[aria-label="PROMO_CODE"]')
        .should('be.visible')
        .type('def');
      cy.get('button[id="button1"]')
        .should('be.visible')
        .click();
      cy.wait(5000);
      cy.get('#emailSentAlert')
        .should('be.visible');

    });
  });

});

