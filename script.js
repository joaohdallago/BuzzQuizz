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