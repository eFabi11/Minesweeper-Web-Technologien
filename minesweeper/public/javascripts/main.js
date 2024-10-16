// Funktion zum Aufdecken einer Zelle
function uncoverCell(x, y) {
    fetch(`/uncover/${x}/${y}`, { method: 'GET' })
    .then(response => response.text())
    .then(html => {
        console.log(`Cell at (${x}, ${y}) uncovered`);
        const cell = document.querySelector(`[data-x='${x}'][data-y='${y}']`);
        if (cell) {
            cell.classList.remove('covered');
            cell.classList.add('revealed');
        }
        document.documentElement.innerHTML = html;
    })
    .catch(error => console.error('Error:', error));
}

// Funktion zum Flaggen einer Zelle
function flagCell(x, y) {
    fetch(`/flag/${x}/${y}`, { method: 'GET' })
    .then(response => response.text())
    .then(html => {
        console.log(`Cell at (${x}, ${y}) flagged`);
        const cell = document.querySelector(`[data-x='${x}'][data-y='${y}']`);
        if (cell) {
            cell.classList.remove('covered');
            cell.classList.add('flag');
        }
        document.documentElement.innerHTML = html;
    })
    .catch(error => console.error('Error:', error));
}

// Funktion zum Anzeigen der Bomben, wenn das Spiel vorbei ist
function displayBombs() {
    fetch('/getBombMatrix', { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(bombMatrix => {
            for (let row = 0; row < bombMatrix.length; row++) {
                for (let col = 0; col < bombMatrix[row].length; col++) {
                    if (bombMatrix[row][col] === "*") {
                        const cell = document.querySelector(`[data-x='${col}'][data-y='${row}']`);
                        if (cell) {
                            cell.classList.remove('covered');
                            cell.classList.add('bomb');
                            cell.querySelector('.cell-content').innerHTML = "💣";
                        }
                    }
                }
            }
        })
        .catch(error => console.error('Error fetching bomb matrix:', error));
}