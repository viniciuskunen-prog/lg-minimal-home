# LG Minimal Home

> Em desenvolvimento — repositório privado. Veja também a
> [documentação em inglês](docs/README.en.md).

Uma tela inicial premium, limpa e feita para o controle remoto das TVs LG com webOS 6.

O projeto usa uma linguagem visual própria: fundo profundo em azul-noite, superfícies de vidro translúcido, foco luminoso e tipografia espaçosa. A referência é a sensação de clareza e profundidade da interface do macOS, sem copiar elementos, assets ou código da Apple.

## Princípios

- Sem anúncios, recomendações ou telemetria do aplicativo.
- Apps reais, fontes HDMI e Live TV numa navegação simples por setas e OK.
- A tela LG original continua acessível em **Início LG**.
- Não altera firmware, não substitui componentes do webOS e não exige serviço de inicialização.

## Compatibilidade

O alvo inicial é webOS 6 / Chrome 79, incluindo a LG 43UP7500PSF usada como referência neste projeto. Sem Homebrew, usa um catálogo local limitado. Em uma TV com Homebrew Channel, o usuário pode habilitar explicitamente a lista real de aplicativos e ícones; essa integração é desligada por padrão e ainda requer revalidação na TV para a versão atual.

## Root e Homebrew Channel

O [tutorial de root com SlopBro](docs/ROOT_WEBOS_LG.md) registra o processo validado na TV de referência, seus riscos, pré-requisitos e verificações não destrutivas. Ele referencia exclusivamente o projeto original do SlopBro e não inclui o exploit nem seus payloads.

Para entender o que muda depois da instalação, consulte [Capacidades do root e do Homebrew](docs/CAPACIDADES_ROOT_E_HOMEBREW.md): catálogo de apps, interfaces próprias, repositórios, acesso remoto, scripts de boot, bloqueio de promoções, limites e práticas de segurança.

O estado verificável do app fica em [Auditoria funcional](docs/AUDITORIA_FUNCIONAL.md), com achados, correções, testes automatizados e pendências para validação presencial na TV.

Para preparar a futura abertura do código sem confundir planos com funcionalidades, consulte [Status do projeto](docs/PROJECT_STATUS.md), [Arquitetura](docs/ARCHITECTURE.md), [Desenvolvimento](docs/DEVELOPMENT.md) e a [auditoria de preparo open source](docs/OPEN_SOURCE_READINESS.md).

## Desenvolvimento

Requer Node.js 18 ou superior.

```sh
npm ci
npm run build
npm run package
```

O pacote gerado em `build/` é um IPK de teste. Instalação em uma TV é sempre uma etapa manual e separada, depois de validar a interface.

## Controles

- Setas: navegam entre faixas e itens.
- OK: abre o app, fonte ou ação selecionada.
- Ajustes: escolhe e reordena os itens exibidos.
- Voltar: sai de Ajustes; na tela principal não executa nenhuma ação.

## Créditos e licença

O ponto de partida técnico é o projeto MIT `partridgeworks/webos-launcher`; os avisos de terceiros foram preservados em `THIRD_PARTY_NOTICES.md`. LG Minimal Home é independente e não é afiliado à LG, Apple, Netflix ou aos demais provedores de aplicativos.
