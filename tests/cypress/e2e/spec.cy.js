/// <reference types="Cypress" />
/* global cy, Cypress, beforeEach, describe, it, expect */

// describe - Mocha.js:n toiminto, joka kuvastaa testijoukkoa
describe('Testataan todo-sovelluksen luonti, muokkaus, tilan vaihto ja poisto ominaisuudet', () => {
  beforeEach(() => {
    cy.visit('/');
    // Clear localStorage before each test for isolation
    cy.clearLocalStorage();
  });
  it('Testataan tehtävän luonti, tallennus ja localstoragen pysyvyys', () => {
    // Kirjoitetaan otsikkoon: Testi otsikko
    cy.get('#topic')
      .type('Testi otsikko')
      .should('have.value', 'Testi otsikko');
    // Valitaan prioriteetiksi: high
    cy.get('#priority').select('high').should('have.value', 'high');

    // Valitaan tilaksi: todo
    cy.get('#status').select('todo').should('have.value', 'todo');

    // Kirjoitetaan kuvaukseen: Testi kuvaus
    cy.get('#description')
      .type('Testi kuvaus')
      .should('have.value', 'Testi kuvaus');
    // Painetaan tallenna
    cy.get('#save-btn').click();

    // Tarkistetaan että on näkyvissä
    cy.get('#task-list').should('be.visible');
    cy.get('#task-list .task').should('have.length', 1);

    // Luodaan toinen taski ja tarkistetaan listan pituus
    cy.get('#topic').type('Toinen taski').should('have.value', 'Toinen taski');
    cy.get('#description').type('kuvaus').should('have.value', 'kuvaus');
    cy.get('#save-btn').click();

    cy.get('#task-list .task').should('have.length', 2);

    //Etsitään luotu tehtävä ja tarkistetaan tiedot
    cy.get('#task-list .task')
      .first()
      .within(() => {
        cy.get('.title').should('have.text', 'Testi otsikko');
        cy.get('.desc').should('have.text', 'Testi kuvaus');
        cy.get('.prio-high').should('contain', 'High');
        cy.get('.badge').should('contain', 'To do');
      });

    //Tarkistetaan onko localstoragessa
    cy.window().then((win) => {
      const taskit = JSON.parse(win.localStorage.getItem('todo_tasks_v1'));
      expect(taskit).to.have.length(2);
      expect(taskit[0].topic).to.equal('Testi otsikko');
      expect(taskit[0].description).to.equal('Testi kuvaus');
      expect(taskit[0].priority).to.equal('high');
      expect(taskit[0].status).to.equal('todo');
      expect(taskit[0].completed).to.be.false;
    });

    //Ladataan sivu uudelleen ja tarkistetaan säilyykö ja näkyykö tiedot vielä
    cy.reload();

    //Tarkistetaan onko localstoragessa
    cy.window().then((win) => {
      const taskit = JSON.parse(win.localStorage.getItem('todo_tasks_v1'));
      expect(taskit).to.have.length(2);
      expect(taskit[0].topic).to.equal('Testi otsikko');
      expect(taskit[0].description).to.equal('Testi kuvaus');
      expect(taskit[0].priority).to.equal('high');
      expect(taskit[0].status).to.equal('todo');
      expect(taskit[0].completed).to.be.false;
    });
    // Katsotaan onko ensimmäinen taski näkyvissä
    cy.get('#task-list .task').first().should('be.visible');
  });

  it('Testataan tehtävän poistaminen', function () {
    // Luodaan toinen taski ja tarkistetaan listan pituus
    cy.get('#topic')
      .type('Poistettava taski')
      .should('have.value', 'Poistettava taski');
    cy.get('#description').type('kuvaus').should('have.value', 'kuvaus');
    cy.get('#save-btn').click();

    // Tarkistetaan olemassa olo
    cy.get('#task-list .task .title').should('have.text', 'Poistettava taski');

    // Painetaan delete-nappia
    cy.get('#task-list .task')
      .first()
      .within(() => {
        cy.get('button[data-action=delete]').click();
      });
    //Tarkistetaan ettei ole olemassa
    cy.get('#task-list .task').should('not.exist');

    // Tarkistetaan onko myös poistunut localStoragesta
    cy.window().then((win) => {
      const taskit = JSON.parse(win.localStorage.getItem('todo_tasks_v1'));
      expect(taskit).to.have.length(0);
    });
  });

  it('Testataan tehtävän päivittäminen', function () {
    // Luodaan poistettava taski
    cy.get('#topic')
      .type('Päivitettävä taski')
      .should('have.value', 'Päivitettävä taski');
    cy.get('#description')
      .type('LISÄÄ MYÖHEMMIN')
      .should('have.value', 'LISÄÄ MYÖHEMMIN');
    cy.get('#save-btn').click();

    // tarkistetaan että on olemassa

    cy.get('#task-list .task')
      .first()
      .within(() => {
        cy.get('.title').should('have.text', 'Päivitettävä taski');
      });
    // Päivitetään tehtävän kuvaus ja tila
    cy.get('#task-list .task')
      .first()
      .within(() => {
        cy.get('button[data-action=edit]').click();
      });

    // Tarkistetaan että tehtävä on muokattavana
    cy.get('#form-title').should('have.text', 'Edit Task');
    cy.get('#topic').should('have.value', 'Päivitettävä taski');
    cy.get('#status')
      .should('have.value', 'todo')
      .select('in-progress')
      .should('have.value', 'in-progress');
    cy.get('#description')
      .should('have.value', 'LISÄÄ MYÖHEMMIN')
      .clear()
      .type('Tehtävä päivitetty')
      .should('have.value', 'Tehtävä päivitetty');
    cy.get('#save-btn').click();

    // Tarkistetaan päivittyikö tieto
    cy.get('#task-list .task')
      .first()
      .within(() => {
        cy.get('.desc').should('have.text', 'Tehtävä päivitetty'),
          cy.get('.badge').should('contain', 'In progress');
      });
  });

  it('Testataan otsikon maksimi ja minimi syötteitä sekä reset painikkeen toiminta', function () {
    // Kokeillaan antaako tallentaa tehtävän ilman otsikkoa
    cy.get('#description')
      .type('Ei otsikkoa')
      .should('have.value', 'Ei otsikkoa');
    cy.get('#save-btn').click();

    //Tarkistetaan ettei tehtävää luotu
    cy.get('#task-list .task').should('have.length', 0);

    // Testataan Reset-painike
    cy.get('#reset-btn').click();
    cy.get('#description').should('have.value', '');

    // Testataan otsikon maksimi (120 merkkiä)
    let syote = 'Pitkä'.repeat(25);
    syote += 'Loppu';
    cy.get('#topic').type(syote).should('not.have.value', syote);
    cy.get('#save-btn').click();

    //Tarkistetaan vielä ettei tekstijono ole sana
    cy.get('#task-list .task')
      .first()
      .within(() => {
        cy.get('.title')
          .should('contain', 'Pitkä')
          .should('not.contain', 'Loppu');
      });
  });
});
