/// <reference types="cypress" />

const { createTypeAliasDeclaration } = require("typescript")

describe('Test with backend', () => {

    beforeEach('login', () => {

        cy.intercept({method: 'GET', path: 'tags'}, {fixture: 'tags.json'})
        cy.loginToApplication()
    })

    it('should login', () => {


        cy.intercept('POST', '**/articles').as('postArticles')

        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('This is a title')
        cy.get('[formcontrolname="description"]').type('This is a description')
        cy.get('[formcontrolname="body"]').type('This is a body')
        cy.contains('Publish Article').click()




        cy.wait('@postArticles')
        cy.get('@postArticles').then( xhr =>{
            console.log(xhr)
            // expect(xhr.response.statusCode).to.equal(200)
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

        
    it('Mock 2 (server/route)', () => {
        // See intercept documentation

        cy.intercept('GET', '**/articles*', {fixture: 'articles.json'})
        cy.intercept('GET', '**/articles/feed*', {"articles":[],"articlesCount":0})

        cy.contains('Global Feed').click()
        cy.get('app-article-list button').then( listOfbuttons =>{
            expect(listOfbuttons[0]).to.contain('15')
            expect(listOfbuttons[1]).to.contain('0')
            expect(listOfbuttons[2]).to.contain('-1')

        })

        cy.fixture('articles').then(file => {
           const articleUrl = file.articles[0].slug
           cy.intercept('POST', '**/articles'+articleUrl+'/favorite', file)
        })

        cy.get('app-article-list button')
            .eq(0)
            .click()
            .should('contain', '16')
           
       })
   

    it.skip('intercepting request response', () => {


        // cy.intercept('POST', '**/articles', (req => {
        //     req.body.article.description = "This is a description 2"
        // })).as('postArticles')

        cy.intercept('POST', '**/articles', (req) => {
            req.reply( res => {
                expect(res.body.article.description).to.equal("This is a description")
                res.body.article.description = "This is a description 2"
            })
        }).as('postArticles')

        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('This is a title')
        cy.get('[formcontrolname="description"]').type('This is a description')
        cy.get('[formcontrolname="body"]').type('This is a body')
        cy.contains('Publish Article').click()

        


        cy.wait('@postArticles')
        cy.get('@postArticles').then( xhr =>{
            console.log(xhr)
            // expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.request.body.article.body).to.equal('This is a body')
            expect(xhr.request.body.article.description).to.equal('This is a description2')
        })
    })

    it.only('delete from API', () => {
        const bodyRequest = {
            "article": {
            "tagList": [],
            "title": "Request API",
            "description": "API test easy",
            "body": "Angular is cool"
            }
        }
        

      cy.get('@token').then( token => {
            cy.request({
                
                url: 'https://api.realworld.io/api/articles/',
                headers: {'Authorization': 'Token '+token},
                method: 'POST',
                body: bodyRequest
            }).then(response => {
                expect(response.status).to.equal(200)
            })

            cy.contains('Global Feed').click()
            cy.get('.article-preview').first().click()
            cy.get('.article-actions').contains('Delete Article').click()

            cy.wait(1000)
            cy.request({
                url: 'https://api.realworld.io/api/articles?limit=10&offset=0',
                headers: {'Authorization': 'Token '+token},
                method: 'GET',
            }).its('body').then( body => {
                expect(body.articles[0].title).not.to.equal('Request API')
            })
        })


    })


})

