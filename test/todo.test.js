import { describe, test, expect } from 'vitest';

describe('Testataan todo-sovelluksen tehtävien tallennusfunktioita', function () {
  test('Testataan tallentuuko tieto localStorageen ja löytyykö se sieltä oikein', async function () {
    // Alustetaan tarvittavat DOM-elementit ennen modulin tuontia
    document.body.innerHTML = `
      <form id="task-form">
        <input id="task-id" />
        <input id="topic" />
        <select id="priority"><option value="high">High</option></select>
        <select id="status"><option value="todo">Todo</option></select>
        <textarea id="description"></textarea>
        <button id="save-btn">Save</button>
        <button id="reset-btn">Reset</button>
      </form>
      <div id="form-title"></div>
      <ul id="task-list"></ul>
      <div id="empty-state"></div>
    `;

    // Tuodaan moduuli nyt kun DOM on valmis
    const todo = await import('../public/app.js');

    // Tallennetaan ja luetaan takaisin
    todo.saveTasks([
      {
        id: '1',
        topic: 'Testi Otsikko',
        description: 'Testi Kuvaus',
        priority: 'high',
        status: 'todo',
      },
    ]);
    const tasks = todo.loadTasks();
    expect(tasks[0].topic).toBe('Testi Otsikko');

    localStorage.clear();
  });
});
