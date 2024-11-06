//-------------------- Event-listeners --------------------

var gameBoard = $("#gameBoard");
var gameState = ""

// Function to build the game board
function buildGameBoard() {
  $.ajax({
    type: "POST",
    url: "http://localhost:9000/game/getGameBoard",
    dataType: "json",
    success: function(data) {
      // Clear the game board
      gameBoard.html('');

      // Build the game board dynamically
      var rows = data.rows;
      var cols = data.cols;
      var cells = data.cells;

      var gameBoardHtml = '<div id="gameBoard">';
      for (var i = 0; i < rows; i++) {
        gameBoardHtml += '<div class="game-row">';
        for (var j = 0; j < cols; j++) {
          var cell = cells[i][j];
          gameBoardHtml += '<div class="cell ' + cell.state + '" data-x="' + i + '" data-y="' + j + '"';
          if (cell.state === 'covered') {
            gameBoardHtml += ' onclick="uncoverCell(' + i + ', ' + j + ')" oncontextmenu="flagCell(' + i + ', ' + j + '); return false;">';
          }
          gameBoardHtml += '<span class="cell-content">';
          if (cell.state === 'bomb') {
            gameBoardHtml += '<img src="/assets/Mine.png" alt="Mine" class="mine-icon">';
          } else if (cell.state === 'flag') {
            gameBoardHtml += '&#x1F6A9;';
          } else if (cell.state === 'empty') {
            gameBoardHtml += '&nbsp;';
          } else if (cell.state === 'number') {
            gameBoardHtml += cell.value;
          }
          gameBoardHtml += '</span></div>';
        }
        gameBoardHtml += '</div>';
      }
      gameBoardHtml += '</div>';

      // Add event listeners to each cell
      $('.cell').on('click', function() {
        uncoverCell($(this).data('x'), $(this).data('y'));
      });
      $('.cell').on('contextmenu', function(e) {
        e.preventDefault();
        flagCell($(this).data('x'), $(this).data('y'));
      });

      console.log(gameState)

      // Check the game state
      if (gameState == "Lost" || gameState == "Won") {
        displayBombs();
        if (gameState == "Lost") {
          $('#content').append('<div id="you-lost"><img src="../assets/you_lost.png" alt="You Lost" class="lost-image" /></div>');
        }
      }
      // Update the game board
      gameBoard.html(gameBoardHtml);
    }
  });
}

// Load game button
$(document).ready(function() {
    $('#loadGamePage').on('click', function(event) {
        event.preventDefault();
        $.ajax({
            type: 'GET',
            url: 'http://localhost:9000/game/load',
            dataType: 'json',
            success: function(data) {
                $('#content').html(data.games);
            },
            error: function(xhr, status, error) {
                console.error('Error loading game:', error);
                alert('Error loading game. Please check the server response.');
            }
        });
    });
});

$('#easy').on('click', function() {
    setDifficulty('E');
});

$('#medium').on('click', function() {
    setDifficulty('M');
});

$('#hard').on('click', function() {
    setDifficulty('H');
});

$('#undo').on('click', function(event) {
    event.preventDefault();
    undo();
});

$('#restart').on('click', function(event) {
    event.preventDefault();
    restart();
});

$('#saveGame').on('click', function(event) {
    event.preventDefault();
    saveGame();
});

//-------------------- Functions for the logic of event listeners --------------------

// Function to set the difficulty level
function setDifficulty(level) {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:9000/game/setDiff',
        data: { level: level },
        success: function(data) {
            gameState = data.gameState;
            if (data.success) {
                console.log('Difficulty level set to ' + level);
                buildGameBoard();
            } else {
                console.error('Error setting difficulty level:', data);
                alert('Error setting difficulty level. Please check the server response.');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error setting difficulty level:', error);
            alert('Error setting difficulty level. Please check the server response.');
        }
    });
}

function uncoverCell(x, y) {
  $.ajax({
    type: "POST",
    url: "http://localhost:9000/game/uncover",
    data: { x: x, y: y },
    success: function(data) {
      gameState = data.gameState;
      buildGameBoard();
    }
  });
}

function flagCell(x, y) {
  $.ajax({
    type: "POST",
    url: "http://localhost:9000/game/flag",
    data: { x: x, y: y },
    success: function(data) {
      gameState = data.gameState;
      buildGameBoard();
    }
  });
}

// Function to display bombs when the game is over
function displayBombs() {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:9000/game/getBombMatrix',
    success: function(bombMatrix) {
      $.each(bombMatrix, function(y, row) {
        $.each(row, function(x, cellContent) {
          var cell = $('[data-x="' + x + '"][data-y="' + y + '"]');
          if (cell.length) {
            var cellContentSpan = cell.find('.cell-content');
            if (!cellContentSpan.length) {
              cellContentSpan = $('<span class="cell-content"></span>');
              cell.append(cellContentSpan);
            }
            cellContentSpan.html(cellContent === "*" ? "💣" : cellContent);
            cell.removeClass('covered');
            if (cellContent === "*") {
              cell.addClass('bomb'); // Apply bomb styling
            } else {
              cell.addClass('revealed'); // Apply revealed styling
            }
          }
        });
      });
    },
    error: function(xhr, status, error) {
      console.error('Error fetching bomb matrix:', error);
      alert('Error fetching bomb matrix. Please check the server.');
    }
  });
}

// Function to handle the undo event
function undo() {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:9000/game/undo',
        success: function(data) {
            if (data.success) {
                gameState = data.gameState;
                console.log('Undo successful');
                buildGameBoard();
            } else {
                console.error('Error undoing:', data);
                alert('Error undoing. Please check the server response.');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error undoing:', error);
            alert('Error undoing. Please check the server response.');
        }
    });
}

// Function to handle the restart event
function restart() {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:9000/game/restart',
        success: function(data) {
            if (data.success) {
                gameState = data.gameState;
                console.log('Restart successful');
                buildGameBoard();
            } else {
                console.error('Error restarting:', data);
                alert('Error restarting. Please check the server response.');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error restarting:', error);
            alert('Error restarting. Please check the server response.');
        }
    });
}

// Function to handle the save game event
function saveGame() {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:9000/game/save',
        success: function(data) {
            if (data.success) {
                console.log('Save game successful');
            } else {
                console.error('Error saving game:', data);
                alert('Error saving game. Please check the server response.');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error saving game:', error);
            alert('Error saving game. Please check the server response.');
        }
    });
}

// Initial build of the game board
buildGameBoard();