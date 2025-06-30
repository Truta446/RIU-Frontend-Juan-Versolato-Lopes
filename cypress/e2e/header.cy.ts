describe('Header', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the language selector', () => {
    cy.get('.lang-select').should('exist');
  });

  it('should change the language to English', () => {
    cy.get('.lang-select').click();
    cy.get('.ant-select-item-option[title="EN"]').click();
    cy.contains('Heroes').should('exist');
  });
});
