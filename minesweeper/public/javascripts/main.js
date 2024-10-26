document.addEventListener('DOMContentLoaded', function() {
    // Adds event listeners to each cell
    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', function() {
            uncoverCell(this.dataset.x, this.dataset.y);
        });
        cell.addEventListener('contextmenu', function(e) {
            e.preventDefault(); // Prevent the context menu
            flagCell(this.dataset.x, this.dataset.y);
        });
    });

    const gameState = document.querySelector('#content').classList.contains('Lost') || document.querySelector('#content').classList.contains('Won');

    if (gameState) {
        displayBombs(); // Display bombs if the game is won or lost
    }
});

// Function to uncover a cell
function uncoverCell(x, y) {
    fetch(`/uncover/${x}/${y}`, { method: 'GET' })
    .then(response => response.text())
    .then(xmlString => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "application/xml");
        const cellData = xmlDoc.querySelector('cell');
        if (cellData) {
            updateCell(cellData); // Dynamically update the cell
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error loading data. Please check the server response.');
    });
}

// Function to flag a cell
function flagCell(x, y) {
    const cell = document.querySelector(`[data-x='${x}'][data-y='${y}']`);
    if (cell && !cell.classList.contains('revealed')) {
        fetch(`/flag/${x}/${y}`, { method: 'GET' })
        .then(response => response.text())
        .then(xmlString => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "application/xml");
            const cellData = xmlDoc.querySelector('cell');
            if (cellData) {
                updateCell(cellData); // Dynamically update the cell
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error loading data. Please check the server response.');
        });
    } else {
        console.log(`Cell at (${x}, ${y}) is already uncovered and cannot be flagged.`);
    }
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
function updateCell(cellData) {
    const x = cellData.getAttribute('x');
    const y = cellData.getAttribute('y');
    const state = cellData.getAttribute('state');
    const display = cellData.textContent;

    const cell = document.querySelector(`[data-x='${x}'][data-y='${y}']`);
    if (cell) {
        cell.className = 'cell ' + state; // Update the cell's state

        let cellContent = cell.querySelector('.cell-content');
        if (!cellContent) {
            cellContent = document.createElement('span');
            cellContent.className = 'cell-content';
            cell.appendChild(cellContent);
        }

        cellContent.innerHTML = display;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const restartButton = document.getElementById('restart-button');
    if (restartButton) {
        restartButton.addEventListener('click', function(event) {
            event.preventDefault();
            const lostImage = document.querySelector('#you-lost .lost-image');
            if (lostImage) {
                // Füge die 'fade-out'-Klasse hinzu, um die Animation zu starten
                lostImage.classList.add('fade-out');
                // Warte, bis die Animation beendet ist, bevor umgeleitet wird
                lostImage.addEventListener('animationend', function() {
                    window.location.href = restartButton.getAttribute('href');
                });
            } else {
                // Falls das Bild nicht vorhanden ist, sofort neu starten
                window.location.href = restartButton.getAttribute('href');
            }
        });
    }
});

