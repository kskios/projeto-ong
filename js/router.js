const rotas = {
    "index.html": "Início - Mãos que Transformam",
    "projetos.html": "Projetos - Mãos que Transformam",
    "cadastro.html": "Cadastro - Mãos que Transformam"
};

let inicializado = false;
let aoNavegar = () => {};

function obterRota(url) {
    const arquivo = url.pathname.split("/").pop().toLowerCase();
    return Object.hasOwn(rotas, arquivo) ? arquivo : null;
}

function atualizarNavegacao(arquivo) {
    document.querySelectorAll("#menu-principal a").forEach((link) => {
        const rota = obterRota(new URL(link.href, window.location.href));
        if (rota === arquivo) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

function definirMenuFechado() {
    const botao = document.querySelector(".botao-menu");
    const menu = document.getElementById("menu-principal");
    if (!botao || !menu) {
        return;
    }

    botao.setAttribute("aria-expanded", "false");
    botao.setAttribute("aria-label", "Abrir menu de navegação");
    menu.classList.remove("menu-aberto");
}

function alternarMenu() {
    const botao = document.querySelector(".botao-menu");
    const menu = document.getElementById("menu-principal");
    if (!botao || !menu) {
        return;
    }

    const aberto = botao.getAttribute("aria-expanded") !== "true";
    botao.setAttribute("aria-expanded", String(aberto));
    botao.setAttribute(
        "aria-label",
        aberto ? "Fechar menu de navegação" : "Abrir menu de navegação"
    );
    menu.classList.toggle("menu-aberto", aberto);
}

async function carregarRota(url, arquivo, adicionarHistorico) {
    const principal = document.getElementById("app-main");
    try {
        const resposta = await fetch(url.href, {
            headers: { Accept: "text/html" }
        });
        if (!resposta.ok) {
            throw new Error(`A página solicitada respondeu com status ${resposta.status}.`);
        }

        const documento = new DOMParser().parseFromString(
            await resposta.text(),
            "text/html"
        );
        const novoPrincipal = documento.getElementById("app-main");
        if (!novoPrincipal) {
            throw new Error("A página solicitada não contém a área principal esperada.");
        }

        if (adicionarHistorico) {
            window.history.pushState({ arquivo }, "", url.href);
        }
        principal.replaceChildren(
            ...Array.from(novoPrincipal.childNodes, (no) =>
                document.importNode(no, true)
            )
        );
        document.title = documento.title || rotas[arquivo];
        atualizarNavegacao(arquivo);
        aoNavegar();
        principal.focus();
        window.scrollTo(0, 0);
    } catch (erro) {
        const mensagem = document.createElement("p");
        mensagem.className = "status-erro";
        mensagem.setAttribute("role", "alert");
        mensagem.textContent =
            `Não foi possível carregar esta página. ${erro.message}`;
        principal.replaceChildren(mensagem);
    }
}

function aoClicarEmLink(evento) {
    if (!(evento.target instanceof Element)) {
        return;
    }
    if (evento.target.closest(".botao-menu")) {
        alternarMenu();
        return;
    }

    const link = evento.target.closest("a[href]");
    if (
        !link ||
        evento.button !== 0 ||
        evento.metaKey ||
        evento.ctrlKey ||
        evento.shiftKey ||
        evento.altKey ||
        link.hasAttribute("download") ||
        (link.target && link.target.toLowerCase() !== "_self") ||
        link.relList.contains("external")
    ) {
        return;
    }

    const url = new URL(link.href, window.location.href);
    if (
        !["http:", "https:"].includes(url.protocol) ||
        url.origin !== window.location.origin ||
        url.search ||
        url.hash
    ) {
        return;
    }

    const arquivo = obterRota(url);
    if (!arquivo || url.pathname === window.location.pathname) {
        return;
    }
    evento.preventDefault();
    definirMenuFechado();
    carregarRota(url, arquivo, true);
}

function aoVoltarOuAvancar() {
    const url = new URL(window.location.href);
    const arquivo = obterRota(url);
    if (!arquivo) {
        return;
    }
    definirMenuFechado();
    carregarRota(url, arquivo, false);
}

export function inicializarRouter(opcoes = {}) {
    if (inicializado) {
        return;
    }
    aoNavegar = typeof opcoes.aoNavegar === "function"
        ? opcoes.aoNavegar
        : () => {};
    document.addEventListener("click", aoClicarEmLink);
    window.addEventListener("popstate", aoVoltarOuAvancar);
    inicializado = true;

    const rotaInicial = obterRota(new URL(window.location.href));
    if (rotaInicial) {
        atualizarNavegacao(rotaInicial);
        aoNavegar();
    } else {
        const inicio = new URL("index.html", window.location.href);
        window.history.replaceState({ arquivo: "index.html" }, "", inicio.href);
        carregarRota(inicio, "index.html", false);
    }
}
