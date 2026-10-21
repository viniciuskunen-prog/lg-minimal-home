# Auditoria funcional — LG Minimal Home

**Status:** auditoria de código concluída; validação presencial na TV pendente.

**Versão auditada:** `0.1.3`  
**Commit:** `c5b7b82`  
**Escopo:** comportamento do app, integração opcional com Homebrew Channel, empacotamento e compatibilidade de build. Esta auditoria não altera firmware, Home nativo, autostart, serviços de boot ou configurações persistentes da TV.

## Objetivo

Confirmar, com evidência, o que está implementado no LG Minimal Home e reduzir riscos antes de instalar uma nova versão ou testar a interface na TV.

## Metodologia

1. Leitura dos fluxos de dados, navegação e chamadas Luna.
2. Verificação de configuração padrão e persistência em `localStorage`.
3. Criação de testes automatizados para os fluxos críticos.
4. Build, empacotamento do IPK e inspeção da sintaxe gerada para o motor Chromium 79 do webOS 6.
5. Sondagem de conectividade na LAN sem autenticação SSH e sem execução root.
6. Consulta à documentação oficial da LG para o requisito `requiredACG`.

## Achados e decisão

| Achado | Prioridade | Evidência | Decisão |
| --- | --- | --- | --- |
| Integração com serviço root do Homebrew habilitada em instalação nova | Alta | O comentário dizia “Off by default”, mas `DEFAULT_CONFIG.useHomebrew` era `true` | **Corrigido:** o default passou a `false`; opt-in salvo continua preservado |
| Não havia testes automatizados | Alta | Não existiam arquivos de teste ou script `npm test` | **Corrigido:** suíte Vitest criada, com 8 testes |
| `requiredACG` ausente | Média | Aviso do empacotador webOS | **Não alterado por suposição:** webOS 6 não aplica ACG; permissões futuras precisam de validação por método/plataforma |
| SSAP responde na rede local | Positivo | Portas de controle da TV responderam à sondagem TCP | Pareamento e inventário continuam pendentes |
| SSH está ativo | Atenção | Porta TCP 22 respondeu à sondagem | Não foi usado; desligar depois da etapa presencial |
| Build aprovado | Positivo | TypeScript, Vite e empacotamento concluídos | Não substitui teste na TV |

## Correção: integração Homebrew opt-in

O app tem uma opção em Ajustes para ler a lista real de apps e os ícones através do serviço do Homebrew Channel. Como esse caminho usa uma operação privilegiada do HBC, uma instalação nova não deve acioná-lo sem escolha explícita do dono da TV.

Em `src/lib/storage.ts`, o valor padrão foi alterado para:

```ts
useHomebrew: false
```

Compatibilidade: instalações já existentes guardam a configuração em `localStorage`; se o usuário já havia habilitado a opção, essa escolha é mantida. A alteração só muda o comportamento de instalações novas ou sem preferências gravadas.

## Cobertura automatizada

O projeto agora usa Vitest e executa os testes com:

```sh
npm test
```

Os 8 testes aprovados cobrem:

| Área | Verificações |
| --- | --- |
| Configuração | Homebrew desligado em instalação nova; opt-in salvo é preservado; opt-in explícito persiste |
| Reordenação | Movimento de itens e proteção contra mutação da lista original |
| Navegação Home | OK abre o item focado; Down muda de faixa antes de abrir |
| Ajustes | Down + OK seleciona/remove um item da faixa de apps |

Os testes não simulam o firmware, serviços Luna nem o controle remoto físico. Eles são uma proteção contra regressões de lógica no navegador e complementam, mas não substituem, a validação na TV.

## Build e pacote

Foram executados com sucesso:

```sh
npm test
npm run build
npm run package
git diff --check
```

O pacote gerado para teste é `com.viniciuskunen.lgminimalhome_0.1.3_all.ipk`.

O projeto continua mirando **Chromium 79**, que é o motor do webOS 6. Uma inspeção adicional do bundle confirmou que não há sintaxe `?.` ou `??`, incompatível com esse alvo.

## `requiredACG`: estado e próxima decisão

`requiredACG` é o campo de permissões Luna definido no `appinfo.json`. A documentação oficial da LG informa que:

- webOS TV 25 ou anterior não aplica ACG;
- webOS TV 26 permite adoção/teste;
- webOS TV 27 ou posterior exigirá o campo para empacotamento e distribuição.

Para as chamadas públicas usadas pelo app, a tabela oficial já permite identificar:

| Chamada | Grupo ACG oficial |
| --- | --- |
| `com.webos.applicationManager/launch` | `application.launcher` |
| `com.webos.applicationManager/getAppLoadStatus` | `application.query` |

As chamadas de entradas, preferências e a integração privada com o Homebrew Channel não devem receber permissões inventadas. Antes de declarar ACG para uma versão mais nova do webOS, o caminho correto é testar cada chamada em uma TV/plataforma com ACG aplicado, observar qualquer negação e declarar apenas os grupos confirmados.

Referência: [Access Control Group (ACG) — LG](https://webostv.developer.lge.com/develop/guides/acg-guide).

## Dependências

A verificação de dependências (`npm audit --omit=dev`) reportou duas vulnerabilidades altas transitivas no `@webos-tools/cli`, ferramenta usada somente no ambiente de desenvolvimento/empacotamento:

- `brace-expansion`;
- `js-yaml`.

Não foi executado `npm audit fix` automaticamente porque uma atualização transitiva pode alterar o comportamento do CLI que gera o IPK. A pendência deve ser tratada por atualização compatível do `@webos-tools/cli` ou revisão controlada do lockfile, não por correção forçada.

## O que ainda precisa ser comprovado na TV

Nenhuma das etapas abaixo está marcada como concluída neste documento:

1. Aceitar presencialmente um novo pareamento SSAP.
2. Inventariar, em modo somente leitura, a versão instalada e os launch points relevantes.
3. Atualizar para v0.1.3 somente após confirmar o fluxo de instalação reversível.
4. Validar na TV: inicialização, foco, setas, OK, Voltar, abertura de apps, fontes HDMI, Ajustes, seleção, reordenação e retorno ao Início LG.
5. Confirmar que a opção Homebrew fica desligada em uma configuração nova e que o opt-in funciona quando habilitado pelo usuário.
6. Desligar SSH após terminar os testes e confirmar que não permanece exposto.

## Fora de escopo

- substituir o botão Home nativo;
- configurar autostart ou hook de boot;
- modificar firmware, downgrade, reset de fábrica;
- remover componentes internos do webOS;
- executar comandos root por SSH;
- declarar ACG sem evidência de compatibilidade.

Esses temas só devem ser investigados depois de a interface, seus testes e a instalação reversível estarem estáveis.
