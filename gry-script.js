document.addEventListener("DOMContentLoaded", () => {
    const difficultyElement = document.getElementById("difficulty");
    if (!difficultyElement) {
        console.error("Nie znaleziono elementu difficulty!");
        return;
    }

    const difficultyStorage = localStorage.getItem("difficulty");
    let usedQuestions = JSON.parse(localStorage.getItem("usedQuestions")) || [];
    let rewardType = null;
    let currentQuestion = null;

    const pointsDisplay = document.querySelector(".points");
    let points = parseInt(localStorage.getItem("points") || "0");
    updatePointsDisplay();

    function updatePointsDisplay() {
        pointsDisplay.textContent = `Punkty: ${points}`;
    }

    function loadQuestions() {
        fetch("https://johnzpgg.github.io/pytania.json")
            .then(response => {
                if (!response.ok) throw new Error(`Błąd wczytywania JSON: ${response.status}`);
                return response.json();
            })
            .then(data => {
                console.log(data.pytania)
                startQuiz(data.pytania);
            })
            .catch(error => console.error("Błąd:", error));
    }

    function startQuiz(questions) {
        const kategoria = "gry";
        const availableQuestions = questions.filter(q =>
            q.kategoria === kategoria &&
            q.difficulty === difficultyStorage &&
            !usedQuestions.includes(q.id)
        );

        if (availableQuestions.length === 0) {
            document.getElementById("question").innerText = "Brak więcej pytań!";
            document.getElementById("answers").innerHTML = "";
            return;
        }

        currentQuestion = availableQuestions[0];
    }

    function showQuestion(question) {
        const questionElement = document.getElementById("question");
        const answersContainer = document.getElementById("answers");
        questionElement.innerText = question.pytanie;
        answersContainer.innerHTML = "";

        question.odpowiedzi.forEach((answer, index) => {
            const button = document.createElement("button");
            button.innerText = answer.tekst;
            button.onclick = () => checkAnswer(index, button);
            answersContainer.appendChild(button);
        });

        // Obsługa 50/50
        if (rewardType === "yellow") {
            const wrongAnswers = question.odpowiedzi
                .map((o, i) => ({ ...o, index: i }))
                .filter(o => !o.poprawna);
            const toDisable = shuffle(wrongAnswers).slice(0, 2);
            toDisable.forEach(o => {
                const btn = answersContainer.children[o.index];
                btn.disabled = true;
                btn.style.opacity = 0.5;
            });
        }

        // podpowiedź
        if (rewardType === "blue") {
            console.log("hint")
            const hint = question.podpowiedz;
            alert("PODPOWIEDŹ: " + hint);
        }

        // brak nagrody
        if (rewardType === "yellow") {
            alert("Niestety nic, spróbuj nastepnym razem.");
        }
    }

    function checkAnswer(selectedIndex, button) {
        const correctIndex = currentQuestion.odpowiedzi.findIndex(o => o.poprawna);
        let msg = "";
        let rewardPoints = 0;

        if (selectedIndex === correctIndex) {
            msg = "Poprawna odpowiedź!";
            if (rewardType === "green") rewardPoints = 20;
            else if (rewardType === "red") rewardPoints = 10;
            else rewardPoints = 10;
        } else {
            msg = "Błędna odpowiedź!";
            if (rewardType === "red") rewardPoints = -5;
            else rewardPoints = 0;
        }

        points += rewardPoints;
        localStorage.setItem("points", points);
        updatePointsDisplay();
        alert(`${msg} (${rewardPoints >= 0 ? "+" : ""}${rewardPoints} pkt)`);

        usedQuestions.push(currentQuestion.id);
        localStorage.setItem("usedQuestions", JSON.stringify(usedQuestions));
        location.reload();
    }

    // Funkcja losowania z koła
    window.spin = function () {
        const wheel = document.querySelector(".wheel");
        const randomDeg = 360 * 5 + Math.floor(Math.random() * 360); // minimum 5 obrotów
        wheel.style.transition = "transform 4s ease-out";
        wheel.style.transform = `rotate(${randomDeg}deg)`;

        const normalizedDeg = randomDeg % 360;

        setTimeout(() => {
            if (normalizedDeg >= 0 && normalizedDeg < 90) rewardType = "red";
            else if (normalizedDeg >= 90 && normalizedDeg < 180) rewardType = "yellow";
            else if (normalizedDeg >= 180 && normalizedDeg < 270) rewardType = "green";
            else rewardType = "blue";

            // Po zakończeniu animacji wyświetl pytanie
            startQuizAfterSpin();
        }, 4000);
    };

    function startQuizAfterSpin() {
        if (!currentQuestion) {
            alert("Nie wczytano pytania!");
            return;
        }
        showQuestion(currentQuestion);
    }

    // Losowa kolejność pomocniczo do 50/50
    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    loadQuestions();
});

    window.resetQuiz = function () {
    localStorage.removeItem("usedQuestions");
    localStorage.removeItem("points");
    // Jeśli kiedyś dodasz rewardType do localStorage:
    // localStorage.removeItem("rewardType");
    alert("Gra została zresetowana!");
    location.reload();
};
