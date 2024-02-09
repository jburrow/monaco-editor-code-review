/// <reference types="cypress" />

// import "@testing-library/cypress/add-commands";

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe("example to-do app", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit("http://localhost:8080/examples");
  });

  it("displays two todo items by default", async () => {
    cy.wait(2000);

    // cy.f;

    const comment = cy.findByText("Markdown Example", { timeout: 3000 }).first();
    expect(comment);

    const clearButton = cy.findByText("Clear Comments", { timeout: 3000 }).first();
    console.log(comment);

    await clearButton.click();

    // We use the `cy.get()` command to get all elements that match the selector.
    // Then, we use `should` to assert that there are two matched items,
    // which are the two default items.
    // cy.get(".todo-list li").should("have.length", 2);
    // We can go even further and check that the default todos each contain
    // the correct text. We use the `first` and `last` functions
    // to get just the first and last matched elements individually,
    // and then perform an assertion with `should`.
    // cy.get(".todo-list li").first().should("have.text", "Pay electric bill");
    // cy.get(".todo-list li").last().should("have.text", "Walk the dog");
  });
});
