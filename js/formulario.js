import { lerJSON, salvarJSON } from "./storage.js";

const CHAVE_CADASTROS = "maos-que-transformam-cadastros";
let inicializado = false;

function validarCPF(valor) {
    const cpf = valor.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let soma = 0;
    for (let indice = 0; indice < 9; indice += 1) {
        soma += Number(cpf.charAt(indice)) * (10 - indice);
    }
    const primeiroDigito = (soma * 10) % 11 % 10;
    if (primeiroDigito !== Number(cpf.charAt(9))) {
        return false;
    }

    soma = 0;
    for (let indice = 0; indice < 10; indice += 1) {
        soma += Number(cpf.charAt(indice)) * (11 - indice);
    }
    const segundoDigito = (soma * 10) % 11 % 10;
    return segundoDigito === Number(cpf.charAt(10));
}

function validarData(valor) {
    const partes = valor.split("/");
    if (partes.length !== 3) {
        return false;
    }

    const [dia, mes, ano] = partes.map(Number);
    if (
        !Number.isInteger(dia) ||
        !Number.isInteger(mes) ||
        !Number.isInteger(ano) ||
        ano < 1900 ||
        ano > new Date().getFullYear() ||
        mes < 1 ||
        mes > 12
    ) {
        return false;
    }

    const data = new Date(ano, mes - 1, dia);
    return data.getFullYear() === ano &&
        data.getMonth() === mes - 1 &&
        data.getDate() === dia;
}

function mascararCampo(campo) {
    let digitos = campo.value.replace(/\D/g, "");

    if (campo.name === "dataNascimento") {
        digitos = digitos.slice(0, 8);
        campo.value = digitos.replace(
            /^(\d{2})(\d{0,2})(\d{0,4}).*/,
            (_, dia, mes, ano) => [dia, mes, ano].filter(Boolean).join("/")
        );
    } else if (campo.name === "cpf") {
        digitos = digitos.slice(0, 11);
        campo.value = digitos
            .replace(/^(\d{3})(\d)/, "$1.$2")
            .replace(/^(\d{3}\.\d{3})(\d)/, "$1.$2")
            .replace(/^(\d{3}\.\d{3}\.\d{3})(\d)/, "$1-$2");
    } else if (campo.name === "telefone") {
        digitos = digitos.slice(0, 11);
        campo.value = digitos
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2");
    } else if (campo.name === "cep") {
        digitos = digitos.slice(0, 8);
        campo.value = digitos.replace(/^(\d{5})(\d)/, "$1-$2");
    }
}

function obterMensagemErro(campo) {
    const valor = campo.value.trim();
    if (campo.required && !valor) {
        return "Este campo é obrigatório.";
    }
    if (campo.name === "cpf" && !validarCPF(valor)) {
        return "Digite um CPF válido.";
    }
    if (campo.name === "dataNascimento" && !validarData(valor)) {
        return "Digite uma data real no formato DD/MM/AAAA.";
    }
    if (campo.name === "telefone" && valor.replace(/\D/g, "").length !== 11) {
        return "Digite um telefone válido com DDD.";
    }
    if (campo.name === "cep" && valor.replace(/\D/g, "").length !== 8) {
        return "Digite um CEP válido.";
    }
    if (!campo.validity.valid) {
        if (campo.validity.typeMismatch) {
            return "Digite um e-mail válido.";
        }
        if (campo.validity.tooShort) {
            return `Digite pelo menos ${campo.minLength} caracteres.`;
        }
        return "Confira o formato informado.";
    }
    return "";
}

function validarCampo(campo) {
    const mensagem = obterMensagemErro(campo);
    const idMensagem = `${campo.id}-erro`;
    let elementoMensagem = document.getElementById(idMensagem);

    if (!elementoMensagem) {
        elementoMensagem = document.createElement("span");
        elementoMensagem.id = idMensagem;
        elementoMensagem.className = "mensagem-erro";
        elementoMensagem.setAttribute("aria-live", "polite");
        campo.insertAdjacentElement("afterend", elementoMensagem);
    }

    elementoMensagem.textContent = mensagem;
    campo.classList.toggle("campo-invalido", Boolean(mensagem));
    campo.classList.toggle("campo-valido", !mensagem && Boolean(campo.value.trim()));
    campo.setAttribute("aria-invalid", String(Boolean(mensagem)));
    if (mensagem) {
        campo.setAttribute("aria-describedby", idMensagem);
    } else {
        campo.removeAttribute("aria-describedby");
    }
    return !mensagem;
}

function limparValidacao(campo) {
    document.getElementById(`${campo.id}-erro`)?.remove();
    campo.classList.remove("campo-invalido", "campo-valido");
    campo.removeAttribute("aria-invalid");
    campo.removeAttribute("aria-describedby");
}

function lerCadastrosSalvos() {
    const resultado = lerJSON(CHAVE_CADASTROS);
    if (!resultado.ok) {
        return {
            cadastros: [],
            erro: resultado.error === "invalid-json"
                ? "Os cadastros salvos estão em um formato inválido e não foram alterados."
                : "Não foi possível acessar o armazenamento local deste navegador."
        };
    }
    if (resultado.value === null) {
        return { cadastros: [], erro: "" };
    }

    const formatoValido =
        Array.isArray(resultado.value) &&
        resultado.value.every((cadastro) =>
            cadastro &&
            typeof cadastro.nome === "string" &&
            typeof cadastro.email === "string" &&
            typeof cadastro.telefone === "string"
        );
    return formatoValido
        ? { cadastros: resultado.value, erro: "" }
        : {
            cadastros: [],
            erro: "Os cadastros salvos estão em um formato inválido e não foram alterados."
        };
}

export function renderizarCadastros() {
    const lista = document.getElementById("lista-cadastros");
    const feedback = document.getElementById("cadastros-feedback");
    if (!lista || !feedback) {
        return;
    }

    const resultado = lerCadastrosSalvos();
    lista.replaceChildren();
    feedback.classList.toggle("status-erro", Boolean(resultado.erro));
    if (resultado.erro) {
        feedback.textContent = resultado.erro;
        return;
    }
    if (resultado.cadastros.length === 0) {
        feedback.textContent = "Nenhum cadastro salvo ainda.";
        return;
    }

    feedback.textContent =
        `${resultado.cadastros.length} cadastro(s) salvo(s) neste navegador.`;
    resultado.cadastros.forEach((cadastro) => {
        const item = document.createElement("li");
        const nome = document.createElement("strong");
        nome.textContent = cadastro.nome;
        item.append(
            nome,
            document.createTextNode(` — ${cadastro.email} — ${cadastro.telefone}`)
        );
        lista.append(item);
    });
}

function salvarCadastro(cadastro) {
    const resultado = lerCadastrosSalvos();
    if (resultado.erro) {
        return resultado.erro;
    }

    const gravacao = salvarJSON(CHAVE_CADASTROS, [
        cadastro,
        ...resultado.cadastros
    ]);
    if (!gravacao.ok) {
        return "Não foi possível salvar o cadastro no armazenamento local. Seus dados continuam no formulário.";
    }
    renderizarCadastros();
    return "";
}

function definirFeedback(formulario, mensagem, erro = false) {
    const feedback = formulario.querySelector("#form-feedback");
    feedback.textContent = mensagem;
    feedback.classList.toggle("status-erro", erro);
    feedback.classList.toggle("status-sucesso", !erro);
}

function aoDigitar(evento) {
    const campo = evento.target;
    if (!(campo instanceof HTMLInputElement) || !campo.form?.matches("#cadastroForm")) {
        return;
    }

    mascararCampo(campo);
    if (campo.getAttribute("aria-invalid") === "true") {
        validarCampo(campo);
    }
}

function aoSairDoCampo(evento) {
    const campo = evento.target;
    if (campo instanceof HTMLInputElement && campo.form?.matches("#cadastroForm")) {
        validarCampo(campo);
    }
}

function aoEnviarFormulario(evento) {
    const formulario = evento.target;
    if (!(formulario instanceof HTMLFormElement) || !formulario.matches("#cadastroForm")) {
        return;
    }

    evento.preventDefault();
    const campos = Array.from(formulario.querySelectorAll("input"));
    const camposInvalidos = campos.filter((campo) => !validarCampo(campo));
    if (camposInvalidos.length > 0) {
        definirFeedback(
            formulario,
            "Revise os campos destacados antes de enviar o cadastro.",
            true
        );
        camposInvalidos[0].focus();
        return;
    }

    const cadastro = {
        nome: formulario.elements.namedItem("nome").value.trim(),
        email: formulario.elements.namedItem("email").value.trim(),
        telefone: formulario.elements.namedItem("telefone").value.trim()
    };
    const erro = salvarCadastro(cadastro);
    if (erro) {
        renderizarCadastros();
        definirFeedback(formulario, erro, true);
        return;
    }

    formulario.reset();
    campos.forEach(limparValidacao);
    definirFeedback(formulario, "Cadastro salvo neste navegador.");
}

export function inicializarFormulario() {
    if (inicializado) {
        return;
    }
    document.addEventListener("input", aoDigitar);
    document.addEventListener("focusout", aoSairDoCampo);
    document.addEventListener("submit", aoEnviarFormulario);
    inicializado = true;
}
