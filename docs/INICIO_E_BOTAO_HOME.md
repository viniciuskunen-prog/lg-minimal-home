# Início ao ligar e botão Home — investigação

Estado: **planejado, não implementado nem testado** na LG 43UP7500PSF (webOS
6.5.3-47 / firmware 03.53.45). O usuário confirmou que o visual da versão 0.1.7 está
adequado; isso não comprova os mecanismos abaixo.

Há três situações distintas:

1. Abrir o Minimal Home manualmente — já observado na TV.
2. Apertar **Home** no controle e abrir o Minimal Home — exige um mecanismo separado de
   remapeamento com root; o aplicativo web não intercepta esse botão do sistema.
3. Ligar a TV e abrir o Minimal Home — exige um mecanismo separado de inicialização, que
   aguarde o gerenciador de apps ficar pronto. Ligar após standby e boot completo podem
   comportar-se de formas diferentes.

Nenhuma delas exige apagar o Início LG. O app atual não modifica firmware, Home nativa,
serviços de boot ou botão Home. O atalho **Início LG** deve permanecer acessível.

## Fontes primárias

- [LG: Magic Remote](https://webostv.developer.lge.com/develop/guides/magic-remote) — Home
  normalmente retorna à interface oficial.
- [LG: ciclo de vida dos apps](https://webostv.developer.lge.com/develop/guides/app-lifecycle-management)
  — apps podem ser lançados pelo Application Manager.
- [LG Input Hook original](https://github.com/Simon34545/lginputhook) — remapeamento com
  Homebrew/root; o ID da tecla deve ser identificado nos logs do controle real. A
  compatibilidade com esta TV ainda não foi demonstrada.
- [Homebrew Channel original](https://github.com/webosbrew/webos-homebrew-channel) e
  [guia de hooks](https://github.com/webosbrew/pages/blob/main/content/pages/hacking/overlays.md)
  — scripts executáveis em `/var/lib/webosbrew/init.d` podem rodar no boot. Isso não valida
  automaticamente um script específico para nosso app.

## Sequência de segurança antes de alterar a TV

1. Confirmar versão instalada, abertura manual, apps essenciais, atalho Início LG,
   status root/failsafe, IP verdadeiro da TV e forma de recuperação.
2. Inspecionar, sem alterar, teclas do controle, mapeadores já instalados e hooks de boot
   existentes. Não confiar em um código de tecla copiado de outra TV.
3. Testar um comando de abertura manual sem criar persistência.
4. Testar remapeamento reversível primeiro numa tecla não essencial, se possível; só
   depois considerar Home. Conferir retorno ao Início LG e uso nos apps, TV e HDMI.
5. Testar início automático somente com script pequeno, idempotente, pertencente ao app,
   retry limitado e rollback ensaiado. Distinguir boot completo de despertar do standby.
6. Remover mapeamento/hook, reiniciar e confirmar que o comportamento LG original volta.

Antes de instalação, remapeamento, hook ou reboot, apresentar o que será alterado,
risco e rollback e obter autorização específica. Um mapeamento errado pode prejudicar a
navegação pelo controle; um hook ruim pode atrasar o boot ou acionar o failsafe. Não
desativar o failsafe, não modificar arquivos de sistema e manter atualizações desligadas.

Em 22/10/2026, uma checagem somente leitura confirmou resposta SSAP e servidor SSH na
TV identificada anteriormente por SSDP. O proprietário esclareceu depois que a TV estava
desligada durante a checagem. A resposta de rede não prova que a tela estivesse ligada,
que o app tivesse iniciado ou que houvesse ocorrido um boot completo: serviços de rede
podem continuar ativos em standby. A autenticação SSH por chave falhou com
`Permission denied`; isso não comprova acesso aos arquivos da TV. Não foi tentada senha
padrão. SSH não deve ficar ligado indefinidamente; confirmar seu estado na tela antes
da próxima etapa.

**Pendente:** identificação do botão Home desta TV, inventário de hooks/mapper,
comando de abertura validado e teste presencial. Nenhuma configuração da TV foi alterada
nesta investigação.
