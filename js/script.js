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
let tresc_diva= '';

fetch('https://quiztai.herokuapp.com/api/quiz')
    .then(resp => resp.json())
    .then(resp => {
        preQuestions = resp;


        function show(){
            preQuestions.forEach(function (value,key){
                console.log(key)
                tresc_diva = tresc_diva +
                    '<ul class="list-group mb-5">'+
                    '<li class="list-group-item list-group-item-warning resultQuestion">'+ value.question +'</li>';
                if(value.answers[0] === value.correct_answer && yourAnswers[key] !== "0") tresc_diva = tresc_diva +
                    '<li class="list-group-item list-group-item-success result">'+value.answers[0]+'</li>';
                if(value.answers[0] !== value.correct_answer && value.answers[0] !==  yourAnswers[key]  || yourAnswers[key] === "0"  ) tresc_diva = tresc_diva +
                    '<li class="list-group-item list-group-item-dark result">'+value.answers[0]+'</li>';
                if(value.answers[0] ===  yourAnswers[key] && value.answers[0] !== value.correct_answer ) tresc_diva = tresc_diva +
                    '<li class="list-group-item list-group-item-danger result">'+value.answers[0]+'</li>';
                if(value.answers[1] === value.correct_answer && yourAnswers[key] !== "0") tresc_diva = tresc_diva +
                    '<li class="list-group-item list-group-item-success  result">'+value.answers[1]+'</li>';
                if(value.answers[1] !== value.correct_answer && value.answers[1] !==  yourAnswers[key] || yourAnswers[key] === "0" ) tresc_diva = tresc_diva +
                    '<li class="list-group-item list-group-item-dark result">'+value.answers[1]+'</li>';
                if(value.answers[1] ===  yourAnswers[key] && value.answers[1] !== value.correct_answer ) tresc_diva = tresc_diva +
                    '<li class="list-group-item list-group-item-danger result">'+value.answers[1]+'</li>';
                        if(value.answers.length === 2)  tresc_diva = tresc_diva + '</ul>';
                if(value.answers[2] === value.correct_answer && value.answers.length > 2 && yourAnswers[key] !== "0") tresc_diva = tresc_diva +
                    '<li class="list-group-item list-group-item-success result">'+value.answers[2]+'</li>';
                if(value.answers[2] !== value.correct_answer && value.answers[2] !==  yourAnswers[key] && value.answers.length > 2 || yourAnswers[key] === "0" ) tresc_diva = tresc_diva +
                    '<li class="list-group-item list-group-item-dark result">'+value.answers[2]+'</li>';
                if(value.answers[2] ===  yourAnswers[key] && value.answers[2] !== value.correct_answer ) tresc_diva = tresc_diva +
                    '<li class="list-group-item list-group-item-danger result">'+value.answers[2]+'</li>';
                if(value.answers[3] === value.correct_answer  && value.answers.length > 2 && yourAnswers[key] !== "0") tresc_diva = tresc_diva +
                    '<li class="list-group-item list-group-item-success result">'+value.answers[3]+'</li>'+ '</ul>';;
                if(value.answers[3] !== value.correct_answer && value.answers[3] !==  yourAnswers[key] && value.answers.length > 2 || yourAnswers[key] === "0" ) tresc_diva = tresc_diva +
                    '<li class="list-group-item list-group-item-dark result">'+value.answers[3]+'</li>'+ '</ul>';
                if(value.answers[3] ===  yourAnswers[key]  && value.answers[3] !== value.correct_answer) tresc_diva = tresc_diva +
                    '<li class="list-group-item list-group-item-danger result">'+value.answers[3]+'</li>'+ '</ul>';
            })

            yourResults.innerHTML = tresc_diva;

        }




        startButton.addEventListener('click', function () {
            start.style.display = "none";
            list.style.display = 'block';
            loadNextQuestion()
        })


        function next() {
            if (index+1 >= preQuestions.length) {
                show();
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
            yourResults.innerHTML = '';
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
