document.addEventListener("DOMContentLoaded", function() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('click', function() {
            uncoverCell(this.getAttribute('data-x'), this.getAttribute('data-y'));
        });
        cell.addEventListener('contextmenu', function(e) {
            e.preventDefault(); // Verhindere das Kontextmenü des Browsers
            flagCell(this.getAttribute('data-x'), this.getAttribute('data-y'));
        });
    });
});

function uncoverCell(x, y) {
    window.location.href = '/uncover/' + x + '/' + y;
}

function flagCell(x, y) {
    window.location.href = '/flag/' + x + '/' + y;
}
