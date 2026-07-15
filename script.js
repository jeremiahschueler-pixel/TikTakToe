function infoside() {
    window.open('info.html', '_self');
}

function newstat() {
    localStorage.removeItem("xwin");
    localStorage.removeItem("owin");
    location.reload();
}

function ki() {
    window.open('level.html', '_self');
}

function zuruck() {
    window.history.back();
}

function reload() {
    localStorage.removeItem("feld"); // Speicher löschen
    location.reload(); // Klammern ergänzt, damit die Funktion wirklich ausgeführt wird
}

function field() {
    localStorage.removeItem("feld")
    window.open('field.html', '_self');
}

function weiter() {
    var antwort = confirm("Möchtest du wirklich zur Startseite?\nDein Fortschritt wird gelöscht.");

    if (antwort) {
        localStorage.removeItem("feld"); // Spielstand löschen
        window.open('index.html', '_self');
    }
}

let spieler = Math.random() < 0.5 ? "X" : "O";

let feld = JSON.parse(localStorage.getItem("feld")) || [
    "", "", "",
    "", "", "",
    "", "", ""
];

function ladeSpielfeld(feld) {
    const buttons = document.querySelectorAll(".board button");

    for (let i = 0; i < feld.length; i++) {

        buttons[i].textContent = feld[i];

        if (feld[i] === "X") {
            buttons[i].style.backgroundColor = "#a0d8ff";
        }
        else if (feld[i] === "O") {
            buttons[i].style.backgroundColor = "#ffb3b3";
        }
        else {
            buttons[i].style.backgroundColor = "";
        }
    }
}

function updateStatus() {
    const statusElement = document.getElementById("status");
    if (!statusElement) return;
    statusElement.textContent =
        "Spieler " + spieler + " ist am Zug";
}

window.onload = function () {
    updateStatus();

    if (document.querySelector(".board")) {
        ladeSpielfeld(feld);
    }
};

function place(button, index) {

    if (feld[index] !== "") return;

    feld[index] = spieler;
    button.textContent = spieler;

    if (spieler === "X") {
        button.style.backgroundColor = "#a0d8ff";
    }
    else {
        button.style.backgroundColor = "#ffb3b3";
    }

    localStorage.setItem("feld", JSON.stringify(feld));

    checkWinner();

    spieler = spieler === "X" ? "O" : "X";

    updateStatus();
}

function checkWinner() {
    test = 0;
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
            if (feld[a] === "X") {
                xwin += 2;
                localStorage.setItem("xwin", xwin);
                
            } else {
                owin += 2;
                localStorage.setItem("owin", owin);
            }
            var antwort = confirm("Spieler "+ feld[a] + " hat gewonnen,\nmöchtet ihr noch eine Runde Spielen?");
            

            if (antwort) {
                reload();
            } else {
                localStorage.removeItem("feld");
                return;
            }
        } else if (
            feld[a] !== "" &&
            feld[b] !== "" &&
            feld[c] !== ""
        ) {
            test ++
        }
        if (test === 8) {
            var antwort = confirm("Keiner hat gewonnen (unentschieden),\nmöchtet ihr noch eine Runde Spielen?");
            if (antwort) {
                reload();
            } else {
                localStorage.removeItem("feld");
                return;
            }
        }
    }
}

document.addEventListener("keydown", (event) => {
    if (event.key >= "1" && event.key <= "9") {
        document.getElementById(event.key).click();
    }
});

let xwin = Number(localStorage.getItem("xwin")) || 0;
let owin = Number(localStorage.getItem("owin")) || 0;
document.getElementById("xwin").innerHTML = xwin;
document.getElementById("xlos").innerHTML = owin;
document.getElementById("owin").innerHTML = owin;
document.getElementById("olos").innerHTML = xwin;

ges = xwin + owin;
if (ges !== 0){
    document.getElementById("gesx").innerHTML = Math.round(xwin/ges*100) +"%";
    document.getElementById("geso").innerHTML = Math.round(owin/ges*100) +"%";
} else {
    document.getElementById("gesx").innerHTML = "0%";
    document.getElementById("geso").innerHTML = "0%";
}


//Anzeigen von KI Scores
//Leicht
const lscore = Number(localStorage.getItem("lscore")) || 0;
document.getElementById("lscore").innerHTML = lscore;
const lplayer = localStorage.getItem("lplayer") || "";
document.getElementById("lplayer").innerHTML = lplayer;
//Mittel
const mscore = Number(localStorage.getItem("mscore")) || 0;
document.getElementById("mscore").innerHTML = mscore;
const mplayer = localStorage.getItem("mplayer") || "";
document.getElementById("mplayer").innerHTML = mplayer;
//Schwer
const sscore = Number(localStorage.getItem("sscore")) || 0;
document.getElementById("sscore").innerHTML = sscore;
const splayer = localStorage.getItem("splayer") || "";
document.getElementById("splayer").innerHTML = splayer;