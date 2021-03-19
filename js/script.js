let indexed = document.querySelector('#index');

let question = document.querySelector('.question');
let answers = document.querySelectorAll('.list-group-item');

let resultQuestion = document.querySelector('.resultQuestion');
let yourResults = document.querySelector('.yourResults');
let result = document.querySelectorAll('.result');

let list = document.querySelector('.list');

let start = document.querySelector('.startQuiz')
let startButton = document.querySelector('.start')
let setBar = document.querySelector('.setBar')

let results = document.querySelector('.results');
let userScorePoint = document.querySelector('.userScorePoint');
let average = document.querySelector('.average')

let pointsElem = document.querySelector('.score');
let restart = document.querySelector('.restart');
let index = 0;
let points = 0;
let counter = 0;
let averageValue = 0;
let timer = 10;
let currentElement = null;
let currentTimer = timer;
let myVar;
let yourAnswers= [];

fetch('https://quiztai.herokuapp.com/api/quiz')
    .then(resp => resp.json())
    .then(resp => {
        preQuestions = resp;



        preQuestions.forEach(function (value,key){
            console.log(value,key)
            resultQuestion.innerHTML = value.question;
            result[0].innerHTML= value.answers[0];
            result[1].innerHTML= value.answers[1];
            result[2].innerHTML= value.answers[2];
            result[3].innerHTML= value.answers[3];
        })


        startButton.addEventListener('click', function () {
            start.style.display = "none";
            list.style.display = 'block';
            loadNextQuestion()
        })


        function next() {
            if (index+1 >= preQuestions.length) {
            console.log("koniec")
                clearInterval(myVar);
                cleanMark();
                //TODO
                list.style.display = 'none';
                results.style.display = 'block';
                userScorePoint.innerHTML = points;

                    if (localStorage.getItem("average") === null) {
                        counter++ //1
                        localStorage.setItem("points", points)
                        localStorage.setItem("counter", counter.toString())
                        localStorage.setItem("average", points)
                        average.innerText = points
                    } else {
                        let counterTemp = localStorage.getItem("counter")
                        counter = counterTemp
                        counter++ //2
                        localStorage.setItem("counter", counter.toString())
                        let localAverage = localStorage.getItem("average"); //5
                        averageValue = (parseFloat(localAverage) + points) / counter
                        localStorage.setItem("average", averageValue.toString())
                        average.innerText = averageValue
                        console.log(counter)
                        console.log(localAverage)
                        console.log(points)
                    }
                    // localStorage.removeItem("points")
                    // localStorage.removeItem("average")
                    // localStorage.removeItem("counter")



            } else {
                index++
                setQuestion(index)
                cleanMark();
                currentTimer = timer;
                if (index >= preQuestions.length) {
                    clearInterval(myVar);
                }
            }
        }

        function loadNextQuestion() {
            let temp1 = 100 / timer;
            setQuestion(index)

            myVar = setInterval(function () {
                if (currentTimer < 5){
                    setBar.style.backgroundColor= '#c41a21';
                }
                currentTimer--
                let temp2 = temp1 * currentTimer;
                setBar.style.width = temp2 + '%';
                if (currentTimer === 0) {
                    yourAnswers.push('0')
                    next();
                }
            }, 1000);
        }

        function setQuestion(index) {
            setBar.style.backgroundColor= 'blue';

            setBar.style.width = '100%';

            indexed.innerText = index + 1;
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
            activateAnswers();
        }

        function activateAnswers() {
            for (let i = 0; i < answers.length; i++) {
                answers[i].addEventListener('click', doAction);
            }
        }


        function doAction(event) {
            if (event.target.innerHTML === preQuestions[index].correct_answer) {
                points++;
                pointsElem.innerText = points;
                markCorrect(event.target);
            } else {
                markInCorrect(event.target);
            }
            yourAnswers.push(event.target.innerHTML)
            console.log(yourAnswers);
            disableAnswers();
            next();
        }

        function cleanMark() {
            if (currentElement !== null) {
                currentElement.classList.remove('correct');
                currentElement.classList.remove('incorrect');
            }
        }

        function disableAnswers() {
            for (let i = 0; i < answers.length; i++) {
                answers[i].removeEventListener('click', doAction);
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

        restart.addEventListener('click', function (event) {
            event.preventDefault();
            index = 0;
            points = 0;
            let userScorePoint = document.querySelector('.score');
            userScorePoint.innerHTML = points;
            loadNextQuestion()
            list.style.display = 'block';
            results.style.display = 'none';
        });


    });
