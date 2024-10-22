// Funktion zum Aufdecken einer Zelle
function uncoverCell(x, y) {
    fetch(`/uncover/${x}/${y}`, { method: 'GET' })
    .then(response => response.text())
    .then(html => {
        console.log(`Cell at (${x}, ${y}) uncovered`);
        const cell = document.querySelector(`[data-x='${x}'][data-y='${y}']`);
        if (cell) {
            cell.classList.remove('covered', 'flag'); // Entferne 'covered' und 'flag'
            cell.classList.add('revealed'); // Füge 'revealed' hinzu
        }
        document.documentElement.innerHTML = html;
    })
    .catch(error => console.error('Error:', error));
}

// Funktion zum Flaggen einer Zelle
function flagCell(x, y) {
    const cell = document.querySelector(`[data-x='${x}'][data-y='${y}']`);
    
    // Stelle sicher, dass die Zelle nicht aufgedeckt ist, bevor sie geflaggt werden kann
    if (cell && !cell.classList.contains('revealed')) {
        fetch(`/flag/${x}/${y}`, { method: 'GET' })
        .then(response => response.text())
        .then(html => {
            console.log(`Cell at (${x}, ${y}) flagged`);
            if (cell) {
                cell.classList.toggle('flag'); // Toggle 'flag' Klasse ein/aus
                cell.classList.remove('covered'); // Entferne 'covered'
            }
            document.documentElement.innerHTML = html;
        })
        .catch(error => console.error('Error:', error));
    } else {
        console.log(`Cell at (${x}, ${y}) is already uncovered and cannot be flagged.`);
    }
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
                            cell.classList.remove('covered', 'flag'); // Entferne 'covered' und 'flag'
                            cell.classList.add('bomb'); // Füge 'bomb' hinzu
                            cell.querySelector('.cell-content').innerHTML = "💣";
                        }
                    }
                }
            }
        })
        .catch(error => console.error('Error fetching bomb matrix:', error));
}
