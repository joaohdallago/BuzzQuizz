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

    if (isValid) {
        let levelsString = '';

        for (let i=0; i < newQuizz.levels.length; i++) {
            levelsString += `
                <form>
                    <header>
                        <h3>Nível ${i + 1}</h3>
                        <ion-icon name="create-outline" onclick="editQuestion(this)"></ion-icon>
                    </header>
                    
                    <div class="display-none">
                        <div>
                            <input type="text" id="levelTitle" placeholder="Título do nível">
                            <input type="text" id="levelMinValue" placeholder="% de acerto mínima">
                            <input type="text" id="levelImg" placeholder="URL da imagem do nível">
                            <textarea type="text" id="levelDescription" placeholder="Descrição do nível"></textarea>
                        </div>
                    </div>
                </form>
            `
        }

        main.innerHTML = `
            <div class="quizz-creation">
            <h2>Agora, decida os níveis!</h2>

            <div class="container-questions">
                <span id="errorAlert"></span>
                ${levelsString}
            </div>

            <button onclick="finishQuizz()">Finalizar Quizz</button>
        </div>
        `;
    } else {
        document.querySelector('#errorAlert').innerHTML = 'Preencha os dados corretamente!';
    }
}

function finishQuizz() {
    const levels = document.querySelectorAll("form");

    let isValid = true

    newQuizz.levels = [];
    let levelsMinValues = [];
    levels.forEach(
        level => {
            const levelData = {
                    title: level.querySelector('#levelTitle').value,
                    image: level.querySelector('#levelImg').value,
                    text: level.querySelector('#levelDescription').value,
                    minValue: level.querySelector('#levelMinValue').value
                }

                levelsMinValues.push(levelData.minValue)

            newQuizz.levels.push(levelData);

            if (
                levelData.title.length < 10 ||
                levelData.minValue < 0 ||
                levelData.minValue > 100 ||
                !isValidURL(levelData.image) ||
                levelData.text.length < 30
            ) {
                isValid = false;
            }
        }
    )
    
    isValid = levelsMinValues.includes('0')

    if (isValid) {
        console.log(newQuizz);

        exportQuizz(newQuizz);

        main.innerText = `
        loading...
    `;

    } else {
        document.querySelector('#errorAlert').innerHTML = 'Preencha os dados corretamente!';
    }
}

function rendersQuizzes() {
    const promisse = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");

    promisse.then(loadsQuizzes);
    promisse.catch((erro) => console.log("deu erro ao renderizar" + erro));
}

rendersQuizzes()

function loadsQuizzes(resposta) {
    const ulQuizzesList = document.querySelector(".all-quizzes-list");
    const quizzesList = resposta.data;

    // console.log(quizzesList)
    
    for (let i = 0; i < quizzesList.length; i++) {
        console.log("tentou")
        ulQuizzesList.innerHTML += `
            <li class="quizz ${quizzesList[i].id}" onclick="abreQuizz(this)">
                <img src="${quizzesList[i].image}" alt="thumbnail do quizz">
                <span>${quizzesList[i].title}</span>
                <div class="sombra-quizz"></div>
            </li>
        `; 
    }
}

function exportQuizz(newQuizzToExport) {
    const promisseNewQuizz = axios.post(
        "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes",
        newQuizzToExport);

    promisseNewQuizz.then(successQuizzExportation); // 
    promisseNewQuizz.catch((erro) => console.log("deu erro ao eviar quizz" + erro));

}

function successQuizzExportation() {
    main.innerHTML = `
        <div class="quizz-creation">
            <h2>Seu quizz está pronto!</h2>

            <li class="quizz">
                <img src="${newQuizz.image}" alt="quizz background">
                <span>${newQuizz.title}</span>
            </li>

            <button onclick="goToQuizz()">Acessar Quizz</button>
            <div class="go-home" onclick="reloadPage()">Voltar pra home </div>

        </div>
    `;
}

function reloadPage() {
    window.location.reload();
}

// function goToQuizz() {

// }

function abreQuizz(quizzClicado) {
    main.innerHTML = "";
    
    const idDoQuizz = quizzClicado.classList[1];

    const promessa = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idDoQuizz}`);

    promessa.then((resposta) => {
        const quizzRecebido = resposta.data;
        const perguntas = quizzRecebido.questions;
        const htmlPerguntas = geraPergunta(perguntas);
        // console.log(htmlPerguntas)

        main.innerHTML += `
            <section class="quizz-clicado">
                <header class="thumbnaill-quizz-clicado">
                    <img src="${quizzRecebido.image}" alt="thumbnail do quizz"> 
                    <span>${quizzRecebido.title}</span>
                    <div class="sombra-thumb"></div>
                </header>
            ${htmlPerguntas}
        `
    })
}

function geraPergunta(listaDePerguntas) {
    let html = "";

    for (let i = 0; i < listaDePerguntas.length; i++) {
        const respostas = listaDePerguntas[i].answers;
        const htmlRespostas = geraListaDeRespostas(respostas);
        html += `
        <section class="pergunta">
            <header class="titulo-pergunta">
                <span>${listaDePerguntas[i].title}</span>
            </header>       
            <ul class="respostas">
                ${htmlRespostas}
            </ul> 
        </section>
        ` 
    }
    return html

}

function geraListaDeRespostas (respostas) {
    let htmlDasLi = "";
    for (let i = 0; i < respostas.length; i++) {
        htmlDasLi += `           
                <li class="resposta">
                    <img src="${respostas[i].image}" alt="imagem da resposta">
                    <span>${respostas[i].text}</span>
                </li>
        `;
    }
    return htmlDasLi
}

rendersQuizzes();
