if(localStorage.getItem("difficulty") == null){
    localStorage.setItem("difficulty", "normalny");
}

let difficulty_item = document.getElementById("difficulty");
let difficulty_storage = localStorage.getItem("difficulty");
difficulty_item.innerText = difficulty_storage

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function changeDifficultyLevel(){
    if(localStorage.getItem("difficulty") == "Łatwy"){
        difficulty_item.innerText = "Normalny";
        localStorage.setItem("difficulty", "Normalny");
    }
    else if(localStorage.getItem("difficulty") == "Normalny"){
        difficulty_item.innerText = "Trudny";
        localStorage.setItem("difficulty", "Trudny");
    }
    else if(localStorage.getItem("difficulty") == "Trudny"){
        difficulty_item.innerText = "Łatwy";
        localStorage.setItem("difficulty", "Łatwy");
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

