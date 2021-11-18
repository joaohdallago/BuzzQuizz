const main = document.querySelector('main');

function openCreateQuizz() {
    main.innerHTML = `
    <div class="quizz-creation">
        <h2>Comece pelo começo</h2>

        <form>
            <input type="text" placeholder="Título do seu quizz">
            <input type="text" placeholder="URL da imagem do seu quizz">
            <input type="text" placeholder="Quantidade de perguntas do quizz">
            <input type="text" placeholder="Quantidade de níveis do quizz">
        </form>

        <button>Prosseguir pra criar perguntas</button>
    </div>
    `
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