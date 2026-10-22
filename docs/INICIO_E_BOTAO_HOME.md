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
  instalação e os logs nesta TV foram observados, mas o remapeamento ainda não foi testado.
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

Após o usuário esclarecer que a TV já estava ligada, uma segunda checagem somente leitura
confirmou SSAP acessível, mas a mesma chave SSH continuou recusada. Há conectividade atual;
o inventário de apps e hooks da TV ainda não foi obtido.

**Pendente:** inventário de hooks de boot, comando de abertura validado e teste
presencial do remapeamento. O proprietário informou que Home gera o código 773;
essa observação ainda não tem captura de log anexada ao repositório. Nenhuma regra de tecla ou hook de boot
foi criado pelo projeto nesta investigação.

O proprietário **instalou e abriu o LG Input Hook** na TV. Uma foto mostrou a lista de
keybinds vazia e o log de inicialização do hook; ainda não há evidência de regra salva ou
código Home capturado. A foto também expôs a senha da interface web do Input Hook; ela
não foi copiada para o repositório nem deve aparecer em capturas futuras. O [README original](https://github.com/Simon34545/lginputhook)
diz que o serviço do app passa a persistir após a primeira abertura; isso não significa
que uma tecla já tenha sido remapeada. Próximo passo: observar os logs do app e registrar
o ID real da tecla Home deste controle, sem criar ou salvar keybind por enquanto.

Uma segunda foto mostrou apenas `ezinject-lginput2.log`, com endereços e bibliotecas
carregadas. Esse é o log do injetor, não uma captura do evento Home; nenhum `id =>`
da tecla foi observado. Para o próximo teste somente leitura, selecionar em
**View logs** o log correspondente ao controle usado, apertar Home uma vez e
conferir as linhas mais recentes. Não adicionar nem salvar keybind antes de
identificar o ID nesta TV e revisar o rollback.

Uma terceira foto corrigiu o caminho do diagnóstico: o usuário selecionou
`lginput-hook-micomservice.log`, descrito na interface como log do controle IR em
webOS 5.x ou superior. Há eventos `code=106` (muitos), `code=105` e `code=28`,
com valores de pressionar/soltar/repetir. A [tabela de IDs do projeto original](https://github.com/Simon34545/lginputhook/blob/main/Button%20IDs.md)
associa 105/106 a esquerda/direita em um modelo de Magic Remote, mas isso não
identifica o botão Home deste controle. Nenhum código Home foi isolado na foto;
o 28 também não deve ser atribuído a Home por suposição. A recomendação anterior
de olhar apenas `lginput-hook-lginput2.log` era estreita demais: o log correto
depende do controle e da versão do webOS. Próximo teste: comparar linhas antes
e imediatamente após **um único** toque em Home nesse log, sem salvar keybind.

Uma foto ampliada do fim do mesmo log termina em `code=106`, `105` e `28`,
sem código novo distinguível para Home. A captura não demonstra que Home tenha
sido registrado nesse log. Para evitar confundir a navegação de retorno ao app
com Home, observar o log pela interface web em outro dispositivo na mesma rede
durante o toque, ou comparar também outro log de entrada indicado pelo menu.
Não registrar 28 como Home sem teste isolado.

Cinco fotos adicionais mostram que o controle usado é físico, com teclas
direcionais e Home dedicado, sem ponteiro Magic Remote. O log `lginput2` (Magic
Remote) mostra apenas inicialização; `testapp`, `tvservice` (IR em webOS 4.x
e anteriores) e `RELEASE` (versões antigas) retornam `ENOENT`. Assim,
`micomservice` segue como log primário para o controle IR nesta TV webOS 6.
A [lista de códigos IR publicada pelo autor do Input Hook](https://gist.github.com/Simon34545/31c528bfe8540880936fc4c580723a02)
identifica 105 como esquerda, 106 como direita, 28 como OK/Enter e 773 como
Home **no controle específico catalogado por ele**. Os três primeiros são
coerentes com a navegação vista nas fotos; 773 é apenas hipótese para o
controle do proprietário, não ID confirmado. O próximo teste é observar o
`micomservice` de outro dispositivo da mesma rede, tocar Home uma vez e
comparar o evento novo; não inserir 773 em keybind por antecipação.

O proprietário confirmou depois que o pressionamento de Home corresponde a
`773` no controle desta TV. Esta é uma **observação relatada pelo usuário**,
coerente com a lista do autor, mas ainda não prova que o Input Hook consiga
interceptar e substituir a ação da tecla. O ID instalado do Minimal Home é
`com.viniciuskunen.lgminimalhome` (`public/appinfo.json`). A [API Application
Manager da LG](https://webostv.developer.lge.com/develop/references/application-manager)
oferece `launch` por ID, porém o comando shell concreto para o campo Execute
do Input Hook ainda não foi testado nesta TV. Antes de qualquer regra persistente:
verificar lançamento manual, caminho independente para abrir o Input Hook e
voltar ao Início LG, além de um teste piloto numa tecla não essencial.

O proprietário confirmou que não há terminal instalado na TV. Foto posterior
do Homebrew Channel 0.7.3 mostra root `ok`, SSH ligado, Telnet desligado,
bloqueio de atualizações ligado e failsafe desligado. A chave SSH disponível
no Mac continua sem autenticação; não tentar adivinhar senha. Sondas somente
leitura confirmaram portas SSAP 3000/3001 acessíveis na LAN. Como alternativa
ao terminal, pode-se testar o lançamento manual por pareamento SSAP padrão da
LG, com aceite do proprietário na tela. Esse pareamento cria uma autorização
persistente entre Mac e TV e **ainda não foi iniciado**; pedir aprovação antes.
Depois dos testes, desligar SSH caso não seja mais necessário.

Com autorização específica do proprietário, o Mac conectou-se à TV pela SSAP
em `wss`/3001 e enviou um pedido de pareamento com permissão apenas `LAUNCH`.
O proprietário aceitou o aviso na TV. Em seguida, uma única chamada
`ssap://system.launcher/launch` para `com.viniciuskunen.lgminimalhome`
retornou `returnValue: true`, e o proprietário confirmou que o Minimal Home
apareceu na tela. Isso valida o lançamento manual via SSAP nesta TV, **não**
que o comando shell do Input Hook funcionará. A chave de
pareamento ficou apenas na memória do processo de teste e não foi gravada
no repositório ou em arquivo local. Não foi criado keybind, serviço de boot
ou alteração do firmware. Antes do piloto de tecla, planejar recuperação
independente do botão Home.

O proprietário testou em seguida o bloco **Início LG** dentro do Minimal Home
e confirmou que ele retorna à Home original. Essa rota de saída funciona
quando o Minimal Home já está aberto; por si só, não garante recuperação se
um futuro keybind impedir o app de abrir. Antes de criar regra, identificar
no log `micomservice` o ID real de uma tecla colorida não essencial (por
exemplo, azul) e confirmar uma rota de acesso ao Input Hook sem depender do
Home remapeado.

Uma nova foto do `lginput-hook-micomservice.log` mostrou `code=401, value=1`
e `code=401, value=0` após o teste da tecla azul: **401 está confirmado nesta TV**
como ID da tecla piloto. Isso não significa que exista regra salva. O
[código da interface do LG Input Hook original](https://github.com/Simon34545/lginputhook/blob/main/service/interface/main.js)
inclui a ação **Launch App**, com seleção por ID dos aplicativos instalados,
além das ações descritas no README. É preciso conferir se a versão instalada
na TV exibe essa opção e lista `Minimal Home
(com.viniciuskunen.lgminimalhome)` antes de usá-la; o código atual do
repositório pode diferir da versão instalada. Um piloto futuro, somente com
autorização explícita, seria vincular 401 a **Launch App → Minimal Home**,
salvar, testar a tecla azul e remover a regra com **Remove → Save changes**
caso falhe ou ao encerrar o teste. A regra é persistente até removida;
durante o piloto, a função original da tecla azul pode deixar de operar.
Não tocar no código Home 773 nem em inicialização automática nesta etapa.

Foto seguinte confirmou **na interface instalada** a ação **Launch App** e a
opção `Minimal Home (com.viniciuskunen.lgminimalhome)` na lista. O formulário
recém-adicionado ainda mostra ID `0`; a foto não comprova salvamento de regra.
O próximo gate é a autorização explícita para o piloto persistente 401, com
verificação de acesso ao Input Hook e caminho de remoção independente do
botão testado. A captura também mostra uma senha da interface; não incluí-la
na documentação ou em futuras capturas públicas.

O proprietário autorizou explicitamente um **piloto com a tecla azul 401**,
não o remapeamento de Home 773 nem a inicialização automática. Antes de salvar,
confirmar que o Input Hook pode ser reaberto pelo caminho normal sem a tecla
azul. No formulário: ID `401`, Action **Launch App**, App **Minimal Home
(com.viniciuskunen.lgminimalhome)**, então **Save changes**. Testar um toque
curto na tecla azul a partir da Home LG, sem reiniciar. Se não abrir, ou ao
concluir o piloto, reabrir o Input Hook pelo caminho independente, usar
**Remove** na regra 401 e **Save changes**; confirmar que a regra desapareceu.
O proprietário relatou que salvou a regra 401, pressionou a tecla azul e o
**Minimal Home abriu**. Em seguida, pressionou **Home** e a TV voltou à Home
original do webOS. Esse piloto comprova o lançamento via **Launch App** pela
tecla azul nesta TV e preservação da função Home nesse momento; **não**
comprova remapeamento de Home nem inicialização automática. O relato não diz
que a regra 401 foi removida: presumir que possa continuar ativa até que o
proprietário confirme **Remove → Save changes** e o desaparecimento da regra.
Não criar a regra 773 enquanto o estado da 401 não estiver esclarecido.
