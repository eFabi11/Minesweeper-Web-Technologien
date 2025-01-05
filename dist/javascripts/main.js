//-------------------- Global Variables --------------------

var gameBoard = $("#gameBoard");
var gameState = "";
var coopSocket;
var gameId;
var isCoopMode = false;
var vsSocket;
var playerId;
var isFirstPlayer = false;
var players = [];

//-------------------- Event Listeners --------------------

// Load game button
$('#loadGamePage').on('click', function(event) {
    event.preventDefault();
    console.log("Load game button clicked");
    $.ajax({
        type: 'POST',
        url: 'http://localhost:9000/game/load',
        dataType: 'json',
        success: function(data) {
            console.log("Game page loaded successfully");
            $('head').html(data.head);
            $('body').html(data.body);
        },
        error: function(xhr, status, error) {
            console.error('Error loading game page:', error);
            alert('Error loading game page. Please check the server response.');
        }
    });
});

$(document).ready(function() {
    console.log("Document ready");
    $('#logo').click(function() {
        console.log("Logo clicked");
        $.ajax({
            url: 'http://localhost:9000/',
            type: 'GET',
            success: function(response) {
                console.log("Navigated to homepage");
                window.location.href = 'http://localhost:9000';
            },
            error: function(xhr, status, error) {
                console.log('Error:', error);
                alert('Something went wrong! Please try again.');
            }
        });
    });

    // Hide difficulty and controls until a mode is selected
    $('#difficulty').hide();
    $('#controls').hide();

    // Mode selection buttons
    $('#singleMode').on('click', function() {
        console.log("Single mode selected");
        isCoopMode = false;
        $('#modeSelection').hide();
        $('#difficulty').show();
        $('#controls').show();
        buildGameBoard();
    });

    $('#coopMode').off('click').on('click', function() {
        console.log("Coop mode selected");
        isCoopMode = true;
        gameId = prompt("Enter a game ID to join or create a new game:", "game_" + Date.now());
        console.log("Game ID entered:", gameId);
        connectCoopWebSocket();
        $('#modeSelection').hide();
        $('#difficulty').show();
        $('#controls').show();
    });

    // Difficulty buttons
    $('#easy').off('click').on('click', function () {
        console.log("Easy difficulty selected");
        setDifficulty('E');
    });
    
    $('#medium').off('click').on('click', function () {
        console.log("Medium difficulty selected");
        setDifficulty('M');
    });
    
    $('#hard').off('click').on('click', function () {
        console.log("Hard difficulty selected");
        setDifficulty('H');
    });

    // Control buttons
    $('#undo').on('click', function(event) {
        event.preventDefault();
        console.log("Undo button clicked");
        undo();
    });

    $('#restart').on('click', function(event) {
        event.preventDefault();
        console.log("Restart button clicked");
        restart();
    });

    $('#saveGame').on('click', function(event) {
        event.preventDefault();
        console.log("Save game button clicked");
        saveGame();
    });

    $('#vsMode').off('click').on('click', function () {
        console.log("Versus mode selected");
        isCoopMode = false; // Stellen Sie sicher, dass isCoopMode auf false gesetzt ist
        gameId = prompt("Enter a game ID to join or create a new game:", "vs_" + Date.now());
        playerId = prompt("Enter your player name:", "Player_" + Date.now());
        console.log("Game ID entered:", gameId);
        console.log("Player ID entered:", playerId);
    
        connectVsWebSocket();
        $('#modeSelection').hide();
        $('#difficulty').hide(); // Wir verstecken die Schwierigkeitsbuttons zunächst
        $('#controls').show();
    });
    
    
    
});

//-------------------- Functions --------------------

// Function to connect to the cooperative WebSocket
function connectCoopWebSocket() {
    var socketUrl = 'ws://' + window.location.host + '/coop/ws/' + gameId;
    console.log("Connecting to WebSocket at URL:", socketUrl);
    coopSocket = new WebSocket(socketUrl);

    coopSocket.onopen = function(event) {
        console.log("Coop WebSocket connected.");
    };

    coopSocket.onmessage = function(event) {
        console.log("Message received from WebSocket:", event.data);
        var data = JSON.parse(event.data);
        // Handle received data
        if (data.gameState) {
            console.log("Game state received:", data.gameState);
            updateGameState(data);
        }
    };

    coopSocket.onclose = function(event) {
        console.log("Coop WebSocket closed.");
    };

    coopSocket.onerror = function(error) {
        console.error("WebSocket error:", error);
    };
}

// Function to send actions to the server in coop mode
function sendCoopAction(action, data) {
    console.log("Sending action via WebSocket:", action, data);
    if (coopSocket && coopSocket.readyState === WebSocket.OPEN) {
        var message = {
            action: action,
            data: data
        };
        coopSocket.send(JSON.stringify(message));
        console.log("Action sent:", message);
    } else {
        console.warn("WebSocket is not open. Ready state:", coopSocket.readyState);
    }
}

// Function to update the game state based on received data
function updateGameState(gameData) {
    console.log("Updating game state");
    gameState = gameData.gameState;
    buildGameBoardFromData(gameData);
}

// Function to build the game board from data
function buildGameBoardFromData(data) {
    console.log("Building game board from data");
    // Clear the game board
    gameBoard.html('');

    // Build the game board dynamically using data from the server
    var rows = data.rows;
    var cols = data.cols;
    var cells = data.cells;

    var gameBoardHtml = '<div id="gameBoard">';
    for (var i = 0; i < rows; i++) {
        gameBoardHtml += '<div class="game-row">';
        for (var j = 0; j < cols; j++) {
            var cell = cells[i][j];
            gameBoardHtml += '<div class="cell ' + cell.state + '" data-x="' + i + '" data-y="' + j + '"';
            if (cell.state === 'covered') {
                gameBoardHtml += ' onclick="uncoverCell(' + i + ', ' + j + ')" oncontextmenu="flagCell(' + i + ', ' + j + '); return false;">';
            } else {
                gameBoardHtml += '>';
            }
            gameBoardHtml += '<span class="cell-content">';
            if (cell.state === 'bomb') {
                gameBoardHtml += '<img src="/assets/Mine.png" alt="Mine" class="mine-icon">';
            } else if (cell.state === 'flag') {
                gameBoardHtml += '&#x1F6A9;';
            } else if (cell.state === 'empty') {
                gameBoardHtml += '&nbsp;';
            } else if (cell.state === 'number') {
                gameBoardHtml += cell.value;
            }
            gameBoardHtml += '</span></div>';
        }
        gameBoardHtml += '</div>';
    }
    gameBoardHtml += '</div>';

    // Update the game board
    gameBoard.html(gameBoardHtml);

    // Add event listeners to each cell
    $(`.cell[data-player="${playerId}"]`).off('click').on('click', function () {
        const x = $(this).data('x');
        const y = $(this).data('y');
        console.log("Cell clicked at:", x, y);
        uncoverCell(x, y);
    });
    
    $(`.cell[data-player="${playerId}"]`).off('contextmenu').on('contextmenu', function (e) {
        e.preventDefault();
        const x = $(this).data('x');
        const y = $(this).data('y');
        console.log("Cell right-clicked at:", x, y);
        flagCell(x, y);
    });

    // Check the game state
    if (gameState == "Lost" || gameState == "Won") {
        console.log("Game over. State:", gameState);
        displayBombs();
        if (gameState == "Lost") {
            gameBoardHtml += '<div id="you-lost"><img src="../assets/you_lost.png" alt="You Lost" class="lost-image" /></div>';
        }
    }
}

// Function to build the game board (Single Player Mode)
function buildGameBoard() {
    console.log("Building game board in single player mode");
    if (isCoopMode) {
        console.log("In coop mode, not building game board here");
        // In coop mode, we wait for updates from the server
        // Do nothing here
    } else {
        $.ajax({
            type: "POST",
            url: "http://localhost:9000/game/getGameBoard",
            dataType: "json",
            success: function(data) {
                console.log("Game board data received from server");
                // Build the game board as before
                buildGameBoardFromData(data);
            },
            error: function(xhr, status, error) {
                console.error("Error fetching game board:", error);
            }
        });
    }
}

// Function to set the difficulty level
function setDifficulty(level) {
    console.log("Setting difficulty level to:", level);
    if (isCoopMode) {
        // Koop-Modus
        sendCoopAction("setDifficulty", { level: level });
    } else if (vsSocket && vsSocket.readyState === WebSocket.OPEN && isFirstPlayer) {
        // Versus-Modus und erster Spieler
        sendVsAction("setDifficulty", { level: level });
        $('#difficulty').hide(); // Verberge die Schwierigkeitsbuttons nach Auswahl
    } else if (!vsSocket && !isCoopMode) {
        // Einzelspielermodus
        $.ajax({
            type: "POST",
            url: "http://localhost:9000/game/setDifficulty",
            data: { level: level },
            success: function(data) {
                console.log("Difficulty set successfully");
                buildGameBoard();
            },
            error: function(xhr, status, error) {
                console.error('Error setting difficulty:', error);
                alert('Fehler beim Festlegen des Schwierigkeitsgrads. Bitte versuchen Sie es erneut.');
            }
        });
    } else {
        alert("Nur der erste Spieler kann den Schwierigkeitsgrad festlegen.");
    }
}

function uncoverCell(x, y) {
    console.log("Uncover cell at:", x, y);
    if (isCoopMode) {
        sendCoopAction("uncover", { x: x, y: y });
    } else if (vsSocket) {
        sendVsAction("uncover", { x: x, y: y });
    } else {
        $.ajax({
            type: "POST",
            url: "http://localhost:9000/game/uncover",
            data: { x: x, y: y },
            success: function(data) {
                console.log("Cell uncovered successfully");
                gameState = data.gameState;
                buildGameBoard();
            },
            error: function(xhr, status, error) {
                console.error('Error uncovering cell:', error);
                alert('Error occurred while performing the action.');
            }
        });
    }
}

function flagCell(x, y) {
    console.log("Flag cell at:", x, y);
    if (isCoopMode) {
        sendCoopAction("flag", { x: x, y: y });
    } else if (vsSocket) {
        sendVsAction("flag", { x: x, y: y });
    } else {
        $.ajax({
            type: "POST",
            url: "http://localhost:9000/game/flag",
            data: { x: x, y: y },
            success: function(data) {
                console.log("Cell flagged successfully");
                gameState = data.gameState;
                buildGameBoard();
            },
            error: function(xhr, status, error) {
                console.error('Error flagging cell:', error);
                alert('Error occurred while performing the action.');
            }
        });
    }
}

// Function to display bombs when the game is over
function displayBombs() {
    console.log("Displaying bombs");
    if (isCoopMode) {
        // In coop mode, we don't need to fetch the bomb matrix separately
        // The server sends the entire game state
    } else {
        $.ajax({
            type: 'POST',
            url: 'http://localhost:9000/game/getBombMatrix',
            success: function(bombMatrix) {
                console.log("Bomb matrix received from server");
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
}

// Function to handle the undo event
function undo() {
    console.log("Undo action triggered");
    if (isCoopMode) {
        sendCoopAction("undo", {});
    } else {
        $.ajax({
            type: 'POST',
            url: 'http://localhost:9000/game/undo',
            success: function(data) {
                console.log('Undo successful');
                gameState = data.gameState;
                buildGameBoard();
            },
            error: function(xhr, status, error) {
                console.error('Error undoing:', error);
                alert('Error undoing. Please check the server response.');
            }
        });
    }
}

// Function to handle the restart event
function restart() {
    console.log("Restart action triggered");
    if (isCoopMode) {
        sendCoopAction("restart", {});
    } else {
        $.ajax({
            type: 'POST',
            url: 'http://localhost:9000/game/restart',
            success: function(data) {
                console.log('Restart successful');
                gameState = data.gameState;
                buildGameBoard();
            },
            error: function(xhr, status, error) {
                console.error('Error restarting:', error);
                alert('Error restarting. Please check the server response.');
            }
        });
    }
}

// Function to handle the save game event
function saveGame() {
    console.log("Save game action triggered");
    if (isCoopMode) {
        alert('Saving is not supported in cooperative mode.');
    } else {
        $.ajax({
            type: 'POST',
            url: 'http://localhost:9000/game/save',
            success: function(data) {
                console.log('Save game successful');
            },
            error: function(xhr, status, error) {
                console.error('Error saving game:', error);
            }
        });
    }
}

function updateVoteStatus(votes) {
    console.log("Votes received:", votes);
    $('#votesEasy').text(votes["E"] || 0);
    $('#votesMedium').text(votes["M"] || 0);
    $('#votesHard').text(votes["H"] || 0);
    $('#voteSummary').show();
}

function updateVoteSummary(difficultyCounts) {
    console.log("Updating vote summary:", difficultyCounts);

    // Aktualisieren der Stimmenanzahl
    $('#votesEasy').text(difficultyCounts.Easy || 0);
    $('#votesMedium').text(difficultyCounts.Medium || 0);
    $('#votesHard').text(difficultyCounts.Hard || 0);

    // Sicherstellen, dass die Anzeige sichtbar ist
    $('#voteSummary').show();
}

function renderPlayerList(players) {
    var playersContainer = $('#playersContainer');
    playersContainer.empty();
    players.forEach(function(player) {
        playersContainer.append('<div class="player-item">' + player + '</div>');
    });
    playersContainer.append('<div class="player-count">Spieler: ' + players.length + ' / 4</div>');
}

function connectVsWebSocket() {
    if (vsSocket && vsSocket.readyState === WebSocket.OPEN) {
        console.log("Closing existing WebSocket connection...");
        vsSocket.close();
    }

    var socketUrl = 'ws://' + window.location.host + '/vs/ws/' + gameId + '/' + playerId;
    console.log("Connecting to Versus WebSocket at URL:", socketUrl);

    vsSocket = new WebSocket(socketUrl);

    vsSocket.onopen = function () {
        console.log("Versus WebSocket connected.");
    };

    vsSocket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log("Received message:", data);

    switch (data.action) {
        case "setDifficulty":
            // Aktualisiere die Spielerliste und isFirstPlayer
            if (data.players) {
                players = data.players;
                isFirstPlayer = (playerId === players[0]);
                console.log("Spielerliste aktualisiert in 'setDifficulty':", players);
                console.log("isFirstPlayer:", isFirstPlayer);
            }
            if (isFirstPlayer) {
                $('#difficulty').show(); // Zeige die Schwierigkeitsbuttons für den ersten Spieler
            } else {
                $('#difficulty').hide(); // Verberge die Schwierigkeitsbuttons für andere Spieler
                console.log("Nicht der erste Spieler, 'setDifficulty' wird ignoriert.");
            }
            break;

            case "updatePlayers":
                players = data.players;
                isFirstPlayer = (playerId === players[0]); // Bestimmt, ob der aktuelle Spieler der erste Spieler ist
                console.log("Spielerliste aktualisiert in 'updatePlayers':", players);
                console.log("isFirstPlayer:", isFirstPlayer);
                renderPlayerList(players);
                break;

            case "startGame":
                startGameWithDifficulty(data.difficulty);
                break;

            case "gameState":
                updateVsGameState(data);
                break;

            case "error":
                alert(data.message || "Es ist ein Fehler aufgetreten.");
                break;

            case "gameFull":
                alert("Das Spiel ist bereits voll!");
                break;

            default:
                console.warn("Unbekannte Aktion:", data.action);
        }
    };

    vsSocket.onerror = function (error) {
        console.error("WebSocket error:", error);
    };

    vsSocket.onclose = function () {
        console.log("Versus WebSocket closed.");
    };
}

function sendVsAction(action, data) {
    console.log("Sending Versus action via WebSocket:", action, data);
    if (vsSocket && vsSocket.readyState === WebSocket.OPEN) {
        var message = {
            action: action,
            data: data,
            playerId: playerId
        };
        vsSocket.send(JSON.stringify(message));
        console.log("Versus action sent:", message);
    } else {
        console.warn("Versus WebSocket is not open. Ready state:", vsSocket.readyState);
    }
}

function startGameWithDifficulty(difficulty) {
    console.log("Game starting with difficulty:", difficulty);
    $('#difficulty').hide();
    $('#controls').show();
}


function updateVsGameState(data) {
    console.log("Updating game state:", data);
    buildVsGameBoards(data.gameStates);
}



function buildVsGameBoards(gameStates) {
    console.log("Building game boards for all players");

    // Fügen Sie die Klasse 'vs-mode' zum gameBoard hinzu
    gameBoard.attr('class', 'vs-mode'); // Setzt die Klasse 'vs-mode' auf den #gameBoard-Container

    gameBoard.html(''); // Clear the game area

    gameStates.forEach(state => {
        const playerName = state.playerId;
        const gameData = state.gameData;

        // Create a game board for each player
        let boardHtml = `<div class="player-board" id="board-${playerName}">`;
        boardHtml += `<h3>${playerName}</h3>`;
        boardHtml += buildGameBoardHtml(gameData, playerName);
        boardHtml += `</div>`;

        gameBoard.append(boardHtml);
    });

    // Enable interactions only for the current player's game board
    $(`.cell[data-player="${playerId}"]`).off('click').on('click', function () {
        const x = $(this).data('x');
        const y = $(this).data('y');
        console.log("Cell clicked at:", x, y);
        uncoverCell(x, y);
    });

    $(`.cell[data-player="${playerId}"]`).off('contextmenu').on('contextmenu', function (e) {
        e.preventDefault();
        const x = $(this).data('x');
        const y = $(this).data('y');
        console.log("Cell right-clicked at:", x, y);
        flagCell(x, y);
    });
}


function buildGameBoardHtml(data, playerName) {
    var rows = data.rows;
    var cols = data.cols;
    var cells = data.cells;

    var boardHtml = '<div class="gameBoard">';
    for (var row = 0; row < rows; row++) {
        boardHtml += '<div class="game-row">';
        for (var col = 0; col < cols; col++) {
            var cellValue = cells[row][col];
            var cellClasses = 'cell';
            var cellContent = '';
            switch (cellValue) {
                case '-':
                    cellClasses += ' covered';
                    break;
                case 'f':
                    cellClasses += ' flag';
                    cellContent = '&#x1F6A9;'; // Flag emoji
                    break;
                case '*':
                    cellClasses += ' bomb';
                    cellContent = '<img src="/assets/Mine.png" alt="Mine" class="mine-icon">';
                    break;
                case ' ':
                case '0':
                    cellClasses += ' empty';
                    cellContent = '&nbsp;'; // Non-breaking space
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                    cellClasses += ' number';
                    cellContent = cellValue;
                    break;
                default:
                    cellClasses += ' unknown';
                    break;
            }
            if (playerName === playerId) {
                cellClasses += ' own-cell';
            }
            boardHtml += '<div class="' + cellClasses + '" data-x="' + row + '" data-y="' + col + '" data-player="' + playerName + '">';
            boardHtml += '<span class="cell-content">' + cellContent + '</span></div>';
        }
        boardHtml += '</div>';
    }
    boardHtml += '</div>';

    return boardHtml;
}
