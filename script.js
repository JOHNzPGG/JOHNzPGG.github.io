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
            data.pytania.forEach((pytanie, index) => {
                let questionElement = document.createElement("div");
                questionElement.className = "question";
                questionElement.innerHTML = `<strong>Pytanie ${index + 1}:</strong> ${pytanie.pytanie}`;
                container.appendChild(questionElement);
            });
        })
        .catch(error => console.error("Błąd:", error));
}

document.addEventListener("DOMContentLoaded", loadQuestions);
