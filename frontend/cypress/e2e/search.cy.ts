import { faker } from '@faker-js/faker';

describe('Authentication Acceptance Tests', () => {
  // Shared variables to store test data
  let email;
  let password;

  before(() => {
    // Generate email and password for tests
    email = faker.internet.email();

    // Generate a password with at least 8 characters
    // and at least one uppercase letter, one lowercase letter,
    // one number, and one special character
    password = faker.internet.password({
      length: 10,
      prefix: 'Aa1!',
    });

    cy.visit('http://localhost:3000/register');

    // Register a new account
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="confirmPassword"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.url().should('eq', 'http://localhost:3000/login');
    // Login
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
  });

  it('AT0152123: Search', () => {
    cy.log('Made it to the homepage bro.');
  });

  after(() => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.get('p').contains(email).click();
    cy.get('a').contains('Profile').click();
    cy.get('button').contains('Delete Account').click();
    cy.get('button').contains('Proceed').click();
  });
});
