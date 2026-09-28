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

## Login administrativo com MongoDB

O login administrativo utiliza o mesmo MongoDB do projeto. Os usuários ficam na coleção `usuarios`, as senhas são armazenadas como hash bcrypt e as sessões ficam na coleção `sessoes`.

Antes da primeira execução, copie `.env.example` para um novo arquivo chamado `.env` e ajuste os valores:

```env
SESSION_SECRET=coloque-uma-chave-longa-e-aleatoria
ADMIN_USUARIO=admin
ADMIN_SENHA=coloque-uma-senha-forte
```

O arquivo `.env` é ignorado pelo Git e não deve ser enviado ao repositório. Quando a coleção `usuarios` ainda está vazia, a aplicação cria o primeiro administrador com os dados de `ADMIN_USUARIO` e `ADMIN_SENHA`. A senha é convertida em hash antes de ser gravada.

Depois de iniciar normalmente com `node app.js`, acesse:

```text
http://localhost:3000/login
```

### Fluxo da autenticação

1. O formulário envia o usuário e a senha para `POST /login`.
2. O servidor procura o usuário na coleção `usuarios`.
3. O bcrypt compara a senha informada com o hash armazenado.
4. Se estiver correta, o Express cria uma sessão.
5. O `connect-mongo` grava a sessão na coleção `sessoes`.
6. O navegador recebe somente um cookie identificador; a senha nunca vai para o cookie.
7. Um middleware permite acessar as rotas administrativas somente com uma sessão de administrador válida.

As rotas `/admin`, `/listaPetAgenda` e `/ajustaPetAgenda` são protegidas. O logout destrói a sessão e remove o cookie.
