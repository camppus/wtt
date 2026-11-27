# Betting — Settlement, Cron Jobs e Progressão

## 1. Objetivo

O módulo de betting precisa processar automaticamente o ciclo completo de uma aposta:

```text
Sincronizar jogos
      ↓
Atualizar placar/status
      ↓
Encontrar apostas pendentes
      ↓
Resolver BetPicks
      ↓
Resolver BetSlip
      ↓
Pagar aposta
      ↓
Verificar BettingProgressionStep
      ↓
Atualizar progressão
      ↓
Liberar bônus / resetar / continuar
```

A regra principal é:

> **Cron não deve conter regra de negócio. O cron apenas dispara serviços de aplicação.**

---

# 2. Responsabilidades

O processamento deve ser dividido em três grandes responsabilidades:

### 2.1 Sync de jogos

Responsável por buscar resultados em um provider externo e atualizar os jogos locais.

```text
Provider de futebol
        ↓
SyncMatchesService
        ↓
MatchRepository
        ↓
Game/Match atualizado
```

### 2.2 Settlement de apostas

Responsável por verificar apostas pendentes e determinar o resultado de cada `BetPick` e do `BetSlip`.

```text
BetSlip PENDING
      ↓
Resolver BetPicks
      ↓
Resolver BetSlip
      ↓
WON / LOST / VOID
```

### 2.3 Settlement da progressão

Quando o `BetSlip` pertence a uma progressão, o resultado da aposta também precisa atualizar o `BettingProgressionStep`.

```text
BetSlip
   ↓
BettingProgressionStep
   ↓
BettingProgression
```

---

# 3. Estrutura recomendada

```text
bet/
├── application/
│   ├── dto/
│   ├── handlers/
│   └── useCase/
│       ├── CreateBetSlipUseCase.ts
│       ├── GetBetByIdUseCase.ts
│       ├── GetUserProgressionUseCase.ts
│       └── ListBetsUseCase.ts
│
├── domain/
│   ├── entities/
│   │   ├── BetPick.ts
│   │   ├── BetSlip.ts
│   │   ├── BettingProgression.ts
│   │   └── BettingProgressionStep.ts
│   │
│   ├── repositories/
│   │   ├── BetSlipRepository.ts
│   │   ├── BettingProgressionRepository.ts
│   │   └── MatchRepository.ts
│   │
│   └── services/
│       ├── ResolvePickService.ts
│       ├── ResolveBetSlipService.ts
│       ├── BetProgressService.ts
│       ├── ProgressionSettlementService.ts
│       └── PayoutService.ts
│
└── infra/
    ├── cron/
    │   ├── SyncMatchesCron.ts
    │   ├── ExpirePendingBetsCron.ts
    │   └── SettlePendingBetsCron.ts
    │
    ├── http/
    │   └── BetController.ts
    │
    └── persistence/
        ├── PrismaBetSlipRepository.ts
        ├── PrismaBettingProgressionRepository.ts
        └── PrismaMatchRepository.ts
```

---

# 4. SyncMatchesCron

O cron de sincronização busca os jogos no provider externo.

```text
SyncMatchesCron
      ↓
SyncMatchesService
      ↓
Football API
      ↓
MatchRepository
      ↓
Atualiza:
- status
- placar
- resultado
- finishedAt
```

Exemplo:

```ts
@Injectable()
export default class SyncMatchesCron {
  constructor(private readonly syncMatchesService: SyncMatchesService) {}

  @Cron('*/30 * * * * *')
  async execute(): Promise<void> {
    await this.syncMatchesService.execute();
  }
}
```

O cron não deve decidir se uma aposta ganhou.

Ele apenas garante que os dados dos jogos estejam atualizados.

---

# 5. Estados do jogo

O jogo deve possuir estados suficientemente claros para determinar quando pode ser liquidado.

Exemplo:

```text
SCHEDULED
    ↓
LIVE
    ↓
FINISHED
```

Também podem existir:

```text
POSTPONED
CANCELLED
SUSPENDED
```

Uma aposta não deve ser liquidada simplesmente porque existe um placar.

O jogo precisa estar em um estado considerado definitivo pelo sistema.

Por exemplo:

```ts
if (!game.isFinished()) {
  return;
}
```

---

# 6. SettlePendingBetsCron

Depois que os jogos são sincronizados, outro processo procura apostas pendentes.

```text
SettlePendingBetsCron
        ↓
SettlePendingBetsService
        ↓
BetSlipRepository
        ↓
BetSlip PENDING
```

Exemplo:

```ts
@Injectable()
export default class SettlePendingBetsCron {
  constructor(private readonly service: SettlePendingBetsService) {}

  @Cron('*/10 * * * * *')
  async execute(): Promise<void> {
    await this.service.execute();
  }
}
```

A frequência pode ser ajustada conforme a quantidade de apostas e a frequência de atualização dos resultados.

---

# 7. Resolver BetPick

Cada `BetPick` representa uma seleção dentro de uma aposta.

Exemplo:

```text
BetSlip #123

Pick #1 → HOME_WIN
Pick #2 → OVER_2_5
Pick #3 → BOTH_TEAMS_SCORE
```

O `ResolvePickService` recebe:

```text
BetPick
+
Game/Match
```

e determina:

```text
WON
LOST
VOID
```

Exemplo:

```ts
const result = await resolvePickService.execute({
  pick,
  game,
});
```

A regra de cada mercado deve permanecer no serviço de resolução do pick.

O cron não deve conhecer regras como:

```ts
homeScore > awayScore;
```

ou:

```ts
homeScore + awayScore > 2;
```

Essas regras pertencem ao domínio.

---

# 8. Resolver BetSlip

Depois de resolver todos os picks, o sistema determina o resultado da aposta inteira.

Exemplo:

```text
Pick 1 → WON
Pick 2 → WON
Pick 3 → WON
```

Resultado:

```text
BetSlip → WON
```

Se qualquer pick obrigatório perder:

```text
Pick 1 → WON
Pick 2 → LOST
Pick 3 → WON
```

Resultado:

```text
BetSlip → LOST
```

Regra básica:

```ts
if (picks.some((pick) => pick.isLost())) {
  bet.markAsLost();
  return;
}

if (picks.every((pick) => pick.isWon())) {
  bet.markAsWon();
}
```

---

# 9. Settlement de uma aposta normal

Uma aposta normal segue:

```text
BetSlip PENDING
      ↓
Resolve Picks
      ↓
BetSlip WON
      ↓
PayoutService
      ↓
Creditar saldo
```

Ou:

```text
BetSlip PENDING
      ↓
Resolve Picks
      ↓
BetSlip LOST
      ↓
Fim
```

O payout deve ser feito dentro de uma operação transacional.

---

# 10. BettingProgression

Uma aposta pode estar associada a uma progressão através do:

```text
BettingProgressionStep.betId
```

Portanto:

```text
BetSlip
   │
   │ betId
   ▼
BettingProgressionStep
   │
   ▼
BettingProgression
```

Isso permite descobrir se determinada aposta faz parte da progressão.

---

# 11. Progressão inicial

A progressão possui três apostas reais:

```text
Step 1
Step 2
Step 3
```

O utilizador precisa vencer as três.

```text
Step 1 → WON
       ↓
Step 2 → WON
       ↓
Step 3 → WON
       ↓
30.000 Kz
       ↓
LOOPING
```

Não existe um quarto step exclusivamente para o bônus.

O terceiro step é a terceira aposta.

---

# 12. Quando um Step ganha

Exemplo:

```text
BetSlip #100
      ↓
WON
      ↓
BettingProgressionStep #1
      ↓
WON
```

A progressão continua:

```text
ACTIVE
```

e o próximo step passa a estar disponível:

```text
Step 2 → PENDING
```

---

# 13. Quando um Step perde

Se uma aposta da progressão perder:

```text
BetSlip
   ↓
LOST
   ↓
Step
   ↓
LOST
   ↓
Progression
   ↓
RESET
```

A progressão volta ao início:

```text
0/3
```

A regra pode ser representada como:

```text
Step 1 LOST
    ↓
reset

Step 2 LOST
    ↓
reset

Step 3 LOST
    ↓
reset
```

---

# 14. Terceiro WIN

Quando o terceiro step é vencido:

```text
Step 1 → WON
Step 2 → WON
Step 3 → WON
```

O sistema deve:

```text
1. marcar Step 3 como WON
2. creditar 30.000 Kz
3. marcar Progression como LOOPING
```

Resultado:

```text
ACTIVE
   ↓
LOOPING
```

O bônus não deve ser tratado como uma aposta adicional.

---

# 15. LOOPING

Em `LOOPING`, o utilizador recebe uma aposta grátis por dia.

```text
LOOPING
    ↓
1 Free Bet / dia
```

A aposta gratuita possui:

```text
stake = 0
```

Mas é melhor ter uma representação explícita:

```ts
enum BetType {
  NORMAL = 'NORMAL',
  PROGRESSION = 'PROGRESSION',
  LOOPING_FREE = 'LOOPING_FREE',
}
```

Evitar depender apenas de:

```ts
stake === 0;
```

para determinar se uma aposta é grátis.

---

# 16. Free Bet ganha

```text
LOOPING
    ↓
FREE BET
    ↓
WON
    ↓
30.000 Kz
    ↓
LOOPING
```

A progressão não volta para `1/3`.

Também não é criado outro `BettingProgression`.

Continua:

```text
LOOPING
```

---

# 17. Free Bet perde

```text
LOOPING
    ↓
FREE BET
    ↓
LOST
    ↓
RESET
    ↓
ACTIVE
    ↓
Step 1
```

Ou seja:

```text
LOOPING
   ↓
LOSS
   ↓
ACTIVE
   ↓
0/3
```

---

# 18. ProgressionSettlementService

A lógica específica da progressão deve ficar separada do cron.

Exemplo conceitual:

```ts
@Injectable()
export default class ProgressionSettlementService {
  async execute(bet: BetSlip): Promise<void> {
    // encontrar BettingProgressionStep pelo betId
    // se não existir:
    // não é uma aposta de progressão
    // se WON:
    // aprovar step
    // se LOST:
    // resetar progressão
    // se for terceiro WIN:
    // pagar 30.000 Kz
    // mudar para LOOPING
  }
}
```

O serviço de settlement geral apenas chama esse serviço quando necessário.

---

# 19. Fluxo completo

```text
                  ┌───────────────────┐
                  │ SyncMatchesCron    │
                  └─────────┬─────────┘
                            ↓
                  ┌───────────────────┐
                  │ SyncMatchesService │
                  └─────────┬─────────┘
                            ↓
                     MatchRepository
                            ↓
                    Score atualizado
                            │
                            ▼
                  ┌────────────────────┐
                  │ SettleBetsCron     │
                  └──────────┬─────────┘
                             ↓
                    Pending BetSlips
                             ↓
                  ┌────────────────────┐
                  │ ResolvePickService  │
                  └──────────┬─────────┘
                             ↓
                       BetPick result
                             ↓
                  ┌────────────────────┐
                  │ ResolveBetSlip      │
                  │ Service             │
                  └──────────┬─────────┘
                             ↓
                     WON / LOST
                             ↓
                  ┌────────────────────┐
                  │ PayoutService       │
                  └──────────┬─────────┘
                             ↓
                     Saldo atualizado
                             ↓
                  ┌────────────────────┐
                  │ Progression         │
                  │ Settlement         │
                  └──────────┬─────────┘
                             ↓
                  BettingProgressionStep
                             ↓
                   ┌─────────┴─────────┐
                   ↓                   ↓
                 WON                 LOST
                   ↓                   ↓
              Próximo step          RESET
                   │
                   ↓
                Step 3?
                   │
                   ↓
              30.000 Kz
                   ↓
                LOOPING
```

---

# 20. Expiração

O `ExpirePendingBetsCron` é outro processo separado.

Ele trata apostas que ficaram pendentes além do tempo permitido.

```text
BetSlip PENDING
      ↓
tempo expirado
      ↓
EXPIRED
```

Isso é diferente de `LOST`.

```text
LOST
→ resultado conhecido e aposta perdida

EXPIRED
→ aposta não pôde ser resolvida dentro das regras
```

A política de `EXPIRED` deve definir se existe refund.

---

# 21. Idempotência

Este é um dos pontos mais importantes do sistema.

Cron não garante execução única.

O mesmo processo pode executar várias vezes:

```text
10:00:00 → worker A
10:00:10 → worker A
10:00:20 → worker B
```

O sistema precisa ser seguro contra isso.

Nunca assumir:

```text
cron executou uma vez
```

---

# 22. Payout idempotente

Uma aposta:

```text
PENDING
```

deve passar para:

```text
WON
```

e o payout deve acontecer uma única vez.

Na próxima execução:

```text
WON
```

não deve ser processada novamente.

Uma referência financeira pode ser usada:

```text
LedgerEntry.referenceId = BetSlip.id
```

com um tipo específico:

```text
BET_WIN
```

E uma constraint única:

```text
UNIQUE(referenceId, type)
```

Assim:

```text
BetSlip #123
     ↓
BET_WIN
     ↓
30.000 Kz
```

não pode gerar outro crédito para a mesma referência.

---

# 23. Bônus da Progressão

O mesmo princípio deve ser aplicado ao bônus.

Por exemplo:

```text
LedgerEntry
referenceId = BettingProgressionStep.id
type = PROGRESSION_BONUS
```

E:

```text
UNIQUE(referenceId, type)
```

Assim, mesmo que o cron processe o terceiro step dez vezes:

```text
Step 3
   ↓
30.000 Kz
```

o segundo crédito será rejeitado pela constraint.

---

# 24. Concorrência

Existe outro problema:

```text
Worker A
   ↓
encontra BetSlip PENDING

Worker B
   ↓
encontra o mesmo BetSlip PENDING
```

Os dois podem tentar liquidar a mesma aposta.

Por isso o settlement precisa de um mecanismo de claim/lock.

Uma abordagem simples:

```text
PENDING
   ↓
PROCESSING
   ↓
WON / LOST
```

O worker tenta fazer:

```sql
UPDATE bet_slip
SET status = 'PROCESSING'
WHERE id = ?
AND status = 'PENDING';
```

Se nenhuma linha for atualizada:

```text
outro worker já assumiu a aposta
```

O segundo worker não processa.

---

# 25. Transação

O settlement financeiro deve ser transacional.

Idealmente:

```text
BEGIN TRANSACTION

1. claim BetSlip
2. resolver BetPicks
3. atualizar BetSlip
4. atualizar BettingProgressionStep
5. atualizar BettingProgression
6. criar LedgerEntry
7. atualizar saldo
8. criar próximo step, se necessário

COMMIT
```

Se algo falhar:

```text
ROLLBACK
```

Assim não acontece:

```text
BetSlip = WON
saldo não recebeu dinheiro
```

ou:

```text
saldo recebeu bônus
Step continua PENDING
```

---

# 26. Regra final de arquitetura

Os cron jobs devem ser pequenos:

```ts
@Cron(...)
async execute() {
  await this.service.execute();
}
```

A lógica deve ficar nos serviços:

```text
Cron
 ↓
Application Service
 ↓
Domain Services
 ↓
Repositories
 ↓
Database
```

Nunca:

```text
Cron
 ↓
20 regras de negócio
 ↓
Prisma direto
 ↓
saldo
 ↓
progressão
 ↓
bônus
```

O segundo modelo fica difícil de testar e muito perigoso quando começares a ter concorrência.

---

# 27. Responsabilidade de cada componente

| Componente                     | Responsabilidade                  |
| ------------------------------ | --------------------------------- |
| `SyncMatchesCron`              | Disparar sincronização            |
| `SyncMatchesService`           | Buscar e sincronizar jogos        |
| `MatchRepository`              | Persistir jogos/resultados        |
| `SettlePendingBetsCron`        | Disparar settlement               |
| `ResolvePickService`           | Determinar resultado de um pick   |
| `ResolveBetSlipService`        | Determinar resultado do BetSlip   |
| `PayoutService`                | Processar ganhos financeiros      |
| `ProgressionSettlementService` | Atualizar Step/Progression        |
| `BetProgressService`           | Regras de transição da progressão |
| `BetSlipRepository`            | Persistência das apostas          |
| `BettingProgressionRepository` | Persistência da progressão        |
| `Ledger`                       | Auditoria financeira              |

---

# 28. Fluxo final

```text
             EXTERNAL FOOTBALL API
                       │
                       ▼
              SyncMatchesCron
                       │
                       ▼
             SyncMatchesService
                       │
                       ▼
                MatchRepository
                       │
                 score/status
                       │
                       ▼
             SettlePendingBetsCron
                       │
                       ▼
             Pending BetSlip
                       │
                       ▼
              ResolvePickService
                       │
                       ▼
                BetPick result
                       │
                       ▼
            ResolveBetSlipService
                       │
                 ┌─────┴─────┐
                 ▼           ▼
                WON         LOST
                 │           │
                 ▼           │
            PayoutService    │
                 │           │
                 └─────┬─────┘
                       ▼
          ProgressionSettlementService
                       │
                 ┌─────┴─────┐
                 ▼           ▼
                WON         LOST
                 │           │
                 ▼           ▼
             next step     reset
                 │
                 ▼
               Step 3
                 │
                 ▼
            30.000 Kz
                 │
                 ▼
              LOOPING
                 │
        ┌────────┴────────┐
        ▼                 ▼
     WIN free bet       LOSS
        │                 │
        ▼                 ▼
    30.000 Kz           RESET
        │
        ▼
     LOOPING
```

**Regra central:** `BetSlip` determina o resultado da aposta; `BettingProgressionStep` determina o impacto dessa aposta na progressão; `BettingProgression` determina o estado do ciclo; `Ledger` garante que qualquer movimentação financeira seja auditável e idempotente.
