/// <reference types="cypress" />

describe.skip("First Suit", () => {
    it("First test", () => {
        
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Forms Layouts').click()

        // by Tag Name
        cy.get('input')

        // by ID
        cy.get('#inputEmail1')

        // by Class Name
        cy.get('.input-full-width')

        //by Attribute
        cy.get('[placeholder]')

        // by Attribute Name and Value
        cy.get('[placeholder="Email"]')

        // by Class value
        cy.get('[class="input-full-width size-medium shape-rectangle"]')

        // by two different attributes
        cy.get('[placeholder="Email"][type="email"]')

        // by Tag Name, Attribute with value, ID and Class Name
        cy.get('input[placeholder="Email"]#inputEmail1.input-full-width')

        // (Recommended) personalized selector
        cy.get('[data-cy="inputEmail1"]')

        // cy.get('')

    });
});

describe("Second Suit", () => {
    it("Selectors test", () => {
        
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

       cy.get('[data-cy="signInButton"]')
       cy.contains("Sign in")

       cy.contains('[status="warning"]','Sign in')

       cy.get("#inputEmail3")
        .parents('form')
        .find('button')
        .should('contain','Sign in')
        .parents('form')
        .find('nb-checkbox')
        .click()
    });

    it("Invoke", () => {
        
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()
        

        //1
        cy.get('[for="exampleInputEmail1"]').should('contain', 'Email address')

        //2
        cy.get('[for="exampleInputEmail1"]').then(label => {
            expect(label.text()).to.equal('Email address')
        })

        //3
        cy.get('[for="exampleInputEmail1"]').invoke('text').then(text => {
            expect(text).to.equal('Email address')
        })

        //4
        cy.contains('nb-card', 'Basic form')
            .find('nb-checkbox')
            .click()
            .find('.custom-checkbox')
            .invoke('attr','class')
            //.should('contain','checked')
            .then(classValue => {
                expect(classValue).to.contain('checked')
            })       
    });

    it("Assert property", () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Datepicker').click()

        cy.contains('nb-card', 'Common Datepicker').find('input').then(input => {
            cy.wrap(input).click()
            cy.get('nb-calendar-day-picker').contains('17').click()
            cy.wrap(input).invoke('prop','value').should('contain','Mar 17, 2022')
        })
    });
});


describe("Checkboxes amd Radio Buttons", () => {
    it("Radio Button", () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click() 

        cy.contains('nb-card', 'Using the Grid').find('[type="radio"]').then( radioButtons => {
            cy.wrap(radioButtons)
            .first()
            .check({force: true})
            .should('be.checked')
      

        cy.wrap(radioButtons)
            .eq(1)
            .check({force: true})
            .should('be.checked')

            
        cy.wrap(radioButtons)
            .first()
            .should('not.be.checked')
        
     

        cy.wrap(radioButtons)
        .eq(2)
        .should('be.disabled')

        })

    })

    it("Check boxes", () => {
        cy.visit('/')
        cy.contains('Modal & Overlays').click()
        cy.contains('Toastr').click() 
        
        cy.get('[type="checkbox"]').check({force: true})
        cy.get('[type="checkbox"]').click({force: true})

    })

    it("Dropdown", () => {
        cy.visit('/')

        //1
        // cy.get('nav nb-select').click()
        // cy.get('.options-list').contains('Dark').click()
        // cy.get('nb-layout-header nav').should('have.css', 'background-color', 'rgb(34, 43, 69)')


        //2
        cy.get('nav nb-select').then( dropdown => {
            cy.wrap(dropdown).click()
            cy.get('.options-list nb-option').each( (listItem, index )=> {
                const itemText = listItem.text().trim()

                const colors ={
                    "Light": "rgb(255, 255, 255)",
                    "Dark": "rgb(34, 43, 69)",
                    "Cosmic": "rgb(50, 50, 89)",
                    "Corporate": "rgb(255, 255, 255)"
                }


                cy.wrap(listItem).click()
                cy.wrap(dropdown).should('contain', itemText)
                cy.get('nb-layout-header nav').should('have.css', 'background-color', colors[itemText])

                if(index < 3){
                cy.wrap(dropdown).click()
                }

            })

        })
    })

    it.only("Web Table", () => {
        cy.visit('/')
        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click() 

        //1
        cy.get('tbody').contains('tr', 'Larry').then( tableRow =>{
            cy.wrap(tableRow).find('.nb-edit').click()
            cy.wrap(tableRow).find('[placeholder="Age"]').clear().type('25')
            cy.wrap(tableRow).find('.nb-checkmark').click()
            cy.wrap(tableRow).find('td').eq(6).should('contain', '25')
        })

        //2
        cy.get('thead').find('.nb-plus').click()
        cy.get('thead').find('tr').eq(2).then(tableRow =>{
            cy.wrap(tableRow).find('[placeholder="First Name"]').type('Artem')
            cy.wrap(tableRow).find('[placeholder="Last Name"]').type('Bondar')
            cy.wrap(tableRow).find('.nb-checkmark').click()
        })
        cy.get('tbody tr').first().find('td').then( tableColums =>{
            cy.wrap(tableColums).eq(2).should('contain', 'Artem')
            cy.wrap(tableColums).eq(3).should('contain', 'Bondar')

        })

        //3
        cy.wait(500)

    })

    it("Tooltip", () => {
        cy.visit('/')
        cy.contains('Modal & Overlays').click()
        cy.contains('Tooltip').click() 

        cy.contains('nb-card', 'Colored Tooltip')
            .contains('Default').click()
        cy.get('nb-tooltip').should('contain', 'This is a tooltip')

    })


    it("Dialogue Boxes", () => {
        cy.visit('/')
        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click() 

        //1
        // cy.get('tbody tr').first().find('.nb-trash').click()
        // // not recomended way ->
        // cy.on('window:confirm', (confirm) => {
        //     expect(confirm).to.equal('Are you sure you want to delete?')
        // })

        // Recomended ->
        // const stub = cy.stub()
        // cy.on('window:confirm', stub)
        // cy.get('tbody tr').first().find('.nb-trash').click().then( () =>{
        //     expect(stub.getCall(0)).to.be.calledWith('Are you sure you want to delete?')
        // })

        //3
        // cancel alert
        cy.get('tbody tr').first().find('.nb-trash').click()
        cy.on('window:confirm', () => false)
    })

    it("Assertions", () => {
        // Cypress documentation
        // Moos used
        // BDD Assertions
        // Chai-jQuery

        //Less used
        // TDD Assertions
        // Sinon-chai


        
        
    })
    

})
