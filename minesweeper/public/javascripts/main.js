//-------------------- Event-listeners --------------------

$(document).ready(function() {
    // Adds event listeners to each cell
    $('.cell').on('click', function() {
        uncoverCell($(this).data('x'), $(this).data('y'));
    });
    $('.cell').on('contextmenu', function(e) {
        e.preventDefault();
        flagCell($(this).data('x'), $(this).data('y'));
    });

    const gameState = $('#content').hasClass('Lost') || $('#content').hasClass('Won');

    if (gameState) {
        displayBombs();
    }
});

$(document).ready(function() {
    const restartButton = $('#restart-button');
    if (restartButton.length > 0) {
        restartButton.on('click', function(event) {
            event.preventDefault();
            const lostImage = $('#you-lost .lost-image');
            if (lostImage.length > 0) {
                lostImage.addClass('fade-out');
                lostImage.on('animationend', function() {
                    window.location.href = restartButton.attr('href');
                });
            } else {
                window.location.href = restartButton.attr('href');
            }
        });
    }
});

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
            if (data.success) {
                console.log('Difficulty level set to ' + level);
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

// Function to flag a cell
function flagCell(x, y) {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:9000/game/flag',
        data: { x: x, y: y },
        success: function(data) {
            if (data.success) {
                updateCell(data);
            } else {
                console.error('Error flagging cell:', data);
                alert('Error flagging cell. Please check the server response.');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error flagging cell:', error);
            alert('Error flagging cell. Please check the server response.');
        }
    });
}

// Function to uncover a cell
function uncoverCell(x, y) {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:9000/game/uncover',
        data: { x: x, y: y },
        success: function(data) {
            if (data.success) {
                updateCell(data);
            } else {
                console.error('Error uncovering cell:', data);
                alert('Error uncovering cell. Please check the server response.');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error uncovering cell:', error);
            alert('Error uncovering cell. Please check the server response.');
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

// Helper function to update a cell in the DOM
function updateCell(x, y) {
    $.ajax({ function(data) {
            const cellData = $(data).find('cell');
            const state = cellData.attr('state');
            const display = cellData.text();

            const cell = $(`[data-x='${x}'][data-y='${y}']`);
            if (cell.length > 0) {
                cell.addClass(state); // Update the cell's state

                let cellContent = cell.find('.cell-content');
                if (cellContent.length === 0) {
                    cellContent = $('<span class="cell-content"></span>');
                    cell.append(cellContent);
                }
                cellContent.html(display);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error updating cell:', error);
            alert('Error updating cell. Please check the server response.');
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
                console.log('Undo successful');
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
                console.log('Restart successful');
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