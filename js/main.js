import { inicializarCarrossel, renderizarCarrossel } from "./carrossel.js";
import { inicializarFormulario, renderizarCadastros } from "./formulario.js";
import { inicializarLogin } from "./login.js";
import { inicializarRouter } from "./router.js";
import { inicializarTema } from "./tema.js";

function inicializarConteudoDaPagina() {
    renderizarCarrossel();
    renderizarCadastros();
}

function inicializarAplicacao() {
    inicializarTema();
    inicializarLogin();
    inicializarCarrossel();
    inicializarFormulario();
    inicializarRouter({ aoNavegar: inicializarConteudoDaPagina });
}

inicializarAplicacao();
