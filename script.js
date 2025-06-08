// darkmode / light mode

const checkbox = document.getElementById('theme-toggle');
const body = document.body;

// Sprawdź lokalne ustawienie motywu
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark');
    checkbox.checked = true;
}

// Obsługa kliknięcia
checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
        body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
});


//gra

const pointsDisplay = document.querySelector(".points");
let points = parseInt(localStorage.getItem("points") || "0");
pointsDisplay.innerHTML = "Punkty: " + points;

if(localStorage.getItem("difficulty") == null){
    localStorage.setItem("difficulty", "Normalny");
}

let difficulty_item = document.getElementById("difficulty");
let difficulty_storage = localStorage.getItem("difficulty");
difficulty_item.innerText = difficulty_storage

if(difficulty_item.innerHTML === "Łatwy"){
    difficulty_item.style.color = "green";
}
else if(difficulty_item.innerHTML === "Normalny"){
    difficulty_item.style.color = "yellow";
}
else if(difficulty_item.innerHTML === "Trudny"){
    difficulty_item.style.color = "red";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function changeDifficultyLevel(){
    if(localStorage.getItem("difficulty") == "Łatwy"){
        difficulty_item.innerText = "Normalny";
        localStorage.setItem("difficulty", "Normalny");
        difficulty_item.style.color = "yellow";
    }
    else if(localStorage.getItem("difficulty") == "Normalny"){
        difficulty_item.innerText = "Trudny";
        localStorage.setItem("difficulty", "Trudny");
        difficulty_item.style.color = "red";
    }
    else if(localStorage.getItem("difficulty") == "Trudny"){
        difficulty_item.innerText = "Łatwy";
        localStorage.setItem("difficulty", "Łatwy");
        difficulty_item.style.color = "green";
    }
    else{
        difficulty_item.innerText = "Łatwy";
        localStorage.setItem("difficulty", "Łatwy");
    }
    console.log(localStorage.getItem("difficulty"));
}

function spin() {
    let wheel = document.querySelector(".wheel");
    let randomRotation = 360 * 5 + Math.floor(Math.random() * 360); // 5 obrotów + losowy kąt

    wheel.style.transition = "transform 3s ease-out";
    wheel.style.transform = `rotate(${randomRotation}deg)`;
}

function loadQuestions() {
    fetch("https://johnzpgg.github.io/pytania-nowe.json")
        .then(response => {
            if (!response.ok) throw new Error(`Błąd wczytywania JSON: ${response.status}`);
            return response.json();
        })
.then(data => {
    const container = document.getElementById("questions-container");

    const u_odp = JSON.parse(localStorage.getItem("u_odp") || "[]");

    data.pytania.forEach((pytanie, index) => {
        const questionElement = document.createElement("div");
        questionElement.className = "question";

        // czy użytkownik odpowiedział na to pytanie
        const odp = u_odp.find(entry => entry.id === pytanie.id);

    if (odp) {
        const correctAnswerText = pytanie.odpowiedzi.find(odpowiedz => odpowiedz.poprawna).tekst;
        const userAnswerText = odp.answer;

        let buttonsHTML = "";

        for (let i = 0; i < 4; i++) {
            const ans = pytanie.odpowiedzi[i].tekst;
            let style = "";

            if (ans === userAnswerText) {
                style = odp.isCorrect
                    ? "background-color: green; color: white;"
                    : "background-color: red; color: white;";
            } else if (!odp.isCorrect && ans === correctAnswerText) {
                style = "background-color: green; color: white;";
            }

            buttonsHTML += `<button style="margin: 4px; padding: 10px; border-radius: 0.5rem; ${style}">${ans}</button>`;
        }

        questionElement.innerHTML = `
            <strong>Pytanie ${index}</strong><br>
            <strong>Kategoria:</strong> ${pytanie.kategoria}<br>
            <strong>Poziom:</strong> ${pytanie.difficulty}<br><br>
            <strong>${pytanie.pytanie}</strong><br><br>
            <em>Odpowiedzi:</em><br>
            ${buttonsHTML}
        `;
        container.appendChild(questionElement);
    }

    });
})
.catch(error => console.error("Błąd:", error));

}

window.resetQuiz = function () {
    localStorage.removeItem("usedQuestions");
    localStorage.removeItem("points");
    localStorage.removeItem("u_odp");
    alert("Gra została zresetowana!");
    location.reload();
};

document.addEventListener("DOMContentLoaded", loadQuestions);
