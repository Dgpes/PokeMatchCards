/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
describe('Game play', () => {
  beforeEach(() => {
    cy.register();
    cy.get('#cards-number').type('4');
    cy.get('#game-form').submit();
  });

  it('should show ranking', () => {
    // should exist at least one td in the table
    cy.get('#ranking tr td').first().should('exist');
  });

  it('should show timer', () => {
    cy.wait(2 * 1000).then(() => {
      cy.get('#timer').should('have.text', '0m 2s');
    });
  });

  it('should show 4 cards', () => {
    cy.get('#game-board').children().should('have.length', 4);
  });

  it('should flip cards', () => {
    cy.get('#game-board').children().first().click();
    cy.get('#game-board').children().first().should('have.class', 'flipped');
    cy.get('#game-board').children().first().should('have.css', 'background-image');
  });

  it('should match cards', () => {
    const cards = cy.get('#game-board').children();
    cards.first().click();
    cards.first().invoke('data', 'id').then((dataId) => {
      // get element with same data-id
      const sameCard = cards.get(`[data-id="${dataId}"]`).last();
      sameCard.click();
      sameCard.should('have.class', 'matched');
      cards.first().should('have.class', 'matched');
    });
  });

  it('should not match cards', () => {
    const cards = cy.get('#game-board').children();
    cards.first().click();
    cards.first().invoke('data', 'id').then((dataIdFirst) => {
      // get element with different data-id
      cards.get('[data-id]').last().invoke('data', 'id').then((dataIdLast) => {
        let differentCard;
        if (dataIdFirst !== dataIdLast) {
          differentCard = cards.get(`[data-id="${dataIdLast}"]`).last();
        } else {
          differentCard = cards.get('[data-id]:nth-child(2)');
        }
        differentCard.click();
        differentCard.should('not.have.class', 'matched');
        cards.first().should('not.have.class', 'matched');
      });
    });
  });

  it('should finish game', () => {
    finishGame();
    cy.log('Game finished');
  });

  it('should update ranking when game is finished', () => {
    finishGame();
    cy.get('#ranking .highlight').contains('johndoe@example.com');
    cy.get('#ranking .highlight').contains('0m 0s');
  });

  it('should stop timer when game is finished', () => {
    finishGame();
    cy.wait(1000).then(() => {
      cy.get('#timer').should('not.have.text', '0m 1s');
    });
  });
});

function finishGame() {
  const cards = cy.get('#game-board').children();
  cards.first().click();
  cards.first().invoke('data', 'id').then((dataId) => {
    // get element with same data-id
    const sameCard = cards.get(`[data-id="${dataId}"]`).last();
    sameCard.click();
    // get element with different data-id
    const differentCards = cards.get(`[data-id]:not([data-id="${dataId}"])`);
    differentCards.first().click();
    differentCards.first().invoke('data', 'id').then((nextDataId) => {
      // get element with same data-id
      const nextSameCard = differentCards.get(`[data-id="${nextDataId}"]`).last();
      nextSameCard.click();
    });
  });
}
