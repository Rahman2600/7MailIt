/// <reference types="cypress" />

const { ThreeDRotation } = require("@material-ui/icons");
import 'cypress-file-upload';


context("Assertions", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  describe("Template Tests", () => {

    it('clicking Submit template without name gives error', () => {

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
      cy.get('#template-Submit')
        .should('be.visible')
        .click();

      cy.contains("At least one field is empty. Please fill in both fields to continue.");
    });

    it('clicking Submit template without file gives error', () => {

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

      cy.get('#template-name')
        .should('be.visible')
        .type('kaurguvi06@gmail.com');

      //click submit
      cy.get('#template-Submit')
        .should('be.visible')
        .click();

      cy.contains("At least one field is empty. Please fill in both fields to continue.");
    });

    it('clicking Submit template with file and name generate fails if template name has .docx', () => {

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

      //enter template name
      cy.get('#template-name')
        .should('be.visible')
        .type('testtemplate.docx');

      // upload template
      cy.fixture('test2.docx', 'base64').then(fileContent => {
        cy.get('input[type="file"]').attachFile({
          fileContent: fileContent.toString(),
          fileName: 'test2.docx',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
      });

      //click submit
      cy.get('#template-Submit')
        .should('be.visible')
        .click();

      cy.contains("The template name can only contain alpha numeric characters, underscores and/or hyphens");
    });

    it('clicking Submit template with file and name generate success', () => {

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

      const templateName = "testtemplates"+ Math.floor((Math.random() * 1000) + 1);;

      //enter template name
      cy.get('#template-name')
        .should('be.visible')
        .type(templateName);

      // upload template
      cy.fixture('test2.docx', 'base64').then(fileContent => {
        cy.get('input[type="file"]').attachFile({
          fileContent: fileContent,
          fileName: 'test2.docx',
          encoding: 'base64',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
      });


      //click submit
      cy.get('#template-Submit')
        .should('be.visible')
        .click();

      cy.wait(15000);

      cy.contains("Sucessfully uploaded file");

      //verify grid has template
      cy.get('table').contains('td', templateName);
      cy.get('table').contains('td', "test2.docx");
      cy.get('table').contains('td', "\"name\",\"AMOUNT\",\"PROMO_CODE\"");

    });

    it('login success and navigates to test2 template and display image', () => {

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
      cy.get('a[href*="campaignPage/test2.docx"]').first().click()
      cy.wait(5000);

      cy.get('img[class="img-rounded"]')
        .should('be.visible');
    });
  });
});

