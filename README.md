# API de Heróis
Esta é uma API RESTful construída com Node.js utilizando o framework Express.js e banco de dados PostgreSQL. Ela fornece endpoints para gerenciar heróis e simular batalhas entre eles.

## Configuração
1. Clone este repositório para a sua máquina local.
2. Instale o Node.js e o npm, caso ainda não tenha feito.
3. Instale o PostgreSQL e crie um banco de dados chamado herois.
4. Importe o esquema SQL fornecido no arquivo database.sql para criar as tabelas necessárias.
5. Instale as dependências executando npm install.
6. Inicie o servidor executando npm start.
## Uso
### Endpoints
- GET /herois: Recupera todos os heróis.
- GET /herois/:id: Recupera um herói pelo ID.
- GET /herois/nome/:nome: Busca heróis pelo nome.
- POST /herois: Cria um novo herói.
- PUT /herois/:id: Atualiza um herói pelo ID.
- DELETE /herois/:id: Deleta um herói pelo ID.
- POST /batalha: Simula uma batalha entre dois heróis.
- GET /historico-batalhas/:heroiId: Obtém o histórico de batalhas de um herói pelo ID do herói.
- GET /batalhas/nome/:nome: Busca batalhas envolvendo um herói pelo nome do herói.
## Exemplos de Requisição e Resposta
### Criar um novo herói
json
Copy code
POST /herois
{
  "nome": "Superman",
  "classe": "Super-herói",
  "nivel": 10,
  "vida": 100
}
#### Resposta:

json
Copy code
201 Created
{
  "message": "Herói criado com sucesso"
}
### Simular uma batalha
json
Copy code
POST /batalha
{
  "id_heroi1": 1,
  "id_heroi2": 2
}
#### Resposta:

json
Copy code
200 OK
{
  "message": "Batalha simulada com sucesso",
  "resultado": "Superman venceu a batalha contra Batman"
}
## Dependências
- express
- pg
## Contribuição
Sinta-se à vontade para abrir um problema ou enviar uma solicitação de pull para quaisquer melhorias ou recursos que você gostaria de ver adicionados a esta API.

