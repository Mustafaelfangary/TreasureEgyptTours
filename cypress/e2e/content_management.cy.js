describe('Content Management', () => {
  beforeEach(() => {
    // Mock the API responses
    cy.intercept('GET', '/api/auth/session', { 
      fixture: 'session.json' 
    }).as('session');
    
    cy.intercept('GET', '/api/admin/content-models', { 
      fixture: 'content-models.json' 
    }).as('getModels');
    
    cy.intercept('POST', '/api/admin/content/test-model', { 
      statusCode: 201, 
      body: { 
        id: 'new-item-123',
        title: 'Test Content',
        description: 'Test Description',
        isFeatured: false,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } 
    }).as('createContent');

    // Login
    cy.visit('/auth/signin');
    cy.get('input[name="email"]').type('admin@example.com');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();
    
    // Wait for redirect to admin
    cy.url().should('include', '/admin');
  });

  it('creates new content', () => {
    // Navigate to content creation
    cy.contains('Content').click();
    cy.contains('Create New').click();
    cy.contains('Test Model').click();

    // Fill out the form
    cy.get('input[name="title"]').type('Test Content');
    cy.get('textarea[name="description"]').type('This is a test description');
    cy.get('button[type="submit"]').click();

    // Verify success
    cy.wait('@createContent').then((interception) => {
      expect(interception.request.body).to.include({
        title: 'Test Content',
        description: 'This is a test description',
      });
    });
    
    cy.contains('Content created successfully').should('be.visible');
    cy.url().should('include', '/admin/content/test-model');
  });

  it('edits existing content', () => {
    cy.intercept('GET', '/api/admin/content/test-model/item-123', {
      statusCode: 200,
      body: {
        id: 'item-123',
        title: 'Existing Content',
        description: 'Original description',
        isFeatured: false,
      }
    }).as('getContent');

    cy.intercept('PATCH', '/api/admin/content/test-model/item-123', {
      statusCode: 200,
      body: {
        id: 'item-123',
        title: 'Updated Content',
        description: 'Updated description',
        isFeatured: true,
      }
    }).as('updateContent');

    // Navigate to edit page
    cy.visit('/admin/content/test-model/item-123');
    cy.wait('@getContent');

    // Update the form
    cy.get('input[name="title"]').clear().type('Updated Content');
    cy.get('textarea[name="description"]').clear().type('Updated description');
    cy.get('button[type="submit"]').click();

    // Verify update
    cy.wait('@updateContent');
    cy.contains('Content updated successfully').should('be.visible');
  });

  it('deletes content', () => {
    cy.intercept('DELETE', '/api/admin/content/test-model/item-123', {
      statusCode: 200,
    }).as('deleteContent');

    // Navigate to content list
    cy.visit('/admin/content/test-model');

    // Click delete button
    cy.get('[data-testid="delete-item-123"]').click();
    
    // Confirm deletion
    cy.contains('Are you sure').should('be.visible');
    cy.contains('Delete').click();

    // Verify deletion
    cy.wait('@deleteContent');
    cy.contains('Content deleted successfully').should('be.visible');
  });

  it('performs bulk actions', () => {
    cy.intercept('POST', '/api/admin/content/test-model/bulk', {
      statusCode: 200,
      body: {
        success: true,
        count: 2,
      }
    }).as('bulkAction');

    // Navigate to content list
    cy.visit('/admin/content/test-model');

    // Select multiple items
    cy.get('[data-testid="checkbox-item-1"]').click();
    cy.get('[data-testid="checkbox-item-2"]').click();

    // Perform bulk action
    cy.get('[data-testid="bulk-actions"]').click();
    cy.contains('Publish').click();

    // Confirm
    cy.contains('Confirm').click();

    // Verify
    cy.wait('@bulkAction');
    cy.contains('2 items updated').should('be.visible');
  });
});
