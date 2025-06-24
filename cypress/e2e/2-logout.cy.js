/* eslint-disable no-undef */
describe('Logout button', () => {
  beforeEach(() => {
    cy.register();
  });

  it('should logout and reload the page', () => {
    cy.get('#logout-btn').click();
    cy.window().should('have.property', 'sessionStorage')
      .and('not.have.property', 'user');
    cy.get('#user-form').should('be.visible');
  });
});
