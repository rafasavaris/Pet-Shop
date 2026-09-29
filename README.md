# Pet Shop Web

Sistema Web para gerenciamento de agendamentos de serviços de banho e tosa em um Pet Shop. 

Projeto desenvolvido como **Trabalho 1 da disciplina de Programação Web**.

## Tecnologias utilizadas

* **Node.js** — ambiente de execução do servidor
* **Express** — criação do servidor e gerenciamento das rotas
* **Express Handlebars** — renderização das páginas HTML
* **MongoDB** — banco de dados
* **MongoDB Compass** — ferramenta gráfica para visualização e gerenciamento do banco
* **Docker** — execução do MongoDB em container
* **HTML/CSS** — estrutura e estilização das páginas
* **JavaScript** — lógica do servidor e interação com o sistema

## Estrutura do projeto

```text
pet-shop/
│
├── node_modules/
│
├── public/
│   ├── css/
│   │   └── style.css
│   │
│   └── images/
│       └── favicon.ico
│
├── views/
│   ├── admin/
│   │   ├── adminHome.handlebars
│   │   ├── ajustaAgenda.handlebars
│   │   └── listaAgenda.handlebars
│   │
│   ├── cliente/
│   │   ├── agendamento.handlebars
│   │   └── verAgenda.handlebars
│   │
│   ├── layouts/
│   │   └── main.handlebars
│   │
│   └── public/
|       └── index.handlebars
│
├── .gitignore
├── app.js
├── mongodb.js
├── package.json
├── package-lock.json
└── README.md
```

### Principais arquivos e diretórios

* `app.js` — arquivo principal da aplicação, responsável pela configuração do servidor, rotas e lógica da aplicação;
* `mongodb.js` — responsável pela conexão com o MongoDB;
* `views/` — contém as páginas da aplicação utilizando Handlebars;
* `views/admin/` — páginas destinadas ao administrador do Pet Shop;
* `views/cliente/` — páginas utilizadas pelos clientes;
* `views/layouts/` — layout principal compartilhado pelas páginas;
* `views/public/` — página inicial, visivel a todos;
* `public/` — arquivos estáticos, como CSS e imagens;
* `.gitignore` — arquivos e diretórios que não devem ser enviados ao Git;
* `package.json` — dependências e configurações do projeto;

## Funcionalidades

O sistema possui funcionalidades para:

* configurar os horários disponíveis para atendimento;
* consultar a agenda do Pet Shop;
* realizar agendamentos;
* consultar agendamentos realizados;
* cadastrar informações do cliente;
* cadastrar informações do pet;
* consultar e gerenciar os agendamentos pela área administrativa.

## Banco de dados

O projeto utiliza **MongoDB** como banco de dados.

O banco utilizado pela aplicação é:

```text
petshop
```

As principais coleções utilizadas são:

```text
petshop
├── clientes
├── agenda
└── agendamentos
```

### Coleção `agenda`

Armazena as configurações de disponibilidade da agenda, como os horários e as capacidades de atendimento.

### Coleção `agendamentos`

Armazena os agendamentos realizados, incluindo informações do cliente, pet, serviço, data e horário.

## Como executar

### 1. Clonar o repositório

```bash
git clone https://github.com/rafasavaris/Pet-Shop.git
cd Pet-Shop
```

### 2. Instalar as dependências

Dentro da pasta do projeto, execute:

```bash
npm install
```

Esse comando instala as dependências definidas no `package.json`.

### 3. Iniciar o MongoDB

O MongoDB deve estar em execução antes de iniciar o servidor Node.js.

Neste projeto, o MongoDB é executado em um container Docker chamado `meu-mongo`.

Para iniciar o container:

```bash
docker start meu-mongo
```

Para verificar se o container está em execução:

```bash
docker ps
```

O MongoDB utilizado pelo projeto está disponível na porta:

```text
50000
```

> O MongoDB e o servidor Node.js são processos independentes. O MongoDB precisa estar em execução para que a aplicação consiga acessar o banco de dados.

### 4. Conectar ao MongoDB pelo MongoDB Compass

O **MongoDB Compass** pode ser utilizado para visualizar e gerenciar o banco de dados graficamente.

Com o container do MongoDB em execução, abra o MongoDB Compass e utilize a seguinte URI:

```text
mongodb://localhost:50000
```

Depois da conexão, o banco utilizado pela aplicação será:

```text
petshop
```

As coleções utilizadas pelo sistema são:

```text
agenda
agendamentos
```

O Compass pode ser utilizado durante o desenvolvimento para:

* visualizar os documentos armazenados;
* verificar os agendamentos realizados;
* consultar os clientes cadastrados;
* verificar as configurações da agenda;
* acompanhar as alterações realizadas no banco.

### 5. Iniciar o servidor

Com o MongoDB em execução, inicie o servidor Node.js:

```bash
node app.js
```

Se o servidor for iniciado corretamente, a aplicação estará disponível em:

```text
http://localhost:3000
```

Acesse o endereço pelo navegador para utilizar o sistema.

## Rotas principais

A aplicação possui rotas destinadas às diferentes funcionalidades do sistema.

Exemplos:

```text
/                   → Página inicial
/admin              → Área administrativa
/listaPetAgenda     → Lista de agendamentos
/ajustaPetAgenda    → Configuração da agenda
```

As rotas podem utilizar diferentes métodos HTTP, como `GET` e `POST`, de acordo com a operação realizada.

## Observações

* A pasta `node_modules/` não deve ser versionada pelo Git;
* O MongoDB deve estar disponível antes de iniciar o servidor;
* O MongoDB Compass é apenas uma ferramenta para visualizar e gerenciar o banco de dados; ele não substitui o MongoDB;
* O servidor Node.js também deve estar em execução para que o sistema possa ser acessado pelo navegador.

---
