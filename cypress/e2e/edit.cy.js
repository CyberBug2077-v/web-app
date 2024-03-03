describe('Custom Card Creation', () => {
    beforeEach(() => {

      cy.visit('http://localhost:3000/login');
  
      cy.get('#\\:r1\\:').type('user@example.com');
      cy.get('#\\:r3\\:').type('SecurePassword123');
  
      cy.get('.MuiButton-contained').click();
  
      cy.url().should('include', '/');
    });
  
    it('allows a user to create a custom card after login', () => {
      // Click on the button that opens the customized card
      cy.get('.MuiGrid-root > .MuiButtonBase-root').click();
  
      // Fill in the information of the customized card
      cy.get('#\\:r5\\:').type('John Doe'); // Use the updated selector to position the name input box
      cy.get('textarea').type('This is a custom card description.'); // Positioning Description Input Box
  
      // 提交表单
      cy.get('.css-3z75l1 > .MuiButton-root').click(); // Positioning the Save button using the updated selector
  
      // Add assertions to validate the expected result of an operation
    });
  
  });
  