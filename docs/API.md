# API do App Entregas

Base URL: `http://localhost:3001/api`

## Autenticaçóo

```
Authorization: Bearer <token>
```

### POST /auth/registro
```json
{ "nome": "João", "email": "joao@email.com", "senha": "123456" }
```

### POST /auth/login
@``json
{ "email": "joao@email.com", "senha": "123456" }
```

Retorna `{ token, usuario }`.

---

## Pedidos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /pedidos | Lista todos |
| POST | /pedidos | Cria novo pedido |
| PATCH | /pedidos/:id/status | Atualiza status |

## Entregadores

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /entregadores | Lista ativos |
| POST | /entregadores | Cadastra novo |
| PATCH | /entregadores/:id/localizacao | Atualiza GPS |

## Rastreamento (público)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /rastreamento/:codigo | Dados do pedido para o cliente |

## WebSocket

- `entregador:localizacao` — envia GPS
- `entregador:chegando` — avisa cliente
- `rastreamento:atualizacao` — cliente recebe GPS
