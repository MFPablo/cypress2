/// <reference types="cypress" />

const { createTypeAliasDeclaration } = require("typescript")

describe('Test with backend', () => {

    beforeEach('login', () => {
        cy.server()
        cy.route('GET', '**/tags', 'fixture:tags.json')
        cy.loginToApplication()
    })

    it('should login', () => {

        cy.server()
        cy.route('POST', '**/articles').as('postArticles')

        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('This is a title')
        cy.get('[formcontrolname="description"]').type('This is a description')
        cy.get('[formcontrolname="body"]').type('This is a body')
        cy.contains('Publish Article').click()


        cy.wait('@postArticles')
        cy.get('@postArticles').then( xhr =>{
            console.log(xhr)
            expect(xhr.status).to.equal(200)
            expect(xhr.request.body.article.body).to.equal('This is a body')
            expect(xhr.request.body.article.description).to.equal('This is a description')
        })
    })

    
    it('Mock', () => {

     cy.get('.tag-list')
        .should('contain', 'cypress')
        .and('contain', 'automation')
        .and('contain', 'testing')
        
    })

        
    it.only('Mock 2 (server/route)', () => {


        cy.route('GET', '**/articles*', 'fixture:articles.json')
        cy.route('GET', '**/articles/feed*', '{"articles":[],"articlesCount":0}')

        cy.contains('Global Feed').click()
        cy.get('app-article-list button').then( listOfbuttons =>{
            expect(listOfbuttons[0]).to.contain('15')
            expect(listOfbuttons[1]).to.contain('0')
            expect(listOfbuttons[2]).to.contain('-1')

        })

        cy.fixture('articles').then(file => {
           const articleUrl = file.articles[0].slug
           cy.route('POST', '**/articles'+articleUrl+'/favorite', file)
        })

        cy.get('app-article-list button')
            .eq(0)
            .click()
            .should('contain', '16')
           
       })
   





})

