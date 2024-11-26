import $ from 'jquery';
import { loadGamesList, loadGame, deleteGame } from '../../public/javascripts/saveGamePage.js'; // Import the functions to test

// Use jsdom to simulate a browser environment
beforeEach(() => {
  document.body.innerHTML = '<div id="content"></div>';  // Set up the basic DOM
});

import $ from 'jquery';  // Import jQuery for testing
import { loadGamesList, loadGame, deleteGame } from './game';  // Import your functions to test

// Setup DOM before each test
beforeEach(() => {
  document.body.innerHTML = '<div id="content"></div>';
});

describe('Game Page Functions', () => {
  // Test for $(document).ready()
  it('calls loadGamesList on document ready', () => {
    const loadGamesListMock = jest.fn();  // Mock the loadGamesList function
    global.loadGamesList = loadGamesListMock;

    $(document).ready(() => {
      loadGamesList();  // Simulate document ready triggering loadGamesList
    });

    expect(loadGamesListMock).toHaveBeenCalled();
  });

  // Test the #start-game-btn click event
  it('#start-game-btn triggers an AJAX POST request when clicked', () => {
    const mockAjax = jest.fn().mockResolvedValue({
      head: '<meta charset="UTF-8">',
      body: '<h1>Game Started</h1>',
    });
    $.ajax = mockAjax;

    // Simulate the button click
    const $button = $('<button id="start-game-btn"></button>');
    $('body').append($button);
    $('#start-game-btn').trigger('click');

    expect(mockAjax).toHaveBeenCalledWith({
      url: 'http://localhost:9000/game',
      type: 'POST',
      dataType: 'json',
      success: expect.any(Function),
      error: expect.any(Function),
    });
  });

  it('updates the DOM after AJAX success', async () => {
    const mockAjax = jest.fn().mockResolvedValue({
      head: '<meta charset="UTF-8">',
      body: '<h1>Game Started</h1>',
    });
    $.ajax = mockAjax;
    document.body.innerHTML = '<head></head><body></body>';

    const $button = $('<button id="start-game-btn"></button>');
    $('body').append($button);
    $('#start-game-btn').trigger('click');

    await mockAjax.mock.results[0].value;

    expect($('head').html()).toBe('<meta charset="UTF-8">');
    expect($('body').html()).toBe('<h1>Game Started</h1>');
  });

  // Test loadGame function
  it('makes an AJAX request to load a game', () => {
    const mockAjax = jest.fn().mockResolvedValue({
      head: '<meta charset="UTF-8">',
      body: '<h1>Game Loaded</h1>',
    });
    $.ajax = mockAjax;

    const gameId = 123;
    loadGame(gameId);

    expect(mockAjax).toHaveBeenCalledWith({
      url: `http://localhost:9000/loadGame/${gameId}`,
      type: 'POST',
      success: expect.any(Function),
      error: expect.any(Function),
    });
  });

  it('updates the DOM after loading game successfully', async () => {
    const mockAjax = jest.fn().mockResolvedValue({
      head: '<meta charset="UTF-8">',
      body: '<h1>Game Loaded</h1>',
    });
    $.ajax = mockAjax;

    document.body.innerHTML = '<head></head><body></body>';
    loadGame(123);
    await mockAjax.mock.results[0].value;

    expect($('head').html()).toBe('<meta charset="UTF-8">');
    expect($('body').html()).toBe('<h1>Game Loaded</h1>');
  });

  // Test deleteGame function
  it('makes an AJAX request to delete a game and reloads the games list', () => {
    const mockDeleteAjax = jest.fn().mockResolvedValue({});
    const mockLoadGamesList = jest.fn();
    $.ajax = mockDeleteAjax;
    global.loadGamesList = mockLoadGamesList;

    const gameId = 123;
    deleteGame(gameId);

    expect(mockDeleteAjax).toHaveBeenCalledWith({
      url: `http://localhost:9000/deleteGame/${gameId}`,
      type: 'POST',
      success: expect.any(Function),
      error: expect.any(Function),
    });

    expect(mockLoadGamesList).toHaveBeenCalled();
  });

  // Test loadGamesList function
  it('makes an AJAX request to get the games list and updates the DOM', () => {
    const mockAjax = jest.fn().mockResolvedValue({
      games: [
        { gameId: 1, fileName: 'Game 1' },
        { gameId: 2, fileName: 'Game 2' },
      ],
    });

    $.ajax = mockAjax;
    const mockGamesListHtml = jest.spyOn(document.getElementById('content'), 'innerHTML', 'set');

    loadGamesList();

    expect(mockAjax).toHaveBeenCalledWith({
      url: 'http://localhost:9000/getGamesList',
      type: 'POST',
      dataType: 'json',
      success: expect.any(Function),
      error: expect.any(Function),
    });

    // Verify the generated HTML after AJAX success
    expect(mockGamesListHtml).toHaveBeenCalledWith(expect.stringContaining('Game 1'));
    expect(mockGamesListHtml).toHaveBeenCalledWith(expect.stringContaining('Game 2'));
  });
});
