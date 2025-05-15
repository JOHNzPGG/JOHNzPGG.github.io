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
    let spinIdx = 0;

    function updatePointsDisplay() {
        pointsDisplay.textContent = `Punkty: ${points}`;
    }

    function loadQuestions() {
        fetch("https://johnzpgg.github.io/pytania-nowe.json")
            .then(response => {
                if (!response.ok) throw new Error(`Błąd wczytywania JSON: ${response.status}`);
                return response.json();
            })
            .then(data => {
                console.log(data.pytania);
                startQuiz(data.pytania);
            })
            .catch(error => console.error("Błąd:", error));
    }

    function startQuiz(questions) {
        const kategoria = "filmy";
        const availableQuestions = questions.filter(q =>
            q.kategoria === kategoria &&
            q.difficulty === difficultyStorage &&
            !usedQuestions.includes(q.id)
        );

        const questionsLights = document.getElementById("right");
        questionsLights.innerHTML = "";
        let id = 1;

        availableQuestions.forEach((question) => {
            const button = document.createElement("button");
            button.innerText = `${id}`;
            button.style.margin = "4px";
            button.style.height = "60px";
            button.style.width = "60px";
            button.style.backgroundColor = "lightgrey";
            button.style.borderRadius = "1rem";
            button.style.fontSize = "25px";
            id++;

            // Dodaj np. podgląd pytania po kliknięciu
            button.addEventListener("click", () => {
                alert(`ID pytania:\n${question.id}`);
            });

            questionsLights.appendChild(button);
        });


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
        questionElement.style.fontSize = "Larger";
        answersContainer.innerHTML = "";

        question.odpowiedzi.forEach((answer, index) => {
            const button = document.createElement("button");
            button.innerText = answer.tekst;
            button.style.fontSize = "Larger";
            button.style.backgroundColor = "lightgrey";
            button.style.borderRadius = "1rem";
            button.style.fontSize = "25px";
            button.onclick = () => checkAnswer(index, button);
            answersContainer.appendChild(button);
        });

        // 50/50
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
        if(spinIdx === 1){
            console.log("Już zakręciłeś kołem!");
        }
        else{
            const wheel = document.querySelector(".wheel");
            wheel.removeAttribute("onclick");
            const randomDeg = Math.floor(Math.random() * 359);
            const SpinAndranodmDeg = 360 * 5 + randomDeg; // minimum 5 obrotów
            wheel.style.transition = "transform 4s ease-out";
            wheel.style.transform = `rotate(${SpinAndranodmDeg}deg)`;

            setTimeout(() => {
                if (randomDeg >= 0 && randomDeg < 90) rewardType = "blue";
                else if (randomDeg >= 90 && randomDeg < 180) rewardType = "green";
                else if (randomDeg >= 180 && randomDeg < 270) rewardType = "yellow";
                else rewardType = "red";

                console.log(randomDeg);

                // Po zakończeniu animacji wyświetl pytanie
                startQuizAfterSpin();
            }, 4000);
            spinIdx = 1;
        }
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
