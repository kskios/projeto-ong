// ========================================
// FORMULÁRIO DE CADASTRO
// MÁSCARAS E VALIDAÇÕES
// ========================================

const formulario = document.getElementById("cadastroForm");

const campoData = document.getElementById("dataNascimento");
const campoCPF = document.getElementById("cpf");
const campoTelefone = document.getElementById("telefone");
const campoCEP = document.getElementById("cep");


// ========================================
// MÁSCARA DE DATA DE NASCIMENTO
// Formato: DD/MM/AAAA
// ========================================

campoData.addEventListener("input", function () {

    let valor = campoData.value.replace(/\D/g, "");

    if (valor.length > 8) {
        valor = valor.substring(0, 8);
    }

    if (valor.length > 4) {

        valor =
            valor.substring(0, 2) +
            "/" +
            valor.substring(2, 4) +
            "/" +
            valor.substring(4);

    } else if (valor.length > 2) {

        valor =
            valor.substring(0, 2) +
            "/" +
            valor.substring(2);

    }

    campoData.value = valor;

});


// ========================================
// MÁSCARA DE CPF
// Formato: 000.000.000-00
// ========================================

campoCPF.addEventListener("input", function () {

    let valor = campoCPF.value.replace(/\D/g, "");

    if (valor.length > 11) {
        valor = valor.substring(0, 11);
    }

    if (valor.length > 9) {

        valor =
            valor.substring(0, 3) +
            "." +
            valor.substring(3, 6) +
            "." +
            valor.substring(6, 9) +
            "-" +
            valor.substring(9);

    } else if (valor.length > 6) {

        valor =
            valor.substring(0, 3) +
            "." +
            valor.substring(3, 6) +
            "." +
            valor.substring(6);

    } else if (valor.length > 3) {

        valor =
            valor.substring(0, 3) +
            "." +
            valor.substring(3);

    }

    campoCPF.value = valor;

});


// ========================================
// MÁSCARA DE TELEFONE
// Formato: (00) 00000-0000
// ========================================

campoTelefone.addEventListener("input", function () {

    let valor = campoTelefone.value.replace(/\D/g, "");

    if (valor.length > 11) {
        valor = valor.substring(0, 11);
    }

    if (valor.length > 7) {

        valor =
            "(" +
            valor.substring(0, 2) +
            ") " +
            valor.substring(2, 7) +
            "-" +
            valor.substring(7);

    } else if (valor.length > 2) {

        valor =
            "(" +
            valor.substring(0, 2) +
            ") " +
            valor.substring(2);

    } else if (valor.length > 0) {

        valor = "(" + valor;

    }

    campoTelefone.value = valor;

});


// ========================================
// MÁSCARA DE CEP
// Formato: 00000-000
// ========================================

campoCEP.addEventListener("input", function () {

    let valor = campoCEP.value.replace(/\D/g, "");

    if (valor.length > 8) {
        valor = valor.substring(0, 8);
    }

    if (valor.length > 5) {

        valor =
            valor.substring(0, 5) +
            "-" +
            valor.substring(5);

    }

    campoCEP.value = valor;

});


// ========================================
// VALIDAÇÃO MATEMÁTICA DO CPF
// ========================================

function validarCPF(cpf) {

    cpf = cpf.replace(/\D/g, "");

    // CPF precisa ter exatamente 11 dígitos
    if (cpf.length !== 11) {
        return false;
    }

    // Impede CPFs formados apenas pelo mesmo número
    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }


    // ====================================
    // PRIMEIRO DÍGITO VERIFICADOR
    // ====================================

    let soma = 0;

    for (let i = 0; i < 9; i++) {

        soma += parseInt(cpf.charAt(i)) * (10 - i);

    }

    let resto = soma % 11;

    let primeiroDigito = resto < 2 ? 0 : 11 - resto;


    if (primeiroDigito !== parseInt(cpf.charAt(9))) {
        return false;
    }


    // ====================================
    // SEGUNDO DÍGITO VERIFICADOR
    // ====================================

    soma = 0;

    for (let i = 0; i < 10; i++) {

        soma += parseInt(cpf.charAt(i)) * (11 - i);

    }

    resto = soma % 11;

    let segundoDigito = resto < 2 ? 0 : 11 - resto;


    if (segundoDigito !== parseInt(cpf.charAt(10))) {
        return false;
    }


    return true;

}


// ========================================
// VALIDAÇÃO DA DATA
// ========================================

function validarData(data) {

    const partes = data.split("/");

    if (partes.length !== 3) {
        return false;
    }

    const dia = parseInt(partes[0]);
    const mes = parseInt(partes[1]);
    const ano = parseInt(partes[2]);

    if (
        isNaN(dia) ||
        isNaN(mes) ||
        isNaN(ano)
    ) {
        return false;
    }

    if (ano < 1900 || ano > new Date().getFullYear()) {
        return false;
    }

    if (mes < 1 || mes > 12) {
        return false;
    }

    const dataValida = new Date(ano, mes - 1, dia);

    if (
        dataValida.getFullYear() !== ano ||
        dataValida.getMonth() !== mes - 1 ||
        dataValida.getDate() !== dia
    ) {
        return false;
    }

    return true;

}


// ========================================
// VALIDAÇÃO DO TELEFONE
// ========================================

function validarTelefone(telefone) {

    const numeros = telefone.replace(/\D/g, "");

    return numeros.length === 11;

}


// ========================================
// VALIDAÇÃO DO CEP
// ========================================

function validarCEP(cep) {

    const numeros = cep.replace(/\D/g, "");

    return numeros.length === 8;

}


// ========================================
// ENVIO DO FORMULÁRIO
// ========================================

formulario.addEventListener("submit", function (evento) {

    evento.preventDefault();


    // ====================================
    // VALIDAÇÃO DO CPF
    // ====================================

    if (!validarCPF(campoCPF.value)) {

        alert("CPF inválido. Digite um CPF válido.");

        campoCPF.focus();

        return;

    }


    // ====================================
    // VALIDAÇÃO DA DATA
    // ====================================

    if (!validarData(campoData.value)) {

        alert(
            "Data de nascimento inválida. " +
            "Utilize o formato DD/MM/AAAA."
        );

        campoData.focus();

        return;

    }


    // ====================================
    // VALIDAÇÃO DO TELEFONE
    // ====================================

    if (!validarTelefone(campoTelefone.value)) {

        alert(
            "Telefone inválido. " +
            "Digite um telefone com DDD."
        );

        campoTelefone.focus();

        return;

    }


    // ====================================
    // VALIDAÇÃO DO CEP
    // ====================================

    if (!validarCEP(campoCEP.value)) {

        alert(
            "CEP inválido. " +
            "Utilize o formato 00000-000."
        );

        campoCEP.focus();

        return;

    }


    // ====================================
    // FORMULÁRIO VÁLIDO
    // ====================================

    alert(
        "Cadastro realizado com sucesso!"
    );

    formulario.reset();

});