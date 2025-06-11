# Backend para Gerenciamento de Casamento

Este projeto é o backend para uma aplicação de gerenciamento de convidados e lista de presentes para um casamento.

## Funcionalidades

- Confirmação de presença de convidados.
- Listagem de presentes disponíveis.
- Reserva de presentes por convidados.
- Confirmação de compra de presentes.

## Tecnologias Utilizadas

- Node.js
- Express
- TypeScript
- (Adicionar aqui informações sobre o banco de dados e outras libs relevantes)

## Estrutura do Projeto

- `src/controllers`: Contém a lógica de manipulação das requisições HTTP.
- `src/models`: Contém a lógica de interação com o banco de dados.
- `src/routes`: Define as rotas da API.
- `src/config`: Contém arquivos de configuração (ex: banco de dados).
- `src/utils`: Funções utilitárias.

## Configuração e Execução

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente (se aplicável, ex: conexão com banco de dados).
4. Compile o código TypeScript:
   ```bash
   npm run build
   ```
5. Inicie o servidor:
   ```bash
   npm start
   ```

O servidor estará rodando em `http://localhost:3000` (ou a porta configurada).