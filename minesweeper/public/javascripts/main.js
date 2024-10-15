document.addEventListener("DOMContentLoaded", function() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('click', function() {
            uncoverCell(this.getAttribute('data-x'), this.getAttribute('data-y'));
        });
        cell.addEventListener('contextmenu', function(e) {
            e.preventDefault(); // Verhindert das Kontextmenü
            flagCell(this.getAttribute('data-x'), this.getAttribute('data-y'));
        });
    });
});

function uncoverCell(x, y) {
    fetch(`/uncover/${x}/${y}`, { method: 'GET' })
    .then(response => response.json())
    .then(data => {
        // Update the board or part of the board dynamically
        console.log('Cell uncovered:', data);
        updateBoard(data); // Eine Funktion, die das Board mit neuen Daten aktualisiert
    })
    .catch(error => console.error('Error:', error));
}

function flagCell(x, y) {
    fetch(`/flag/${x}/${y}`, { method: 'GET' })
    .then(response => response.json())
    .then(data => {
        // Update the board or part of the board dynamically
        console.log('Cell flagged:', data);
        updateBoard(data); // Eine Funktion, die das Board mit neuen Daten aktualisiert
    })
    .catch(error => console.error('Error:', error));
}

function updateBoard(data) {
    // Implementiere Logik, um das Board dynamisch auf Basis der neuen Daten zu aktualisieren
    // Nutze DOM-Manipulation, um Zellen zu aktualisieren, ohne die Seite neu zu laden
}
