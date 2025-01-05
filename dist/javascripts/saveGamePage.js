$(document).ready(function() {
    loadGamesList();
});

$(document).ready(function() {
    $('#start-game-btn').click(function() {
        $.ajax({
            url: 'http://localhost:9000/game',
            type: 'POST',
            dataType: 'json',
            success: function(response) {
                $('head').html(response.head);
                $('body').html(response.body);
            },
            error: function(xhr, status, error) {
                console.log('Error:', error);
                alert('Something went wrong! Please try again.');
            }
        });
    });
});

function loadGame(gameId) {
    $.ajax({
        url: 'http://localhost:9000/loadGame/' + gameId,
        type: 'POST',
        success: function(response) {
            $('head').html(response.head);
            $('body').html(response.body);
        },
        error: function(xhr, status, error) {
            alert('Error loading game: ' + error);
        }
    });
}

function deleteGame(gameId) {
    $.ajax({
        url: 'http://localhost:9000/deleteGame/' + gameId,
        type: 'POST',
        success: function(response) {
            loadGamesList();
        },
        error: function(xhr, status, error) {
            alert('Error deleting game: ' + error);
        }
    });
}

function loadGamesList() {
    $.ajax({
        url: 'http://localhost:9000/getGamesList',
        type: 'POST',
        dataType: 'json',
        success: function(response) {

            let gamesListHtml = '<ul class="list-group">';

            response.games.forEach(function(game) {
                gamesListHtml += `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <span class="game-name">Game: ${game.fileName}</span>
                        <div>
                            <button class="btn btn-info btn-sm mr-2 load-game" data-game-id="${game.gameId}">Load</button>
                            <button class="btn btn-danger btn-sm delete-game" data-game-id="${game.gameId}">Delete</button>
                        </div>
                    </li>`;
            });

            gamesListHtml += '</ul>';

            $('#content').html(gamesListHtml);

            $('#content').css('height', 'auto');

            $('.load-game').on('click', function() {
                const gameId = $(this).data('game-id');
                loadGame(gameId);
            });

            $('.delete-game').on('click', function() {
                const gameId = $(this).data('game-id');
                deleteGame(gameId);
            });
        },
        error: function(xhr, status, error) {
            console.error('Error fetching games list:', error);
            alert('Error loading games list. Please try again.');
        }
    });
}

