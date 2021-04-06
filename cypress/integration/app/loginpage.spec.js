/// <reference types="cypress" />

const { ThreeDRotation } = require("@material-ui/icons");

context("Assertions", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  describe("Login Tests", () => {

    it('logout success after login', () => {

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

    it('password change fail', () => {

      // login
      cy.get('#email')
        .should('be.visible')
        .type('kaurguvi06@gmail.com');
      cy.get('#password')
        .should('be.visible')
        .type('BfulGuvi06');
      cy.get('button[type="submit"]')
        .should('be.visible')
        .click();

      cy.wait(5000);

      // click logoff
      cy.get('a[id="logOutButton"]').click();
      cy.wait(5000);

      // validate login is visible
      cy.get('#email')
        .should('be.visible');

      // click change password
      cy.get('a[id="change-password-link"]').click();

      cy.get('#email')
        .should('be.visible')
        .type('kaurguvi06@gmail.com');
      cy.get('#temp-password')
        .should('be.visible')
        .type('BfulGuvi06');
      cy.get('#new-password')
        .should('be.visible')
        .type('UglyShugly08');
      cy.get('#confirm-password')
        .should('be.visible')
        .type('UglyShugly08');
      cy.get('button[id="update-password-button"]')
        .should('be.visible')
        .click();

      cy.wait(5000);

      cy.contains("Cannot update a permanent password. Please login using the main authentication page");

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
  });
});

