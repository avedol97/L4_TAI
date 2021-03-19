let next = document.querySelector('.next');
let previous = document.querySelector('.previous')
let indexed = document.querySelector('#index');

let question = document.querySelector('.question');
let answers = document.querySelectorAll('.list-group-item');

let list = document.querySelector('.list');
let results = document.querySelector('.results');
let userScorePoint = document.querySelector('.userScorePoint');
let average = document.querySelector('.average')

let pointsElem = document.querySelector('.score');
let restart = document.querySelector('.restart');
let index = 0;
let points = 0;
let currentElement = null;
let counter = 0;
let averageValue = 0;

fetch('https://quiztai.herokuapp.com/api/quiz')
    .then(resp => resp.json())
    .then(resp => {
        preQuestions = resp;

setQuestion(index);

function cleanMark(){
    if(currentElement !== null){
        currentElement.classList.remove('correct');
        currentElement.classList.remove('incorrect');
    }
}

function markCorrect(elem) {
    currentElement = elem;
    elem.classList.add('correct');
}

function markInCorrect(elem) {
    currentElement = elem;
    elem.classList.add('incorrect');
}

function disableAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].removeEventListener('click', doAction);
    }
}

function activateAnswers(){
    for (let i = 0; i < answers.length; i++) {
        answers[i].addEventListener('click', doAction);
    }
}

function doAction(event) {
    if (event.target.innerHTML === preQuestions[index].correct_answer) {
        points++;
        pointsElem.innerText = points;
        markCorrect(event.target);
    }
    else {
        markInCorrect(event.target);
    }
    disableAnswers();
}

function setQuestion(index){
    activateAnswers();
    indexed.innerText = index+1;
    question.innerHTML = preQuestions[index].question;

    answers[0].innerHTML = preQuestions[index].answers[0];
    answers[1].innerHTML = preQuestions[index].answers[1];
    answers[2].innerHTML = preQuestions[index].answers[2];
    answers[3].innerHTML = preQuestions[index].answers[3];

    if (preQuestions[index].answers.length === 2) {
        answers[2].style.display = 'none';
        answers[3].style.display = 'none';
    } else {
        answers[2].style.display = 'block';
        answers[3].style.display = 'block';
    }
}


next.addEventListener('click', function () {
    index++;
    if (index >= preQuestions.length) {

        if(localStorage.getItem("average") === null){
            counter++
            localStorage.setItem("points",points)
            localStorage.setItem("counter",counter.toString())
            localStorage.setItem("average",points)
            average.innerText = points
        }else {
            let counterTemp = localStorage.getItem("counter")
            counter = counterTemp
            counter++
            localStorage.setItem("counter",counter.toString())
            let localAverage = localStorage.getItem("average");
            averageValue = (localAverage+points)/counter
            localStorage.setItem("average",averageValue.toString())
            average.innerText = averageValue
            console.log(counter)
            console.log(localAverage)
            console.log(points)
        }
        // localStorage.removeItem("points")
        // localStorage.removeItem("average")
        // localStorage.removeItem("counter")
        list.style.display = 'none';
        results.style.display = 'block';
        userScorePoint.innerHTML = points;
    } else {
        setQuestion(index);
        cleanMark();
    }
});


previous.addEventListener('click',function (){
    if(index <= 0){
        index=0;
        return;
    }
    index--;
    setQuestion(index);
    cleanMark();
    disableAnswers();
})

restart.addEventListener('click', function (event) {
    event.preventDefault();

    index = 0;
    points = 0;
    let userScorePoint = document.querySelector('.score');
    userScorePoint.innerHTML = points;
    setQuestion(index);
    activateAnswers();
    list.style.display = 'block';
    results.style.display = 'none';
});

    });
