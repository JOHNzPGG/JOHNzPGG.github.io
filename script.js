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
    if(localStorage.getItem("difficulty") == "łatwy"){
        difficulty_item.innerText = "normalny";
        localStorage.setItem("difficulty", "normalny");
    }
    else if(localStorage.getItem("difficulty") == "normalny"){
        difficulty_item.innerText = "trudny";
        localStorage.setItem("difficulty", "trudny");
    }
    else if(localStorage.getItem("difficulty") == "trudny"){
        difficulty_item.innerText = "łatwy";
        localStorage.setItem("difficulty", "łatwy");
    }
    console.log(localStorage.getItem("difficulty"));
}

function spin() {
    let wheel = document.querySelector(".wheel");
    let randomRotation = 360 * 5 + Math.floor(Math.random() * 360); // 5 obrotów + losowy kąt

    wheel.style.transition = "transform 3s ease-out";
    wheel.style.transform = `rotate(${randomRotation}deg)`;
}

