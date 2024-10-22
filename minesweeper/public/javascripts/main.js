document.addEventListener('DOMContentLoaded', function() {
    // Fügt Event-Listener zu jedem Zellen-Element hinzu
    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', function() {
            uncoverCell(this.dataset.x, this.dataset.y);
        });
        cell.addEventListener('contextmenu', function(e) {
            e.preventDefault(); // Verhindert das Kontextmenü
            flagCell(this.dataset.x, this.dataset.y);
        });
    });
});

// Funktion zum Aufdecken einer Zelle
function uncoverCell(x, y) {
    fetch(`/uncover/${x}/${y}`, { method: 'GET' })
    .then(response => response.text())
    .then(xmlString => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "application/xml");
        const cellData = xmlDoc.querySelector('cell');
        if (cellData) {
            updateCell(cellData); // Zelle wird dynamisch aktualisiert
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Fehler beim Laden der Daten. Bitte überprüfe die Serverantwort.');
    });
}

// Funktion zum Flaggen einer Zelle
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
                updateCell(cellData); // Zelle wird dynamisch aktualisiert
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Fehler beim Laden der Daten. Bitte überprüfe die Serverantwort.');
        });
    } else {
        console.log(`Cell at (${x}, ${y}) is already uncovered and cannot be flagged.`);
    }
}

// Hilfsfunktion zum Aktualisieren der Zellen-Daten im DOM
function updateCell(cellData) {
    const x = cellData.getAttribute('x');
    const y = cellData.getAttribute('y');
    const state = cellData.getAttribute('state');
    const display = cellData.textContent;

    const cell = document.querySelector(`[data-x='${x}'][data-y='${y}']`);
    if (cell) {
        cell.className = 'cell ' + state; // Aktualisiere den Zustand der Zelle
        cell.innerHTML = display; // Aktualisiere den Inhalt der Zelle (Nummer, Bombe, Leerzeichen)
    }
}
