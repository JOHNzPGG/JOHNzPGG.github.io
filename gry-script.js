document.addEventListener("DOMContentLoaded", () => {
    const difficultyElement = document.getElementById("difficulty");
    if (!difficultyElement) {
        console.error("Nie znaleziono elementu difficulty!");
        return;
    }

    const rewards = new Map();
    rewards.set("blue", "Gracz dostaje podpowiedź dotyczącą pytania.")
    rewards.set("yellow", "Koło ratunkowe 50/50 - wyrzucone zostają dwie niepoprawne odpowiedzi.")
    rewards.set("green", "Punkty x2 po udzieleniu poprawnej odpowiedzi.")
    rewards.set("red", "Gracz dostaje -5 pkt w przypadku udzielenia niepoprawnej odpowiedzi.")

    const difficultyStorage = localStorage.getItem("difficulty");
    let usedQuestions = JSON.parse(localStorage.getItem("usedQuestions")) || [];
    let rewardType = null;
    let currentQuestion = null;
    let u_odp = JSON.parse(localStorage.getItem("u_odp")) || [];

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
                console.log("Wszystkie pytania:");
                console.log(data.pytania);
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
        console.log("Pytania z kategorii:");
        console.log(availableQuestions);
        const questionsLights = document.getElementById("right");
        questionsLights.innerHTML = "";
        let id = 1;

        questions.forEach((question) => {
            if(question.kategoria === kategoria && question.difficulty === difficultyStorage){
                const button = document.createElement("button");
                button.innerText = `${id}`;
                button.style.margin = "4px";
                button.style.height = "60px";
                button.style.width = "60px";
                const odp = u_odp.find(entry => entry.id === question.id);
                if (odp) {
                    if (odp.isCorrect === true) {
                        button.style.backgroundColor = "green";
                    } else if (odp.isCorrect === false) {
                        button.style.backgroundColor = "red";
                    }
                }
                else {
                    button.style.backgroundColor = "lightgrey";
                }
                button.style.borderRadius = "1rem";
                button.style.fontSize = "25px";
                id++;

                // Dodaj np. podgląd pytania po kliknięciu
                button.addEventListener("click", () => {
                    alert(`ID pytania:\n${question.id}`);
                });

                questionsLights.appendChild(button);
            }
        });


        if (availableQuestions.length === 0) {
            document.getElementById("question").innerText = "Brak więcej pytań!";
            document.getElementById("answers").innerHTML = "";
            return;
        }

        currentQuestion = availableQuestions[0];
    }

    function showQuestion(question) {
        const answersContainer = document.getElementById("answers");
        showQuestionInModal(question, rewardType, rewards);
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


function checkAnswer(idx, question, rewardType, isCorrect) {
    let points = parseInt(localStorage.getItem("points") || "0");
    let rewardPoints = 0;

    if (isCorrect) {
        if (rewardType === "green") rewardPoints = 20;
        else if (rewardType === "red") rewardPoints = 10;
        else rewardPoints = 10;
    } else {
        if (rewardType === "red") rewardPoints = -5;
        else rewardPoints = 0;
    }

    u_odp.push({
        difficulty: question.difficulty,
        kategoria: question.kategoria,
        id: question.id,
        answer: question.odpowiedzi[idx].tekst,
        isCorrect: isCorrect
    });
    localStorage.setItem("u_odp", JSON.stringify(u_odp));

    points += rewardPoints;
    localStorage.setItem("points", points);
    updatePointsDisplay();
    usedQuestions.push(question.id);
    localStorage.setItem("usedQuestions", JSON.stringify(usedQuestions));
}


//dodatkowe okno

const modal = document.getElementById('question-modal');
const closeModal = modal.querySelector('.close');
closeModal.onclick = () => modal.style.display = 'none';

function showQuestionInModal(question, rewardType, rewards) {
  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }
  const rewardText = rewards.get(rewardType);
  if(rewardType === "blue"){
    document.getElementById('modal-hint').innerText = "Podpowiedz do pytania:\n" + question.podpowiedz;
  }
  document.getElementById('modal-bonus').innerText = `Wylosowany bonus: \n ${rewardText}`;
  document.getElementById('modal-question').innerText = question.pytanie;
  const answersDiv = document.getElementById('modal-answers');
  answersDiv.innerHTML = '';

  if (rewardType === "yellow") {
  const wrongAnswers = question.odpowiedzi
    .map((o, i) => ({ ...o, index: i }))
    .filter(o => !o.poprawna);
    var toDisable = shuffle(wrongAnswers).slice(0, 2);
    console.log(toDisable);
  }

question.odpowiedzi.forEach((ans, idx) => {
  const btn = document.createElement('button');
  btn.innerText = ans.tekst;
  
  if (rewardType === "yellow") {
    const disable0 = toDisable[0] && toDisable[0].tekst === ans.tekst;
    const disable1 = toDisable[1] && toDisable[1].tekst === ans.tekst;
    if (disable0 || disable1) {
      btn.style.cursor = "not-allowed";
      btn.disabled = true;
    }
  }
  
  btn.onclick = () => {
    const poprawnosc_odp = question.odpowiedzi[idx].poprawna;
    handleAnswer(idx, question, btn, rewardType);
    checkAnswer(idx, question, rewardType, poprawnosc_odp);
  };

  answersDiv.appendChild(btn);
});


  modal.style.display = 'flex';
}

function handleAnswer(selectedIdx, question, clickedButton, rewardType) {
  const correctIdx = question.odpowiedzi.findIndex(a => a.poprawna);
  const buttons = document.getElementById('modal-answers').children;

  if (selectedIdx === correctIdx) {
    clickedButton.classList.add('correct');
  } else {
    clickedButton.classList.add('wrong');
    buttons[correctIdx].classList.add('correct');
  }

  Array.from(buttons).forEach((btn) => {
    btn.disabled = true;
    btn.classList.add("disabled");
  });


  setTimeout(() => {
    modal.style.display = 'none';
    location.reload();
  }, 4000);
}


    loadQuestions();
});
