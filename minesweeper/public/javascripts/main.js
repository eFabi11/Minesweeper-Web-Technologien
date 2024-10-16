// Funktion zum Aufdecken einer Zelle
function uncoverCell(x, y) {
    fetch(`/uncover/${x}/${y}`, { method: 'GET' })
    .then(response => response.text())
    .then(html => {
        console.log(`Cell at (${x}, ${y}) uncovered`);
        const cell = document.querySelector(`[data-x='${x}'][data-y='${y}']`);
        if (cell) {
            cell.classList.remove('covered'); // Entferne "covered", um den Hintergrund zu ändern
            cell.classList.add('revealed'); // Füge "revealed" hinzu für geöffnete Zellen
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
            cell.classList.remove('covered'); // Entferne "covered", wenn sie markiert wird
            cell.classList.add('flag'); // Füge "flag" hinzu für markierte Zellen
        }
        document.documentElement.innerHTML = html;
    })
    .catch(error => console.error('Error:', error));
}
