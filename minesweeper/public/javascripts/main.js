$(document).ready(function() {
    // Adds event listeners to each cell
    $('.cell').on('click', function() {
        uncoverCell($(this).data('x'), $(this).data('y'));
    });
    $('.cell').on('contextmenu', function(e) {
        e.preventDefault(); // Prevent the context menu
        flagCell($(this).data('x'), $(this).data('y'));
    });

    const gameState = $('#content').hasClass('Lost') || $('#content').hasClass('Won');

    if (gameState) {
        displayBombs(); // Display bombs if the game is won or lost
    }
});

$(document).ready(function() {
    const restartButton = $('#restart-button');
    if (restartButton.length > 0) {
        restartButton.on('click', function(event) {
            event.preventDefault();
            const lostImage = $('#you-lost .lost-image');
            if (lostImage.length > 0) {
                // Füge die 'fade-out'-Klasse hinzu, um die Animation zu starten
                lostImage.addClass('fade-out');
                // Warte, bis die Animation beendet ist, bevor umgeleitet wird
                lostImage.on('animationend', function() {
                    window.location.href = restartButton.attr('href');
                });
            } else {
                // Falls das Bild nicht vorhanden ist, sofort neu starten
                window.location.href = restartButton.attr('href');
            }
        });
    }
});

// Function to flag a cell
function flagCell(x, y) {
    $.ajax({
        type: 'POST',
        url: '/game/flag',
        data: { x: x, y: y },
        dataType: 'json',
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
        url: '/game/uncover',
        data: { x: x, y: y },
        dataType: 'json',
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
    fetch('/getBombMatrix', { method: 'GET' })
    .then(response => response.json())
    .then(bombMatrix => {
        bombMatrix.forEach((row, y) => {
            row.forEach((cellContent, x) => {
                const cell = document.querySelector(`[data-x='${x}'][data-y='${y}']`);
                if (cell) {
                    let cellContentSpan = cell.querySelector('.cell-content');
                    if (!cellContentSpan) {
                        cellContentSpan = document.createElement('span');
                        cellContentSpan.className = 'cell-content';
                        cell.appendChild(cellContentSpan);
                    }

                    // Update the cell's content based on the bomb matrix
                    cellContentSpan.innerHTML = cellContent === "*" ? "💣" : cellContent;
                    cell.classList.remove('covered');
                    if (cellContent === "*") {
                        cell.classList.add('bomb'); // Apply bomb styling
                    } else {
                        cell.classList.add('revealed'); // Apply revealed styling
                    }
                }
            });
        });
    })
    .catch(error => {
        console.error('Error fetching bomb matrix:', error);
        alert('Error fetching bomb matrix. Please check the server.');
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