# Mãos que Transformam

Site institucional de uma organização não governamental (ONG), desenvolvido como projeto acadêmico. A aplicação tem como objetivo apresentar a missão da organização, divulgar projetos sociais e disponibilizar uma interface de cadastro, com foco em usabilidade, acessibilidade e organização do código.

## Objetivos do projeto

- Apresentar a identidade e a missão da ONG.
- Divulgar projetos e iniciativas sociais.
- Disponibilizar formulários com validação.
- Oferecer temas claro e escuro, com preferência salva no navegador.
- Aplicar boas práticas de desenvolvimento, versionamento e acessibilidade.

## Tecnologias utilizadas

- **HTML5:** estrutura e organização semântica das páginas.
- **CSS3:** estilização, identidade visual e responsividade.
- **JavaScript ES6:** interatividade e manipulação do DOM.
- **ES6 Modules:** separação de responsabilidades por meio de `import` e `export`.
- **Bootstrap 5.3.3:** apoio à construção da interface.
- **localStorage:** persistência da preferência de tema.
- **Git e GitHub:** controle de versão e gerenciamento do código.

## Estrutura do projeto

```text
projeto-ong/
├── html/
│   ├── index.html
│   ├── projetos.html
│   └── cadastro.html
├── css/
│   └── style.css
├── img/
├── js/
│   ├── main.js
│   ├── router.js
│   ├── formulario.js
│   ├── storage.js
│   ├── tema.js
│   ├── carrossel.js
│   └── login.js
├── .gitignore
└── README.md
```

### Responsabilidade dos módulos JavaScript

- `main.js`: inicialização da aplicação.
- `router.js`: navegação SPA e gerenciamento do histórico.
- `formulario.js`: máscaras e validações dos formulários.
- `storage.js`: operações de armazenamento no navegador.
- `tema.js`: alternância e persistência dos temas.
- `carrossel.js`: navegação pelos projetos apresentados.
- `login.js`: comportamento do modal demonstrativo de login.

## Requisitos

- Git instalado para clonar o repositório.
- Python 3 instalado ou outro servidor HTTP local.
- Navegador atualizado.
- Conexão com a internet para carregar o Bootstrap pelo CDN.

## Instalação e execução local

Clone o repositório:

```bash
git clone https://github.com/kskios/projeto-ong.git
```

Entre na pasta do projeto:

```bash
cd projeto-ong
```

Inicie um servidor HTTP local:

```bash
py -m http.server 8000
```

Se o comando `py` não estiver disponível, tente:

```bash
python -m http.server 8000
```

Abra o endereço abaixo no navegador:

http://localhost:8000/html/

Mantenha o terminal aberto enquanto utilizar a aplicação. Para encerrar o servidor, pressione `Ctrl+C`.

## Funcionalidades

- Navegação entre as páginas do site.
- Apresentação de projetos sociais por meio de carrossel.
- Formulário com máscaras e validações.
- Alternância entre tema claro e escuro.
- Persistência da preferência de tema por meio do `localStorage`.
- Modal de login exclusivamente demonstrativo, sem autenticação real.

## Testes e validação

O projeto deve ser verificado quanto a:

- Funcionamento da navegação e do histórico do navegador.
- Carregamento das imagens, estilos e módulos JavaScript.
- Validação dos formulários e apresentação das mensagens de erro.
- Persistência do tema após recarregar a página.
- Funcionamento em diferentes tamanhos de tela.
- Navegação por teclado, foco visível, contraste e textos alternativos.
- Ausência de erros no console do navegador.

A conformidade com WCAG 2.1 nível AA deve ser avaliada por meio de verificações técnicas e testes de acessibilidade, não sendo presumida apenas pela existência desses recursos.

## Controle de versão

O projeto utiliza Git e GitHub para registrar alterações e manter o histórico de desenvolvimento.

A organização de branches segue como referência o GitFlow:

- `main`: versão estável do projeto.
- `develop`: integração das alterações.
- `feature/nome-da-funcionalidade`: desenvolvimento de funcionalidades específicas.
- `hotfix/nome-da-correcao`: correções urgentes na versão estável, quando necessárias.

As mensagens de commit seguem o padrão Conventional Commits, utilizando prefixos como `feat`, `fix` e `refactor`.

Pull Requests são utilizados para documentar e revisar alterações antes da integração entre branches.

## Segurança e privacidade

O login disponível é apenas demonstrativo e não realiza autenticação. Senhas e credenciais não devem ser armazenadas no navegador.

A persistência local é utilizada para a preferência visual. Dados pessoais eventualmente tratados pelos formulários devem ser avaliados conforme os princípios de necessidade, finalidade e transparência.

## Publicação

A aplicação pode ser publicada em um serviço de hospedagem compatível com HTML, CSS e JavaScript estáticos. Após o deploy, devem ser testados os caminhos dos arquivos, a navegação SPA, os recursos externos e o funcionamento das páginas no endereço público.

## Manutenção

Para contribuir com o projeto, crie uma branch específica para a alteração, implemente a funcionalidade, execute os testes pertinentes e registre as mudanças com uma mensagem de commit clara. Antes da integração, revise o diff e documente eventuais alterações relevantes.

## Autor e finalidade

Projeto desenvolvido para fins acadêmicos, com foco na aplicação prática de desenvolvimento front-end, modularização JavaScript, controle de versão, acessibilidade e preparação para publicação.