const main = document.querySelector('main');

let newQuizz = {
	title: "",
	image: "",
	questions: [],
	levels: []
}

function openCreateQuizz() {
    main.innerHTML = `
    <div class="quizz-creation">
        <h2>Comece pelo começo</h2>

        <div>
            <span id="errorAlert"></span>
            <form>
                <input type="text" id="newQuizzTitle" placeholder="Título do seu quizz">
                <input type="text" id="newQuizzImg" placeholder="URL da imagem do seu quizz">
                <input type="text" id="newQuizzQuestionsQty" placeholder="Quantidade de perguntas do quizz">
                <input type="text" id="newQuizzLevelsQty" placeholder="Quantidade de níveis do quizz">
            </form>
        </div>

        <button onclick="proceedToCreateQuestions()">Prosseguir pra criar perguntas</button>
    </div>
    `
};

function isValidURL(str) {
    const regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    return regex.test(str)
};

function proceedToCreateQuestions() {
    newQuizz.title = document.querySelector('#newQuizzTitle').value;
    newQuizz.image = document.querySelector('#newQuizzImg').value;

    newQuizz.questions = [];
    for (let i=0; i < document.querySelector('#newQuizzQuestionsQty').value; i++) {
        newQuizz.questions.push({})
    };

    newQuizz.levels = [];
    for (let i=0; i < document.querySelector('#newQuizzLevelsQty').value; i++) {
        newQuizz.levels.push({})
    };

    const isValid = {
        title: (newQuizz.title.length >= 20) && (newQuizz.title.length <= 65),
        img: isValidURL(newQuizz.image),
        questionsQty: newQuizz.questions.length >= 3,
        levelsQty: newQuizz.levels.length >= 2
    };

    if (
        isValid.title &&
        isValid.img &&
        isValid.questionsQty &&
        isValid.levelsQty
    ) {
        let questionsString = '';

        for (let i=0; i < newQuizz.questions.length; i++) {
            questionsString += `
                <form>
                    <header>
                        <h3>Pergunta ${i + 1}</h3>
                        <ion-icon name="create-outline" onclick="editQuestion(this)"></ion-icon>
                    </header>
                    
                    <div class="display-none">
                        <div>
                            <input type="text" id="questionTitle" placeholder="Texto da pergunta">
                            <input type="text" id="questionColor" placeholder="Cor de fundo da pergunta">
                        </div>

                        <div class="answer">
                            <h3>Resposta correta</h3>
                            <input type="text" id="answerText" placeholder="Resposta correta">
                            <input type="text" id="answerImg" placeholder="URL da imagem">
                        </div>

                        <div>
                            <div class="answer">
                                <h3>Respostas incorretas</h3>
                                <input type="text" id="answerText" placeholder="Resposta incorreta 1">
                                <input type="text" id="answerImg" placeholder="URL da imagem 1">
                            </div>

                            <div class="answer">
                                <input type="text" id="answerText" placeholder="Resposta incorreta 2">
                                <input type="text" id="answerImg" placeholder="URL da imagem 2">
                            </div>

                            <div class="answer">
                                <input type="text" id="answerText" placeholder="Resposta incorreta 3">
                                <input type="text" id="answerImg" placeholder="URL da imagem 3">
                            </div>
                        </div>
                    </div>
                </form>
            `
        }

        main.innerHTML = `
            <div class="quizz-creation">
            <h2>Crie suas perguntas</h2>

            <div class="container-questions">
                <span id="errorAlert"></span>
                ${questionsString}
            </div>

            <button onclick="proceedToCreateLevels()">Prosseguir pra criar níveis</button>
        </div>
        `;
    } else {
        document.querySelector('#errorAlert').innerHTML = 'Preencha os dados corretamente!';
    };
};

function editQuestion(icon) {
    icon.parentElement.nextElementSibling.classList.toggle('display-none')
}

function proceedToCreateLevels() {
    const questions = document.querySelectorAll("form")

    newQuizz.questions = [];

    let isValid = true;

    questions.forEach(
        question => {
            const questionData = {
                title: question.querySelector('#questionTitle').value,
                color: question.querySelector('#questionColor').value,
                answers: []
            }
    
            const answers = question.querySelectorAll('.answer');
            
            answers.forEach(
                answer => {
                    const answerData = {
                        text: answer.querySelector('#answerText').value,
                        image: answer.querySelector('#answerImg').value,
                        isCorrectAnswer: (answer.querySelector('#answerText').placeholder === 'Resposta correta')
                    }

                    if (
                        answerData.text.length > 0 &&
                        isValidURL(answerData.image) 
                    ) {
                        questionData.answers.push(answerData);
                    }
                }
            )

            if (
                questionData.title.length < 20 ||
                !(/^#[0-9A-F]{6}$/i.test(questionData.color)) ||
                questionData.answers.length < 2
            ) {
                isValid = false;
            } 

            //conferir se existe uma resposta correta
            if (isValid) {
                try {
                    isValid = questionData.answers[0].isCorrectAnswer;
                }
                catch {
                    isValid = false;
                }
            }
            
            newQuizz.questions.push(questionData);
        }
    )

    console.log(newQuizz)
    console.log(isValid)

    if (isValid) {
        console.log('BOA PORRA')
    } else {
        document.querySelector('#errorAlert').innerHTML = 'Preencha os dados corretamente!';
    }
}

function rendersQuizzes() {
    const promisse = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");

    promisse.then(loadsQuizzes);
    promisse.catch((erro) => console.log("deu erro ao renderizar" + erro));
}

function loadsQuizzes(resposta) {
    const ulQuizzesList = document.querySelector(".all-quizzes-list");
    const quizzesList = resposta.data;

    console.log(quizzesList)
    
    for (let i = 0; i < quizzesList.length; i++) {
        console.log("tentou")
        ulQuizzesList.innerHTML += `
            <li class="quizz">
                <img src="${quizzesList[i].image}" alt="quizz background">
                <span>${quizzesList[i].title}</span>
            </li>
        `; 
    }
}

rendersQuizzes()
