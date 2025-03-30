function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  sleep(200);
document.addEventListener("DOMContentLoaded", () => {
    let difficultyElement = document.getElementById("difficulty");

    if (!difficultyElement) {
        console.error("Nie znaleziono elementu difficulty!");
        return;
    }

    let difficultyStorage = difficultyElement;
    let usedQuestions = JSON.parse(localStorage.getItem("usedQuestions")) || [];

    function loadQuestions() {
        fetch("pytania.json")
            .then(response => {
                if (!response.ok) throw new Error(`Błąd wczytywania JSON: ${response.status}`);
                return response.json();
            })
            .then(data => {
                console.log("Dane z JSON:", data);
                startQuiz(data.pytania);
            })
            .catch(error => console.error("Błąd:", error));
    }

    function startQuiz(questions) {
        if (!Array.isArray(questions)) {
            console.error("Błąd: Niepoprawny format pliku JSON.");
            return;
        }

        let category = "gry"; // Na razie na sztywno
        let availableQuestions = questions.filter(q => q.kategoria === category && q.difficulty === difficultyStorage && !usedQuestions.includes(q.id));

        if (availableQuestions.length === 0) {
            document.getElementById("question").innerText = "Brak więcej pytań!";
            document.getElementById("answers").innerHTML = "";
            return;
        }

        let currentQuestion = availableQuestions[0];
        showQuestion(currentQuestion);
    }

    function showQuestion(currentQuestion) {
        let questionElement = document.getElementById("question");
        let answersContainer = document.getElementById("answers");

        if (!questionElement || !answersContainer) {
            console.error("Brak elementów do wyświetlenia pytań.");
            return;
        }

        questionElement.innerText = currentQuestion.pytanie;
        answersContainer.innerHTML = "";

        currentQuestion.odpowiedzi.forEach((answer, index) => {
            let button = document.createElement("button");
            button.innerText = answer.tekst;
            button.onclick = () => checkAnswer(currentQuestion, index);
            answersContainer.appendChild(button);
        });
    }

    function checkAnswer(currentQuestion, selectedIndex) {
        let correctIndex = currentQuestion.odpowiedzi.findIndex(o => o.poprawna);

        if (selectedIndex === correctIndex) {
            alert("Poprawna odpowiedź!");
        } else {
            alert("Błędna odpowiedź!");
        }

        usedQuestions.push(currentQuestion.id);
        localStorage.setItem("usedQuestions", JSON.stringify(usedQuestions));
        location.reload();
    }

    loadQuestions();
});
