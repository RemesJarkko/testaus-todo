/**
 * @vitest-environment jsdom
 */
/* global document, window, localStorage, Event */
// Gemini auttoi laittamaan vielä tiedoston yläosan jutut auttamaan käyttämään jsdomia testeissä ja muut ettei error lens valita 'document is not defined'
import { beforeEach, describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// 1. Luetaan alkuperäinen koodi merkkijonona - GEMININ Luomus
const scriptCode = fs.readFileSync(
  path.resolve(__dirname, '../public/app.js'),
  'utf8'
);

describe('Todo App - Yksikkötestit', () => {
  beforeEach(() => {
    // 2. Luodaan sovelluksen vaatima HTML-rakenne JSDOM-ympäristöön - GEMININ Luomus
    document.body.innerHTML = `
    <h2 id="form-title">Create Task</h2>
    
    <div class="filters">
      <button id="pill-all">All</button>
      <button id="pill-low">Low</button>
      <button id="pill-medium">Medium</button>
      <button id="pill-high">High</button>
    </div>

    <form id="task-form">
      <input type="hidden" id="task-id">
      <input type="text" id="topic">
      <select id="priority">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select id="status">
        <option value="todo">To do</option>
        <option value="in-progress">In progress</option>
        <option value="blocked">Blocked</option>
        <option value="done">Done</option>
      </select>
      <textarea id="description"></textarea>
      <button id="save-btn" type="submit">Save Task</button>
      <button id="reset-btn" type="button">Reset</button>
    </form>

    <div id="empty-state">No tasks</div>
    <ul id="task-list"></ul>
  `;

    // 3. Tyhjennetään localStorage ja mockataan window-metodit - GEMININ Luomus
    localStorage.clear();
    vi.stubGlobal('scrollTo', vi.fn()); // Estetään errorit window.scrollTo kutsusta

    // 4. Injektoidaan ja suoritetaan sovelluskoodi - GEMININ Luomus
    const scriptEl = document.createElement('script');
    scriptEl.textContent = scriptCode;
    document.body.appendChild(scriptEl);
  });

  it('pitäisi tallentaa lisätty tehtävä localStorageen', () => {
    // Määritetään tehtäväformin formi otsikko ja kuvaus
    const formi = document.getElementById('task-form');
    const otsikko = document.getElementById('topic');
    const kuvaus = document.getElementById('description');
    const tila = document.getElementById('status');
    const prioriteetti = document.getElementById('priority');

    otsikko.value = 'Testi Otsikko';
    kuvaus.value = 'Testi kuvaus';
    tila.value = 'todo';
    prioriteetti.value = 'high';

    // Submittaa formin, joka sitten tallentaa ne localstorageen käyttäes saveTasks funtkiota
    formi.dispatchEvent(new Event('submit'));

    const taskit = JSON.parse(localStorage.getItem('todo_tasks_v1'));
    expect(taskit[0].topic).toBe('Testi Otsikko');
  });

  it('Testataan tehtävien lataaminen muistista', () => {
    const testiTaskit = [
      {
        id: 'id123',
        topic: 'Localstorage taski',
        priority: 'high',
        status: 'todo',
        description: 'Testikuvaus',
        completed: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];
    localStorage.setItem('todo_tasks_v1', JSON.stringify(testiTaskit));

    //Tehdään nämä loadit ja säädöt uudelleen, että localstoragessa on testitehtävä ennen latausta ja ne näkyisi
    document.body.innerHTML = `
    <h2 id="form-title">Create Task</h2>
    
    <div class="filters">
      <button id="pill-all">All</button>
      <button id="pill-low">Low</button>
      <button id="pill-medium">Medium</button>
      <button id="pill-high">High</button>
    </div>

    <form id="task-form">
      <input type="hidden" id="task-id">
      <input type="text" id="topic">
      <select id="priority">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select id="status">
        <option value="todo">To do</option>
        <option value="in-progress">In progress</option>
        <option value="blocked">Blocked</option>
        <option value="done">Done</option>
      </select>
      <textarea id="description"></textarea>
      <button id="save-btn" type="submit">Save Task</button>
      <button id="reset-btn" type="button">Reset</button>
    </form>

    <div id="empty-state">No tasks</div>
    <ul id="task-list"></ul>
  `;
    // 4. Injektoidaan ja suoritetaan sovelluskoodi - GEMININ Luomus
    const scriptEl = document.createElement('script');
    scriptEl.textContent = scriptCode;
    document.body.appendChild(scriptEl);
    const taskList = document.getElementById('task-list');

    expect(taskList.innerHTML).toContain('Localstorage taski');
  });
});
