describe('Heroes CRUD', () => {
  beforeEach(() => {
    cy.visit('/heroes');
    cy.get('.lang-select').click();
    cy.get('.ant-select-item-option[title="EN"]').click();
    cy.get('body').click();
  });

  it('should list all heroes', () => {
    cy.get('table').should('exist');
    cy.get('tbody tr').its('length').should('be.gte', 1);
  });

  it('should create a new hero', () => {
    cy.get('app-button[routerlink="/heroes/0"]').click();
    cy.url().should('include', '/heroes/0');

    cy.get('input[formcontrolname="name"]').type('Test Hero');
    cy.get('nz-select[formcontrolname="superPower"]').click();
    cy.get('.ant-select-item-option[title="Flight"]').click();
    cy.get('body').click();
    cy.get('textarea[formcontrolname="description"]').type('A hero created by Cypress');

    cy.get('app-button[type="primary"]').contains('Save').click();

    cy.url().should('include', '/heroes');
    cy.contains('TEST HERO').should('exist');
  });

  it('should edit a hero', () => {
    cy.get('tbody tr').first().find('nz-icon[nzType="more"]').click();

    cy.get('.ant-dropdown').should('exist');

    cy.contains('li', 'Edit').click();

    cy.url().should('include', '/heroes/');

    cy.get('input[formcontrolname="name"]').clear().type('Updated Hero');
    cy.get('app-button[type="primary"]').contains('Save').click();

    cy.url().should('include', '/heroes');
    cy.contains('UPDATED HERO').should('exist');
  });

  it('should delete a hero', () => {
    cy.get('tbody tr').first().find('nz-icon[nzType="more"]').click();

    cy.get('.ant-dropdown').should('exist');

    cy.contains('li', 'Delete').click();

    cy.get('.ant-popover-buttons').find('button.ant-btn-primary').contains('Delete').click();

    cy.get('tbody tr').should('not.contain', 'UPDATED HERO');
  });
});
