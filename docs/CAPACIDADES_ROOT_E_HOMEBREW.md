# Capacidades do root e do Homebrew em TVs LG webOS

> Este documento explica o que muda depois de obter root e instalar o Homebrew Channel em uma TV LG webOS compatível. É um mapa de possibilidades e limites — não uma recomendação para alterar componentes críticos sem diagnóstico, backup e um caminho de retorno.

## Em uma frase

O **Homebrew Channel** é a loja/gerenciador de aplicativos e ferramentas comunitárias. O **root** dá a ele capacidade de executar ações privilegiadas, usar scripts no boot e oferecer acesso administrativo temporário. Isso permite personalizar mais profundamente uma TV LG, mas não muda o firmware nem converte o webOS em Android/Google TV.

## Os três níveis de acesso

| Nível | O que é | O que permite | Limite principal |
| --- | --- | --- | --- |
| webOS normal | TV sem modo desenvolvedor e sem root | Apps da LG Content Store, configurações oficiais, apps externos em dispositivos HDMI | Pouca personalização; não há acesso aos serviços do sistema |
| Homebrew sem root | Apps/IPKs em modo desenvolvedor ou Homebrew Channel sem elevação | Instalar apps compatíveis, testá-los e atualizá-los enquanto o modo desenvolvedor estiver válido | Apps sandboxed não conseguem controlar serviços protegidos nem persistir como root |
| Homebrew com root | Homebrew Channel elevado por um método compatível | Instalar apps, executar operações root via serviço do HBC, scripts de inicialização, acesso administrativo temporário e ajustes cuidadosamente controlados | Alterações ruins podem causar falha no boot; firmware, DRM e limitações de cada app continuam existindo |

O [Homebrew Channel oficial](https://github.com/webosbrew/webos-homebrew-channel) documenta repositórios independentes, instalação/atualização de apps, serviço de execução root, hooks de boot, acesso remoto e Failsafe.

## O que o Homebrew Channel entrega

### Catálogo, instalação e atualização de apps

O HBC pode:

- descobrir e instalar aplicativos do repositório padrão;
- atualizar aplicativos já instalados;
- reinstalar uma versão quando o próprio app oferecer essa opção;
- adicionar repositórios extras, inclusive um repositório temporário na rede local;
- instalar IPKs próprios, como o LG Minimal Home;
- mostrar se uma versão mais nova está disponível.

Isso é útil para apps de mídia, clientes remotos, emuladores, ferramentas de diagnóstico e interfaces próprias. Cada app tem requisitos próprios de modelo, webOS e permissões; aparecer no catálogo não garante compatibilidade com toda TV.

### Aplicativos próprios e interfaces personalizadas

Um app webOS pode ser completamente autoral: visual, organização dos itens, navegação por controle remoto, atalhos, ícones, fontes HDMI e leitura da lista de apps quando há uma integração apropriada.

O **LG Minimal Home** deste repositório é um exemplo seguro dessa categoria:

- é um IPK separado;
- não substitui o firmware;
- não sobrescreve o Início LG;
- pode ser removido como qualquer app instalado;
- mantém um atalho de volta à tela nativa.

Root não é obrigatório para desenhar uma interface; ele apenas pode permitir integrações extras, como consultar informações protegidas ou usar mecanismos de inicialização que exigem privilégio. Tornar uma interface alternativa a tela inicial permanente exige um método específico, testado no modelo e firmware em questão — não deve ser presumido apenas porque a TV possui root.

### Repositórios personalizados

Um repositório extra é um índice que aponta para manifestos e IPKs. Ele pode ser útil para distribuir uma versão de teste na LAN ou publicar atualizações de um projeto.

Boas práticas:

- use HTTPS quando o repositório for público;
- publique hash SHA-256 do IPK no manifesto;
- mantenha um repositório temporário somente pelo tempo necessário;
- remova a fonte no HBC depois de instalar uma versão de teste;
- não instale IPKs de origem desconhecida.

## O que o root acrescenta

### Serviço de execução privilegiada

Em uma TV com root, o HBC expõe um serviço para que aplicativos homebrew façam operações privilegiadas sem cada um precisar de uma elevação própria. Isso é poderoso, mas é também o maior limite de confiança: só instale apps cujo código, origem e manutenção você tenha avaliado.

Usos legítimos incluem diagnóstico, leitura de informações do sistema, instalação de ferramentas compatíveis e ajustes reversíveis de comportamento. Não é uma autorização para executar qualquer script encontrado na internet.

### Inicialização automática e scripts de boot

O HBC executa scripts de usuário presentes em `/var/lib/webosbrew/init.d` durante o boot. Essa capacidade possibilita:

- reativar uma configuração controlada após o reboot;
- iniciar um serviço ou uma integração homebrew;
- aplicar um bloqueio reversível de um componente promocional/telemetria compatível;
- preparar uma camada de automação específica para uma TV.

É também a área com maior potencial de deixar a TV instável. Um script de boot deve ser pequeno, versionado, revisado, reversível e validado primeiro sem alterar a inicialização. Evite scripts que escrevem na partição do sistema, removem arquivos do webOS ou desativam serviços indiscriminadamente.

### Modo Failsafe

O Failsafe é uma proteção do Homebrew Channel para situações em que uma customização ligada ao root torna o boot instável. Quando acionado, o sistema tenta subir com as customizações root temporariamente desativadas e disponibiliza um shell de emergência via Telnet para recuperação.

Por isso, Failsafe não deve ser desligado casualmente. Se ele surgir, investigue e remova a causa do problema antes de tentar forçar o comportamento anterior.

### Acesso remoto: SSH e Telnet

O HBC pode disponibilizar:

- **SSH:** acesso remoto administrativo; a configuração segura usa chave pública e o serviço deve ficar desligado quando não estiver em uso;
- **Telnet:** acesso sem autenticação, útil apenas como recurso de emergência e inadequado para ficar ligado em uma rede doméstica.

Recomendação operacional:

1. Ative SSH apenas quando uma tarefa exigir.
2. Reinicie se a própria tela de configurações pedir para aplicar a alteração.
3. Prefira chave pública; nunca publique credenciais ou arquivos de pareamento.
4. Desative SSH ao terminar e confirme que a porta não está mais exposta.
5. Mantenha Telnet desativado fora de uma recuperação muito específica.

Ter root não equivale a deixar acesso remoto aberto permanentemente.

### Telemetria, anúncios e elementos promocionais

Root oferece o mecanismo técnico para modificar ou bloquear partes do comportamento promocional da TV. Ele **não remove anúncios automaticamente**.

Há três abordagens, em ordem crescente de alcance e risco:

| Abordagem | Alcance | Vantagem | Risco/limite |
| --- | --- | --- | --- |
| Preferências nativas da LG | Recomendações e privacidade expostas pela interface | Sem root, fácil de reverter | Não elimina todos os blocos promocionais |
| Bloqueio DNS no roteador | Domínios de publicidade/telemetria | Vale para toda a rede e independe da TV | Pode quebrar Content Store, ThinQ, LG Channels ou recursos online |
| Bloqueador root específico | Processos, pontos de montagem ou prateleiras identificadas para um firmware | Mais cirúrgico quando há diagnóstico compatível | Depende do firmware; uma regra errada pode afetar Home, notificações ou boot |

Na TV de referência deste projeto, um bloqueador comunitário compatível foi **diagnosticado antes** e então aplicado no perfil de anúncios: removeu 12 prateleiras promocionais identificadas e bloqueou processos específicos, preservando Netflix, YouTube e Prime Video. Esse resultado não deve ser generalizado para outro firmware sem repetir o diagnóstico e confirmar quais componentes serão alterados.

Após aplicar qualquer bloqueio, teste:

- Início LG e troca de entradas;
- Netflix, YouTube, Prime Video e LG Channels, se usados;
- Wi-Fi, data/hora e notificações essenciais;
- duas inicializações completas da TV.

Mantenha uma forma documentada de reverter o bloqueador antes de aplicá-lo.

### Controle de atualizações

O HBC oferece uma opção para bloquear atualizações de sistema. Isso pode preservar a compatibilidade com o root, mas tem uma troca clara: a TV deixa de receber correções de segurança, melhorias e mudanças oficiais do firmware enquanto o bloqueio estiver ativo.

Não atualize ou faça downgrade de firmware como tentativa de “consertar” um app homebrew. Antes de mudar essa política, registre a versão atual, confirme compatibilidade e avalie a perda do root.

## Aplicativos: instalar, ocultar e remover

### Instalar apps

Com HBC, é possível instalar apps da comunidade e IPKs autorais. O procedimento seguro é:

1. confirmar o repositório/origem e o projeto-fonte;
2. ler a descrição, compatibilidade e permissões;
3. verificar a versão e, quando houver, o hash do IPK;
4. instalar;
5. abrir e testar;
6. remover o repositório temporário se ele foi usado apenas para essa instalação.

Nem todo IPK exige root. Um app de interface, por exemplo, pode ser sandboxed e ainda assim ser funcional.

### Remover apps de usuário

O caminho preferido é sempre a função **Editar lista de apps** da própria LG, que só oferece remoção para itens declarados desinstaláveis. Essa regra protege componentes internos e launch points necessários ao sistema.

Root tecnicamente amplia o que uma pessoa experiente poderia apagar, mas isso não torna a remoção forçada segura. Não use root para remover:

- componentes internos do webOS;
- serviços LG cujo papel não foi confirmado;
- entradas HDMI/Live TV;
- serviços de conta, DRM ou instalação;
- apps preinstalados sem um procedimento de reversão testado.

Se o objetivo for rapidez, priorize ocultar/reordenar o que não usa, limpar apps realmente desinstaláveis e usar uma tela inicial própria. Isso entrega o ganho visual sem arriscar a integridade do sistema.

## O que root não faz

Root **não**:

- libera serviços pagos, canais ou assinaturas;
- remove DRM ou torna conteúdo de Netflix/Prime/Disney+ acessível sem conta válida;
- transforma a TV em Android/Google TV;
- garante compatibilidade de qualquer app de outro modelo, região ou versão do webOS;
- torna seguro editar a partição do sistema;
- impede definitivamente uma atualização se ela for reinstalada por reset, assistência técnica ou outro mecanismo oficial;
- substitui uma estratégia de segurança de rede.

## Matriz de decisão antes de qualquer alteração

| Objetivo | Precisa de root? | Reversibilidade | Caminho recomendado |
| --- | --- | --- | --- |
| Instalar uma interface própria | Normalmente não | Alta | IPK separado pelo HBC |
| Organizar apps e entradas | Não | Alta | Ajustes do app/interface própria |
| Instalar um app comunitário | Depende do app | Média/alta | HBC + projeto oficial + teste |
| Remover app comum | Não, se a LG permitir | Alta | Editar lista de apps da LG |
| Ocultar promoções | Não necessariamente | Alta | Preferências LG e interface própria |
| Bloquear promoções do sistema | Sim, na abordagem cirúrgica | Média | Diagnóstico por firmware + bloqueador específico |
| Reduzir telemetria | Geralmente sim | Média | Solução compatível, documentada e reversível |
| Acesso por SSH | Sim | Alta | Chave pública; ativação temporária |
| Iniciar script no boot | Sim | Média/baixa | Apenas scripts pequenos, revisados e reversíveis |
| Trocar firmware | Não é um objetivo do root | Baixa/arriscada | Não fazer sem investigação específica |

## Princípio operacional: diagnóstico antes de mudança

Para qualquer customização que use root, siga esta ordem:

1. **Inventário:** anote modelo, plataforma, webOS, firmware e apps essenciais.
2. **Compatibilidade:** use somente a documentação e o repositório original da ferramenta.
3. **Diagnóstico não destrutivo:** confirme conectividade, processos/alvos e efeitos esperados.
4. **Autorização:** só então aplique uma mudança persistente.
5. **Validação:** teste o recurso alterado, os apps essenciais e um reboot completo.
6. **Higiene:** desligue SSH/Telnet, remova repositórios temporários e registre como reverter.

## Estado da TV de referência

O fluxo que originou este repositório confirmou, na combinação LG 43UP7500PSF / `lm21a` / webOS 6.5.3-47 / firmware 03.53.45:

- root com SlopBro e Homebrew Channel 0.7.3;
- lista de apps e ícones reais disponibilizada à interface autoral;
- atualizações de sistema bloqueadas por decisão do proprietário;
- bloqueio específico de promoções após diagnóstico compatível;
- preservação verificada de Netflix, YouTube e Prime Video;
- LG Minimal Home instalado como app independente, sem substituir firmware ou o Início LG.

Essas são evidências de uma única instalação. Não copie regras, arquivos de boot ou bloqueios para outra TV sem avaliar o seu próprio modelo e firmware.

## Documentos relacionados e fontes

- [Tutorial de root com SlopBro](ROOT_WEBOS_LG.md)
- [README do LG Minimal Home](../README.md)
- [Homebrew Channel — repositório oficial](https://github.com/webosbrew/webos-homebrew-channel)
- [SlopBro — repositório original](https://github.com/throwaway96/slopbro)
- [webOSbrew](https://www.webosbrew.org/)
- [Verificador comunitário de compatibilidade](https://cani.rootmy.tv/)
