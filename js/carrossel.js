const projetos = [
    {
        titulo: "Ações Comunitárias",
        descricao: "Realizamos ações comunitárias com voluntários para apoiar pessoas em situação de vulnerabilidade.",
        imagem: "../img/entrega-alimentos1.jpg",
        textoAlternativo: "Grupo de voluntários reunidos durante uma ação comunitária"
    },
    {
        titulo: "Entrega de Alimentos",
        descricao: "Organizamos campanhas de arrecadação e distribuição de alimentos para famílias que precisam de apoio.",
        imagem: "../img/entrega-alimentos2.jpg",
        textoAlternativo: "Voluntários realizando entrega de alimentos para a comunidade"
    },
    {
        titulo: "Campanhas de Solidariedade",
        descricao: "Nossas campanhas mobilizam voluntários e doadores para levar recursos essenciais à comunidade.",
        imagem: "../img/entrega-alimentos3.jpg",
        textoAlternativo: "Voluntários distribuindo alimentos e água durante uma ação social"
    }
];

let slideAtual = 0;
let inicializado = false;

function criarBotao(rotulo, classe, texto) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = classe;
    botao.setAttribute("aria-label", rotulo);
    botao.textContent = texto;
    return botao;
}

function atualizarSlide(indice) {
    const slides = document.querySelectorAll(".projeto-slide");
    const indicadores = document.querySelectorAll(".indicador");

    if (slides.length === 0) {
        return;
    }

    slideAtual = (indice + slides.length) % slides.length;
    slides.forEach((slide, posicao) => {
        const ativo = posicao === slideAtual;
        slide.classList.toggle("ativo", ativo);
        slide.setAttribute("aria-hidden", String(!ativo));
    });
    indicadores.forEach((indicador, posicao) => {
        const ativo = posicao === slideAtual;
        indicador.classList.toggle("ativo", ativo);
        indicador.setAttribute("aria-pressed", String(ativo));
    });
}

export function renderizarCarrossel() {
    const carrossel = document.querySelector(".carrossel");
    const indicadores = document.querySelector(".indicadores");

    if (!carrossel || !indicadores) {
        return;
    }

    const conteudo = document.createDocumentFragment();
    conteudo.append(criarBotao("Projeto anterior", "seta esquerda", "\u276E"));
    projetos.forEach((projeto) => {
        const slide = document.createElement("article");
        slide.className = "projeto-slide";

        const imagem = document.createElement("img");
        imagem.src = projeto.imagem;
        imagem.alt = projeto.textoAlternativo;

        const informacoes = document.createElement("div");
        informacoes.className = "projeto-info";

        const titulo = document.createElement("h3");
        titulo.textContent = projeto.titulo;

        const descricao = document.createElement("p");
        descricao.textContent = projeto.descricao;
        informacoes.append(titulo, descricao);
        slide.append(imagem, informacoes);
        conteudo.append(slide);
    });
    conteudo.append(criarBotao("Próximo projeto", "seta direita", "\u276F"));
    carrossel.replaceChildren(conteudo);

    const botoesIndicadores = projetos.map((projeto, indice) => {
        const indicador = document.createElement("button");
        indicador.type = "button";
        indicador.className = "indicador";
        indicador.dataset.slide = String(indice);
        indicador.setAttribute("aria-label", `Ir para ${projeto.titulo}`);
        return indicador;
    });
    indicadores.replaceChildren(...botoesIndicadores);
    atualizarSlide(0);
}

function aoClicarNoCarrossel(evento) {
    if (!(evento.target instanceof Element)) {
        return;
    }

    const controle = evento.target.closest(".carrossel button, .indicadores button");
    if (!controle) {
        return;
    }

    if (controle.classList.contains("esquerda")) {
        atualizarSlide(slideAtual - 1);
    } else if (controle.classList.contains("direita")) {
        atualizarSlide(slideAtual + 1);
    } else if (controle.dataset.slide !== undefined) {
        atualizarSlide(Number(controle.dataset.slide));
    }
}

export function inicializarCarrossel() {
    if (inicializado) {
        return;
    }

    document.addEventListener("click", aoClicarNoCarrossel);
    inicializado = true;
}
