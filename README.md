# Pet Shop Web

Sistema Web para agendamento de serviços de banho e tosa em um Pet Shop. Trabalho 1 de Programação Web.

## Estrutura inicial

```text
pet-shop/
├── app.js
├── package.json
│
├── database/
│   └── database.js
│
├── views/
│   ├── home.handlebars
│   ├── agendamento.handlebars
│   ├── listaPetAgenda.handlebars
│   └── ajustaPetAgenda.handlebars
│
└── public/
    └── style.css
```

## Como executar

### 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
cd t1
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Iniciar o MongoDB

O MongoDB deve estar em execução antes de iniciar o servidor Node.js.

Caso o MongoDB esteja sendo executado em um container Docker, inicie o container:

```bash
docker start meu-mongo
```

Para verificar se o container está rodando:

```bash
docker ps
```

O projeto utiliza o MongoDB localmente na porta `50000`.

### 4. Iniciar o servidor

Com o MongoDB em execução, inicie a aplicação:

```bash
node app.js
```

O sistema estará disponível em:

```text
http://localhost:3000
```