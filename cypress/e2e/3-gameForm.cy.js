/* eslint-disable no-undef */
describe('Game form', () => {
  beforeEach(() => {
    cy.register();
  });

  it('should show alert with odd number', () => {
    cy.get('#cards-number').type('3');
    cy.get('#game-form').submit();
    cy.get('#modal').should('be.visible');
  });

  it('should start the game', () => {
    cy.get('#cards-number').type('4');
    cy.get('#game-form').submit();
    cy.get('#game-board').should('be.visible');
  });

  it('should restart the game', () => {
    cy.get('#cards-number').type('4');
    cy.get('#game-form').submit();
    cy.get('#game-board').should('be.visible');
    cy.get('#cards-number').clear();
    cy.get('#cards-number').type('6');
    cy.get('#game-form').submit();
    cy.get('#game-board').children().should('have.length', 6);
  });
});
