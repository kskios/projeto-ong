let inicializado = false;

function abrirModal() {
    const modal = document.getElementById("modal-login");
    if (modal && !modal.open) {
        modal.showModal();
    }
}

function fecharModal() {
    const modal = document.getElementById("modal-login");
    if (modal?.open) {
        modal.close();
    }
}

function aoClicar(evento) {
    if (!(evento.target instanceof Element)) {
        return;
    }
    if (evento.target.closest(".botao-login")) {
        abrirModal();
    } else if (evento.target.closest(".fechar-modal")) {
        fecharModal();
    } else if (evento.target.matches("#modal-login")) {
        fecharModal();
    }
}

function aoEnviar(evento) {
    const formulario = evento.target;
    if (!(formulario instanceof HTMLFormElement) || !formulario.matches("#login-form")) {
        return;
    }

    evento.preventDefault();
    formulario.querySelector(".mensagem-login").textContent =
        "O acesso ainda não está disponível. Nenhuma informação foi enviada ou salva.";
}

function aoPressionarTecla(evento) {
    if (evento.key === "Escape") {
        const modal = document.getElementById("modal-login");
        if (modal?.open) {
            evento.preventDefault();
            fecharModal();
        }
    }
}

function aoFechar() {
    const formulario = document.getElementById("login-form");
    formulario?.reset();
    formulario?.querySelector(".mensagem-login")?.replaceChildren();
}

export function inicializarLogin() {
    if (inicializado) {
        return;
    }

    document.addEventListener("click", aoClicar);
    document.addEventListener("submit", aoEnviar);
    document.addEventListener("keydown", aoPressionarTecla);
    document.getElementById("modal-login")?.addEventListener("close", aoFechar);
    inicializado = true;
}
