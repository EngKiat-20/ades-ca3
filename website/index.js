var backendButton = document.getElementById("backend-button");
var startButton = document.getElementById("start-button");
var resetButton = document.getElementById("reset-button");
var setNameButton = document.getElementById("set-name");
var submitScoreButton = document.getElementById("submit-score-button");
const sessionIdInput = document.getElementById('session-id-input');
const nameInput = document.getElementById('name-input');
const sessionIdText = document.getElementById("session-id-text");
const nameText = document.getElementById("name-text");
const sessionId = sessionIdInput.value;
var username;

//
//  GAME-SPECIFIC FUNCTIONS BELOW THIS COMMENT
//

//Declaring variable
var colorNames = ["Red", "Green", "Blue", "Yellow", "Pink", "Black"];
var colorValues = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#000000"];
var rgbValues = ["rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)", "rgb(255, 255, 0)", "rgb(255, 0, 255)", "rgb(0, 0, 0)"]
var wordIndex
var colorIndex
var totalQuestions=0;
var correctAnswers=0;
var incorrectAnswers=0;

//Game-specific Functions
//Start Game
function startGame(){
    totalQuestions = 1
    correctAnswers = 0
    incorrectAnswers = 0
    document.getElementById("title-screen").style.display="none"
    document.getElementById("game-interface").style.display="block"
}

//Create question
function makePrompt() {
    wordIndex = Math.floor(Math.random()*6)
    colorIndex = Math.floor(Math.random()*6)
    if(wordIndex!=colorIndex){
        document.getElementById("prompt-text").innerHTML = colorNames[wordIndex]
        document.getElementById("prompt-text").style.color = rgbValues[colorIndex]
    } else {
        makePrompt()
    }
    

}

//Generate choices
function generate(){
    var randArr = []
    randArr.push(colorIndex)

    var beforeOrAfter = Math.floor(Math.random()*2)
    if(beforeOrAfter==0){
        randArr.unshift(wordIndex)
    } else {randArr.push(wordIndex)}

    for(let i=0; randArr.length<4; i++){
        var secondBeforeOrAfter = Math.floor(Math.random()*2)
        var index = Math.floor(Math.random()*6)
        for(let j=0; randArr.length<4; j++){
            if(randArr[j]==index){
                break
            } else if (randArr[j]==undefined){
                if(secondBeforeOrAfter==0){
                    randArr.unshift(index)
                    break
                } else {
                    randArr.push(index)
                    break
                }
            }
        }
        
    }

    document.getElementById("first-button").innerHTML = colorNames[randArr[0]]
    document.getElementById("second-button").innerHTML = colorNames[randArr[1]]
    document.getElementById("third-button").innerHTML = colorNames[randArr[2]]
    document.getElementById("fourth-button").innerHTML = colorNames[randArr[3]]
    
}

//Check if selected answer is correct, then change score and question
function validate(clickId){

    if((clickId.textContent==colorNames[colorIndex])==true){
        correctAnswers++
    } else {incorrectAnswers++}
    totalQuestions++

    document.getElementById("question-number").innerHTML = "Question Number: " + totalQuestions
    document.getElementById("correct").innerHTML = "Correct answers: " + correctAnswers
    document.getElementById("incorrect").innerHTML = "Incorrect answers: " + incorrectAnswers
    makePrompt()
    generate()

    if (totalQuestions>20){
        document.getElementById("question-number").style.display = "none"
        document.getElementById("question-interface").style.display = "none"
        document.getElementById("results-screen").style.display = "block"
    }
}

//Return to title when game ends
function reset(){
    document.getElementById("title-screen").style.display="block"
    document.getElementById("question-number").style.display = "none"
    document.getElementById("question-interface").style.display = "none"
    document.getElementById("results-screen").style.display = "none"
}

window.addEventListener('DOMContentLoaded', (event) => {
    makePrompt()
    generate()
    totalQuestions = 1
    correctAnswers = 0
    incorrectAnswers = 0
    document.getElementById("question-number").innerHTML = "Question Number: " + totalQuestions
    document.getElementById("correct").innerHTML = "Correct answers: " + correctAnswers
    document.getElementById("incorrect").innerHTML = "Incorrect answers: " + incorrectAnswers
})

//
//  BACKEND-SPECIFIC FUNCTIONS BELOW THIS COMMENT
//
const previousAttempt = document.getElementById("previous-attempt");

backendButton.addEventListener("click", function() {
    fetch('http://0.0.0.0:8000/session', {method: 'POST'})
    .then(function (response) {
        return response.json();
    })
    .then(function (json) {
        const sessionId = json.session_id;
        sessionIdText.innerHTML = sessionId;
    })
})

setNameButton.addEventListener("click", function() {
    const usernameData = {"player_username": nameInput.value};
    fetch('http://0.0.0.0:8000/setName', 
    {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usernameData),
    }
    )
    .then(function (response) {
        return response.json();
    })
    .then(function (json) {
        const playerUsername = json.player_name;
        nameText.innerHTML = playerUsername;
    })
})

startButton.addEventListener("click", function() {
    if(sessionIdText.innerHTML!=""&&sessionIdText.innerHTML==sessionIdInput.value){
        startGame();
    } else {window.alert("Invalid session ID")}
})

submitScoreButton.addEventListener("click", function() {
    const playerData = {'player_name': nameText.innerHTML, 'final_score': correctAnswers};
    console.log(playerData)
    fetch('http://0.0.0.0:8000/score', 
    {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerData),
    }
    )
    .then(function (response) {
        return response.json();
    })
    .then(function (json) {
        const playerUsername = json.player_name;
        const playerScore = json.final_score;
        message = "Previous attempt: " + playerUsername + " with " + playerScore + " points!";
        previousAttempt.innerHTML = message
    })
})
