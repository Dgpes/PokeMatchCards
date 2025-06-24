/* eslint-disable no-undef */
describe('User form', () => {
  beforeEach(() => {
    cy.visitURL();
  });

  it('should submit form with correct data', () => {
    cy.register();
  });
});
