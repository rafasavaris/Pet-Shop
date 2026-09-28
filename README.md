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
git clone https://github.com/rafasavaris/Pet-Shop
cd Pet-Shop
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

### 4. Conectar ao MongoDB pelo Compass

O **MongoDB Compass** pode ser utilizado para visualizar e gerenciar o banco de dados graficamente.

Com o container do MongoDB em execução, abra o MongoDB Compass e utilize a seguinte URI de conexão:

```text
mongodb://localhost:50000
```

O banco de dados utilizado pelo projeto é:

```text
petshop
```

A estrutura do banco será organizado inicialmente nas seguintes coleções:

```text
petshop
├── clientes
├── agenda
└── agendamentos
```

O Compass pode ser utilizado para consultar os documentos armazenados, verificar os agendamentos realizados e acompanhar as configurações da agenda durante o desenvolvimento.

### 5. Iniciar o servidor

Com o MongoDB em execução, inicie a aplicação:

```bash
node app.js
```

O sistema estará disponível em:

```text
http://localhost:3000
```

