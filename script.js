const main = document.querySelector('main');
const loadingPacman = document.querySelector('.pacman-loading');
console.log(loadingPacman);

let newQuizz = {
	title: "",
	image: "",
	questions: [],
	levels: []
}

function openCreateQuizz() {
    stopLoading();

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
        window.scrollTo(0, 0)
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
        window.scrollTo(0, 0)
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
    
    if (isValid) {
        isValid = levelsMinValues.includes('0')
    }

    if (isValid) {
        exportQuizz(newQuizz);

        main.innerText = `loading...`;

    } else {
        document.querySelector('#errorAlert').innerHTML = 'Preencha os dados corretamente!';
        window.scrollTo(0, 0)
    }
}

function rendersQuizzes() {
    startLoading();
    
    getUserQuizzes();

    const promisse = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");

    promisse.then(loadsQuizzes);
    promisse.catch((erro) => console.log("deu erro ao renderizar" + erro));
}

let quizzesList;

function loadsQuizzes(resposta) {
    stopLoading();

    const ulQuizzesList = document.querySelector(".all-quizzes-list");
    const ulYourQuizzesList = document.querySelector(".your-quizzes-list");

    quizzesList = resposta.data;
    
    let userQuizzCounter = userQuizzesId.length - 1;

    for (let i = 0; i < quizzesList.length; i++) {
        if (userQuizzesId.length != 0) {
            if (quizzesList[i].id === userQuizzesId[userQuizzCounter]) {
                if (userQuizzesId[userQuizzesId.length - 1] === quizzesList[i].id){
                    ulYourQuizzesList.previousElementSibling.remove();
                    ulYourQuizzesList.previousElementSibling.remove();
                    ulYourQuizzesList.parentElement.classList.remove("your-quizzes");
                    ulYourQuizzesList.parentElement.classList.add("your-quizzes-updated");

                    ulYourQuizzesList.innerHTML = `
                    <div class="your-quizzes-title">
                        <h1>Seus Quizzes</h1>
                        <ion-icon onclick="openCreateQuizz()" name="add-circle"></ion-icon>
                    </div>
                    
                    `; 
                }

                ulYourQuizzesList.innerHTML += `

                <div class="container-your-individual-quizz">
                    <li class="quizz ${quizzesList[i].id}" onclick="abreQuizz(this)">
                        <img src="${quizzesList[i].image}" alt="thumbnail do quizz">
                        <span>${quizzesList[i].title}</span>
                        <div class="sombra-quizz"></div>
                    </li>
                    <div class="container-edit-delete">
                            <ion-icon name="create-outline" onclick="alert()"></ion-icon>
                            <ion-icon name="trash-outline"></ion-icon>
                    </div>
                </div>
                
                
                `; 
                
                userQuizzCounter--;
              }
        }
            
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
    startLoading();

    const promisseNewQuizz = axios.post(
        "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes",
        newQuizzToExport);
        
        promisseNewQuizz.then(successQuizzExportation); // 
        promisseNewQuizz.catch((erro) => console.log("deu erro ao eviar quizz" + erro));    
}
    
function successQuizzExportation(response) {
    stopLoading();

    getUserQuizzes();

    const quizzJustCreated = response.data.id;
    console.log(quizzJustCreated);
    userQuizzesId.push(quizzJustCreated);
    localStorage.setItem("id", JSON.stringify(`${userQuizzesId}`));

    main.innerHTML = `
    <div class="quizz-creation">
        <h2>Seu quizz está pronto!</h2>
        
        <li class="quizz ${quizzJustCreated}">
        <img src="${newQuizz.image}" alt="quizz background">
        <span>${newQuizz.title}</span>
        <div class="sombra-quizz"></div>
        </li>
        
        <button onclick="abreQuizz(document.querySelector('.quizz'))">Acessar Quizz</button>
        <div class="go-home" onclick="reloadPage()">Voltar pra home </div>
        
    </div>
    `;
}
    
function reloadPage() {
    window.location.reload();
}

let userQuizzesId = [];

function getUserQuizzes() {
    if (localStorage.getItem("id") === null) {
        userQuizzesId = [];

    } else {
        let userQuizzesIdString = "[" + localStorage.getItem("id").replaceAll(`"`, ``) + "]";
        userQuizzesId = JSON.parse(userQuizzesIdString);
    }
}

function abreQuizz(quizzzClicado) {
    quizzClicado = quizzzClicado

    main.innerHTML = "";
    
    idDoQuizz = quizzClicado.classList[1];

    startLoading();
            
    const promessa = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idDoQuizz}`);
    
    promessa.then((resposta) => {
        stopLoading();

        const quizzRecebido = resposta.data;
        const perguntas = quizzRecebido.questions;
        const chamadaGeraPergunta = geraPergunta(perguntas)
        const htmlPerguntas = chamadaGeraPergunta[0];
        const infoDasPerguntas = chamadaGeraPergunta[1];

        main.innerHTML += `
        <section class="quizz-clicado">
        <header class="thumbnaill-quizz-clicado">
        <img src="${quizzRecebido.image}" alt="thumbnail do quizz"> 
        <span>${quizzRecebido.title}</span>
        <div class="sombra-thumb"></div>
        </header>
        ${htmlPerguntas}
        </section>
        `
        
        coloreTitulo(infoDasPerguntas);
        resultadoLevels = quizzRecebido.levels
    })
}

function geraPergunta(listaDePerguntas) {
    let html = "";
    let infDasPerguntas = [];
    let contador = 0;
    for (let i = 0; i < listaDePerguntas.length; i++) {
        contador++;
        
        infDasPerguntas.push({etiqueta: `pergunta${contador}`, cor: listaDePerguntas[i].color});
        
        const arrayDeRespostas = listaDePerguntas[i].answers.map((resposta) => {    
            // o que vem de listaDePerguntas[i].answers não é um array exatamente, não aceita o sort
            return resposta;
        });
        const respostasSorteadas = arrayDeRespostas.sort(() => {return Math.random() - 0.5;});
        
        const htmlRespostas = geraListaDeRespostas(respostasSorteadas);

        html += `
        <section class="pergunta">
            <header class="titulo-pergunta ${infDasPerguntas[i].etiqueta}">
                <span>${listaDePerguntas[i].title}</span>
            </header>       
            <ul class="respostas ul${marcadorDeUl}" onclick="marcaPClicada(this)">
                ${htmlRespostas}
            </ul> 
        </section>
        `
    }

    return [html, infDasPerguntas]
    
}

let infUlRespostas = [];
let marcadorDeUl = 0;
let contador = 1;
let qtdDeAcertos = 0;
let resultadoLevels = [];
let quizzClicado = null;


function geraListaDeRespostas (respostas) {
    let infRespostas = [];
    
    let htmlDasLi = "";
    for (let i = 0; i < respostas.length; i++) {

        htmlDasLi += `           
            <li class="resposta li${i}" onclick="selecionaResposta(this)">
                <img src="${respostas[i].image}" alt="imagem da resposta">
                <span>${respostas[i].text}</span>
                <div class="sombra-resposta hidden"></div>
            </li>
        `;

        infRespostas.push({
            idResposta: i,
            ehCorreta: respostas[i].isCorrectAnswer
        })
    }
    marcadorDeUl++

    infUlRespostas.push({
        idDaUl: marcadorDeUl,
        infRespostas
    })

    return htmlDasLi
}

function coloreTitulo (infoDasPerguntas) {
    for (let i = 0; i < infoDasPerguntas.length; i++) {
        const tituloDaPergunta = document.querySelector(`.${infoDasPerguntas[i].etiqueta}`);
        tituloDaPergunta.style.backgroundColor = infoDasPerguntas[i].cor;
    }
}

function marcaPClicada(elPergunta) {
    const naoFoiClicada = !elPergunta.classList.contains("✔️");

    if (naoFoiClicada) {

        elPergunta.classList.add("respondida");
        
        const identificador = parseInt(elPergunta.classList[1].slice(-1)); 
        //pega o número em "ulxxx" classe do elemento, o que sai realmente é uma string, por isso dois iguais abaixo

        let i = 0;
        while(identificador !== infUlRespostas[i].idDaUl){
            i++;
        }

        const informacoesDaLi = infUlRespostas[i].infRespostas;

        for (let j = 0; j < informacoesDaLi.length; j++) {
            const liResposta = document.querySelector(`.ul${identificador} .li${informacoesDaLi[j].idResposta}`);
            //percorre todas as li's da ulPergunta clicada
            const spanDaLi = liResposta.children[1];

            if(informacoesDaLi[j].ehCorreta === true) {
                spanDaLi.style.color = "#009C22"; 
            } else {
                spanDaLi.style.color = "#FF0B0B"; 
            }   
        }
        //Daqui pra cima ela marca a pergunta clicada com as cores devidas nos spans, daqui pra baixo ela cuida de scrollar pra próxima pergunta e de testar se já é hora de exibir a tela final
        
        const proximaPergunta = document.querySelector(`.pergunta${identificador + 1}`);
        
        const primeiraVez = contador === 1;

            setTimeout(() => 
            {
                respondidas = document.querySelectorAll(".✔️");
                
                const todasRespondidas = infUlRespostas.length === respondidas.length;
    
                const ultimaPerguntaClicada = document.querySelector(".quizz-clicado").lastElementChild.lastElementChild.classList.contains("✔️");

                if (!todasRespondidas && proximaPergunta !== null) {
                    setTimeout(() => {
                        proximaPergunta.parentElement.scrollIntoView();
                    }, 2000); 
        
                }else if(!todasRespondidas){
                    alert("Responda todas as perguntas para ver o seu resultado!")
                } else if (primeiraVez && ultimaPerguntaClicada) {

                    poeTelaFinal(qtdDeAcertos);
                        
                    contador++;
                }
            }, 0.0000002);
        
    } else {
        console.log("já foi clicada")
    }
}

function selecionaResposta(resposta) {
    const ulNaoFoiClicada = !resposta.parentElement.classList.contains("✔️");

    if (ulNaoFoiClicada) {
        resposta.classList.add("selecionada");

        setTimeout(() => {
            //selecionaResposta precisa esperar pra que a marcaPClicada cumpra sua tarefa se não o elemento pesquisado abaixo não será encontrado
            const perguntaResposdida = document.querySelector(".respondida"); 
            
            const respostas = perguntaResposdida.children;

            for (let i = 0; i < respostas.length; i++) {
                const sombraResposta = respostas[i].lastElementChild;
                
                const ehASelecionada = respostas[i].classList.contains("selecionada");

                if(!ehASelecionada) {
                    sombraResposta.classList.remove("hidden");
                }
                
            }
            resposta.classList.remove("selecionada");
            perguntaResposdida.classList.remove("respondida");
            perguntaResposdida.classList.add("✔️");

        }, 0)


        marcaAcerto(resposta);
    }
}

function marcaAcerto(respostaClicada) {
    console.log(respostaClicada)
    const identificaUl = parseInt(respostaClicada.parentElement.classList[1].slice(-1));
    const identificaLi = parseInt(respostaClicada.classList[1].slice(-1));

    let i = 0;
    while (identificaUl !== infUlRespostas[i].idDaUl) {
        i++;
    }
    
    let j = 0;
    while (identificaLi !== infUlRespostas[i].infRespostas[j].idResposta) {
        j++
    }

    const acertou = infUlRespostas[i].infRespostas[j].ehCorreta === true

    if (acertou) {
        qtdDeAcertos++;
    }
}

function poeTelaFinal(qtdDeAcertos) {
    const porcentagemDeAcerto = Math.round((qtdDeAcertos/infUlRespostas.length)*100);

    for (let i = resultadoLevels.length-1; i >= 0; i--) {
        if (porcentagemDeAcerto >= resultadoLevels[i].minValue) {
            
        main.innerHTML += `
            <section class="resultado-quizz">
                <header class="titulo-resultado">
                    <span>${porcentagemDeAcerto}% de acerto: ${resultadoLevels[i].title}</span>
                </header>
                <img src="${resultadoLevels[i].image}" alt="mensagem de resultado">
                <p>${resultadoLevels[i].text}</p>
            </section>
            <section class="opcoes-continuacao">
                <button class="reinicia" onclick="reiniciaQuizz()">Reiniciar Quizz</button>
                <button class="home" onclick="reloadPage()">Voltar pra home</button>
            </section>
        `

        const telaDeResultado = document.querySelector(".titulo-resultado");
        setTimeout(() => {
            telaDeResultado.parentElement.scrollIntoView();
        }, 2000); 

        return
        }
    }
}

function reiniciaQuizz() {
    infUlRespostas = [];
    marcadorDeUl = 0;
    contador = 1;
    qtdDeAcertos = 0;
    resultadoLevels = [];

    perguntasResposndidas = document.querySelectorAll(".✔️")
    for (let i = 0; i < perguntasResposndidas.length; i++) {
        perguntasResposndidas[i].classList.remove("✔️");
    }
    abreQuizz(quizzClicado)
    const topo = document.querySelector("header");
    topo.scrollIntoView()
}

function startLoading() {
    main.classList.add("display-none");
    loadingPacman.classList.remove("display-none");
}

function stopLoading() {
    loadingPacman.classList.add("display-none");
    main.classList.remove("display-none");
}



rendersQuizzes();
