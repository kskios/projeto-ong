import { lerItem, salvarItem } from "./storage.js";

const CHAVE_TEMA = "maos-tema";
let inicializado = false;

function atualizarControle(tema) {
    const botao = document.querySelector(".botao-tema");
    if (!botao) {
        return;
    }

    const escuro = tema === "escuro";
    botao.setAttribute("aria-label", escuro ? "Ativar tema claro" : "Ativar tema escuro");
    botao.querySelector(".icone-tema").textContent = escuro ? "☀" : "☾";
    botao.querySelector(".rotulo-tema").textContent = escuro ? "Tema claro" : "Tema escuro";
}

function definirTema(tema) {
    document.documentElement.dataset.tema = tema;
    atualizarControle(tema);
}

function anunciarFalhaDePersistencia() {
    const anuncio = document.querySelector(".anuncio-acessivel");
    if (anuncio) {
        anuncio.textContent = "O tema foi alterado, mas não será lembrado após fechar a página.";
    }
}

function alternarTema() {
    const atual = document.documentElement.dataset.tema;
    const proximo = atual === "escuro" ? "claro" : "escuro";
    definirTema(proximo);

    if (!salvarItem(CHAVE_TEMA, proximo).ok) {
        anunciarFalhaDePersistencia();
    }
}

function aoClicarNoTema(evento) {
    if (evento.target instanceof Element && evento.target.closest(".botao-tema")) {
        alternarTema();
    }
}

export function inicializarTema() {
    const resultado = lerItem(CHAVE_TEMA);
    const temaSalvo = resultado.ok ? resultado.value : null;
    definirTema(temaSalvo === "escuro" ? "escuro" : "claro");

    if (!resultado.ok) {
        anunciarFalhaDePersistencia();
    }

    if (!inicializado) {
        document.addEventListener("click", aoClicarNoTema);
        inicializado = true;
    }
}
