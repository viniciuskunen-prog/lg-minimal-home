# LG Minimal Home

Uma tela inicial premium, limpa e feita para o controle remoto das TVs LG com webOS 6.

O projeto usa uma linguagem visual própria: fundo profundo em azul-noite, superfícies de vidro translúcido, foco luminoso e tipografia espaçosa. A referência é a sensação de clareza e profundidade da interface do macOS, sem copiar elementos, assets ou código da Apple.

## Princípios

- Sem anúncios, recomendações ou telemetria do aplicativo.
- Apps reais, fontes HDMI e Live TV numa navegação simples por setas e OK.
- A tela LG original continua acessível em **Início LG**.
- Não altera firmware, não substitui componentes do webOS e não exige serviço de inicialização.

## Compatibilidade

O alvo inicial é webOS 6 / Chrome 79, incluindo a LG 43UP7500PSF testada neste projeto. Em uma TV com Homebrew Channel, a opção padrão lê a lista real de aplicativos e seus ícones. Sem Homebrew, usa um catálogo local limitado.

## Root e Homebrew Channel

O [tutorial de root com SlopBro](docs/ROOT_WEBOS_LG.md) registra o processo validado na TV de referência, seus riscos, pré-requisitos e verificações não destrutivas. Ele referencia exclusivamente o projeto original do SlopBro e não inclui o exploit nem seus payloads.

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
