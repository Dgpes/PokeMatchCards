// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/* eslint-disable no-undef */
Cypress.Commands.add('visitURL', () => {
  cy.fixture('important.json').then((data) => {
    cy.visit(data.url);
    sessionStorage.removeItem('user');
  });
});

Cypress.Commands.add('register', () => {
  cy.visitURL();
  const usernameInput = cy.get('#username');
  usernameInput.type('John Doe');

  const emailInput = cy.get('#email');
  emailInput.type('johndoe@example.com');

  cy.get('#user-form').submit();
  cy.get('#game').should('be.visible');
  cy.window().then((win) => expect(win.sessionStorage.getItem('user')).to.not.be.null);
});
