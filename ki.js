// #region fertig
function infoside() {
    window.open('info.html', '_self');
}

function zuruck() {
    window.history.back();
}

function loschen() {
    aktuell = 0;
    localStorage.setItem("aktuell", aktuell);

    const aktuellElement = document.getElementById("aktuell");
    if (aktuellElement) {
        aktuellElement.textContent = aktuell;
    }
    reload();
}

function reload() {
    localStorage.removeItem("feld"); // Speicher löschen
    location.reload();
}

function field() {
    window.open('field.html', '_self');
}

function weiter() {
    localStorage.removeItem("feld");
    window.open('index.html', '_self');
    
}

function weiter2() {
    if (aktuell > 0) {
        var antwort = confirm("Möchtest du wirklich zur Startseite?\nDein Fortschritt wird gelöscht.");

        if (antwort) {
            localStorage.removeItem("feld");
            window.open('index.html', '_self');
        }
    } else {
        checkRecord()
        localStorage.removeItem("feld");
        window.open('index.html', '_self');
    }
}

function ladeSpielfeld() {
    const buttons = document.querySelectorAll(".board button");

    for (let i = 0; i < feld.length; i++) {

        buttons[i].textContent = feld[i];

        if (feld[i] === "KI") {
            buttons[i].style.backgroundColor = "#a0ffa0";
        }
        else if (feld[i] === "O") {
            buttons[i].style.backgroundColor = "#ffb3b3";
        }
        else {
            buttons[i].style.backgroundColor = "";
        }
    }
}

let spieler = Math.random() < 0.5 ? "KI" : "O";
let kiDenkt = false;

let feld = JSON.parse(localStorage.getItem("feld")) || [
    "", "", "",
    "", "", "",
    "", "", ""
];

window.onload = function () {
    updateStatus();

    if (document.querySelector(".board")) {
        ladeSpielfeld(feld);
    }

    // Falls die KI beginnt
    if (spieler === "KI") {
        kiDenkt = true;

        setTimeout(() => {
            kiplace();
        }, 300);
    }
};

document.addEventListener("keydown", (event) => {
    if (event.key >= "1" && event.key <= "9") {
        document.getElementById(event.key).click();
    }
});

//Aktueller Punkte Stand, setzt sich nach Verloren oder Verlassen wieder Zurück
let aktuell = Number(localStorage.getItem("aktuell")) || 0;
let status = localStorage.getItem("status") || "";

const aktuellElement = document.getElementById("aktuell");
if (aktuellElement) {
    aktuellElement.textContent = aktuell;
}

function ki(status) {
    aktuell = 0;

    localStorage.setItem("aktuell", aktuell);
    localStorage.setItem("status", status);

    window.open('ki.html', '_self');
}

//Highscore gegen KI am Stück gesammelte Punkte, setzt sich nie Zurück, wird nur erhöht bei neuem Rekord
let lscore = Number(localStorage.getItem("lscore")) || 0;
let mscore = Number(localStorage.getItem("mscore")) || 0;
let sscore = Number(localStorage.getItem("sscore")) || 0;
document.getElementById("lscore").innerHTML = lscore;
document.getElementById("mscore").innerHTML = mscore;
document.getElementById("sscore").innerHTML = sscore;

//aktueller Rekord halter, Spieler darf sich selbst einen Namen, geben (vor oder nach dem Spiel) der dann mit bei dem Highscore steht
let lplayer = localStorage.getItem("lplayer") || "";
let mplayer = localStorage.getItem("mplayer") || "";
let splayer = localStorage.getItem("splayer") || "";
document.getElementById("lplayer").innerHTML = lplayer;
document.getElementById("mplayer").innerHTML = mplayer;
document.getElementById("splayer").innerHTML = splayer;

function score(name) {
    if (aktuell > lscore && status === "leicht") {
        localStorage.setItem("lscore", aktuell)
        localStorage.setItem("lplayer", name)
    } else if (aktuell > mscore && status === "mittel") {
        localStorage.setItem("mscore", aktuell)
        localStorage.setItem("mplayer", name)
    } else if (aktuell > sscore && status === "schwer") {
        localStorage.setItem("sscore", aktuell)
        localStorage.setItem("splayer", name)
    }
}

function win() {
    aktuell += 2;
    localStorage.setItem("aktuell", aktuell);

    const aktuellElement = document.getElementById("aktuell");
    if (aktuellElement) {
        aktuellElement.textContent = aktuell;
    }
}

function lose() {
    aktuell = 0;
    localStorage.setItem("aktuell", aktuell);

    const aktuellElement = document.getElementById("aktuell");
    if (aktuellElement) {
        aktuellElement.textContent = aktuell;
    }
}

function unentschieden() {
    aktuell++;
    localStorage.setItem("aktuell", aktuell);

    const aktuellElement = document.getElementById("aktuell");
    if (aktuellElement) {
        aktuellElement.textContent = aktuell;
    }
}

function updateStatus() {
    const statusElement = document.getElementById("status");
    if (!statusElement) return true;
    if (spieler === "KI") {
    statusElement.textContent =
        "Die KI ist am Zug";
    } else if (spieler === "O") {
        statusElement.textContent =
        "Du bist am Zug";
    }
}

function place(button, index) {
    if (kiDenkt) return;

    if (spieler !== "O") return;

    if (feld[index] !== "") return;

    feld[index] = "O";
    button.textContent = "O";
    button.style.backgroundColor = "#ffb3b3";

    localStorage.setItem("feld", JSON.stringify(feld));

    if (checkWinner()) return;

    spieler = "KI";
    updateStatus();

    kiDenkt = true;

    // KI kurz verzögert ziehen lassen,
    // damit der Spielerzug sichtbar bleibt
    setTimeout(() => {
        kiplace();
    }, 300);
}

function kiplace() {
    let index;

    if (status === "leicht") {
        index = leicht();
    } else if (status === "mittel") {
        index = mittel();
    } else if (status === "schwer") {
        index = schwer();
    }
    // Falls kein Feld mehr frei ist
    if (index === undefined || index === -1) {
        kiDenkt = false;
        return;
    }

    feld[index] = "KI";

    const button = document.querySelectorAll(".board button")[index];

    button.textContent = "KI";
    button.style.backgroundColor = "#a0ffa0";

    localStorage.setItem("feld", JSON.stringify(feld));

    if (checkWinner()) {
        kiDenkt = false;
        return;
    }

    spieler = "O";
    kiDenkt = false;

    updateStatus();
}

function checkWinner() {
    let test = 0;
    const gewinnKombinationen = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const [a, b, c] of gewinnKombinationen) {

        if (
            feld[a] !== "" &&
            feld[a] === feld[b] &&
            feld[b] === feld[c]
        ) {
            if (feld[a] === "O") {
                win();
                var antwort = confirm("Du hast gewonnen (+2),\nmöchtest du noch eine Runde Spielen?");
            }
            else {
                checkRecord();
                lose();
                var antwort = confirm("Du hast verloren (=0),\nmöchtest du noch eine Runde Spielen?");
            }         

            if (antwort) {
                reload();
            } else {
                checkRecord();
                
                localStorage.removeItem("feld");
                return true;
            }
        } else if (
            feld[a] !== "" &&
            feld[b] !== "" &&
            feld[c] !== ""
        ) {
            test ++
        }
    }
    if (test === 8) {
        unentschieden();
        var antwort = confirm("Keiner hat gewonnen (unentschieden, +1),\nmöchtest du noch eine Runde Spielen?");
        if (antwort) {
            reload();
        } else {
            checkRecord();
            localStorage.removeItem("feld");
            return true;
        }
    }
    return false;
}

function checkRecord(){
    if (aktuell >= lscore && status === "leicht") {
        name = prompt("Du hast einen neuen Rekord aufgestellt!\n gib deinen Namen ein:");
        localStorage.setItem("lscore", aktuell);
        localStorage.setItem("lplayer", name);
    } else if (aktuell >= mscore && status === "mittel") {
        name = prompt("Du hast einen neuen Rekord aufgestellt!\n gib deinen Namen ein:");
        localStorage.setItem("mscore", aktuell);
        localStorage.setItem("mplayer", name);
    } else if (aktuell >= sscore && status === "schwer") {
        name = prompt("Du hast einen neuen Rekord aufgestellt!\n gib deinen Namen ein:");
        localStorage.setItem("sscore", aktuell);
        localStorage.setItem("splayer", name);
    }
}

function leicht() {

    const freieFelder = [];

    for (let i = 0; i < feld.length; i++) {
        if (feld[i] === "") {
            freieFelder.push(i);
        }
    }

    if (freieFelder.length === 0) {
        return -1;
    }

    const zufallsIndex = Math.floor(
        Math.random() * freieFelder.length
    );

    return freieFelder[zufallsIndex];
}

function mittel() {
    const twoin1row = [
        [0, 1, 2], [0, 2, 1], [1, 2, 0],
        [3, 4, 5], [3, 5, 4], [4, 5, 3],
        [6, 7, 8], [6, 8, 7], [7, 8, 6],

        [0, 3, 6], [0, 6, 3], [3, 6, 0],
        [1, 4, 7], [1, 7, 4], [4, 7, 1],
        [2, 5, 8], [2, 8, 5], [5, 8, 2],

        [0, 4, 8], [0, 8, 4], [4, 8, 0],
        [2, 4, 6], [2, 6, 4], [4, 6, 2],
    ];

    for (const [a, b, c] of twoin1row) {
        if (
            feld[a] === "KI" &&
            feld[b] === feld[a] &&
            feld[c] === ""
        ) {
            return c;
        }
    }

    for (const [a, b, c] of twoin1row) {
        if (
            feld[a] !== "" &&
            feld[b] === feld[a] &&
            feld[c] === ""
        ) {
            return c;
        }
    }
    return leicht();
}


function schwer() {
    // Spielfeld in 3x3-Array umwandeln
    let b = [
        ['_', '_', '_'],
        ['_', '_', '_'],
        ['_', '_', '_']
    ];

    for (let i = 0; i < 9; i++) {
        const text = feld[i];

        if (text === "O") {
            b[Math.floor(i / 3)][i % 3] = "O";
        } else if (text === "KI") {
            b[Math.floor(i / 3)][i % 3] = "KI";
        } else {
            b[Math.floor(i / 3)][i % 3] = "_";
        }
    }

    // Gewinner bewerten
    function evaluate(board) {
        // Reihen
        for (let row = 0; row < 3; row++) {
            if (
                board[row][0] !== "_" &&
                board[row][0] === board[row][1] &&
                board[row][1] === board[row][2]
            ) {
                if (board[row][0] === "KI") return -10;
                if (board[row][0] === "O") return 10;
            }
        }

        // Spalten
        for (let col = 0; col < 3; col++) {
            if (
                board[0][col] !== "_" &&
                board[0][col] === board[1][col] &&
                board[1][col] === board[2][col]
            ) {
                if (board[0][col] === "KI") return -10;
                if (board[0][col] === "O") return 10;
            }
        }

        // Diagonale links oben -> rechts unten
        if (
            board[0][0] !== "_" &&
            board[0][0] === board[1][1] &&
            board[1][1] === board[2][2]
        ) {
            if (board[0][0] === "KI") return -10;
            if (board[0][0] === "O") return 10;
        }

        // Diagonale rechts oben -> links unten
        if (
            board[0][2] !== "_" &&
            board[0][2] === board[1][1] &&
            board[1][1] === board[2][0]
        ) {
            if (board[0][2] === "KI") return -10;
            if (board[0][2] === "O") return 10;
        }

        return 0;
    }

    // Prüfen, ob noch Züge möglich sind
    function isMovesLeft(board) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === "_") {
                    return true;
                }
            }
        }

        return false;
    }

    // Minimax
    function minimax(board, depth, isMax) {
        const score = evaluate(board);

        // Spieler gewinnt
        if (score === 10) {
            return score - depth;
        }

        // KI gewinnt
        if (score === -10) {
            return score + depth;
        }

        // Unentschieden
        if (!isMovesLeft(board)) {
            return 0;
        }

        // Spielerzug simulieren
        if (isMax) {
            let best = -1000;

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] === "_") {
                        board[i][j] = "O";

                        best = Math.max(
                            best,
                            minimax(board, depth + 1, false)
                        );

                        board[i][j] = "_";
                    }
                }
            }

            return best;
        }

        // KI-Zug simulieren
        else {
            let best = 1000;

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] === "_") {
                        board[i][j] = "KI";

                        best = Math.min(
                            best,
                            minimax(board, depth + 1, true)
                        );

                        board[i][j] = "_";
                    }
                }
            }

            return best;
        }
    }

    // Besten Zug finden
    let bestVal = 1000;
    let bestMoveRow = -1;
    let bestMoveCol = -1;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (b[i][j] === "_") {
                b[i][j] = "KI";

                const moveVal = minimax(b, 0, true);

                b[i][j] = "_";

                if (moveVal < bestVal) {
                    bestVal = moveVal;
                    bestMoveRow = i;
                    bestMoveCol = j;
                }
            }
        }
    }

    // Kein Zug mehr möglich
    if (bestMoveRow === -1) {
        return -1;
    }

    // Index für dein feld[] zurückgeben
    return bestMoveRow * 3 + bestMoveCol;
}
// #endregion