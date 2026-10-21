# Root em TVs LG webOS com SlopBro

> **Resumo:** este é um registro reproduzível do processo usado para instalar o Homebrew Channel em uma TV LG webOS compatível. Ele usa exclusivamente o [SlopBro original](https://github.com/throwaway96/slopbro), sem redistribuir o exploit, payloads ou binários de terceiros.

## Avisos importantes

- Este procedimento explora uma vulnerabilidade (`jsserver`) para executar código como root. Há risco de instabilidade, perda de suporte/garantia e mudanças de comportamento após atualizações da LG.
- Compatibilidade depende de **modelo, plataforma e firmware**, não apenas da versão do webOS. Consulte [cani.rootmy.tv](https://cani.rootmy.tv/) antes de continuar e confirme que o método indicado é **SlopBro**.
- Mantenha atualizações automáticas desativadas antes de iniciar. Uma atualização de firmware pode corrigir o método e mudar o comportamento do sistema.
- Use uma rede local confiável. O computador e a TV precisam se alcançar nos dois sentidos; não tente fazer isso por uma rede pública ou por um navegador remoto sem acesso à LAN.
- Não faça downgrade, reset de fábrica, alteração de firmware ou remoção de serviços do sistema como parte deste guia.
- O Homebrew Channel e o root alteram o modelo de segurança da TV. Não deixe Telnet ativo. Ative SSH somente de forma temporária e desligue-o ao terminar.

## Escopo validado neste registro

| Item | Valor |
| --- | --- |
| TV | LG 43UP7500PSF |
| Plataforma | `lm21a` |
| webOS | 6.5.3-47 |
| Firmware | 03.53.45 |
| Método indicado pelo verificador de compatibilidade | SlopBro |
| Resultado | Homebrew Channel 0.7.3 instalado; status root `ok` |

Este resultado é uma evidência para esta combinação específica, não uma garantia para outros aparelhos ou firmwares.

## Como o SlopBro funciona

O SlopBro é uma prova de conceito para a vulnerabilidade `jsserver` do webOS. O script inicia um servidor HTTP local, faz pareamento SSAP com a TV e abre uma página em um app WAM. A página busca os arquivos do payload na máquina local; o `main.js` do pacote falso é executado como root e inicia o instalador do Homebrew Channel com persistência.

Para detalhes técnicos e opções suportadas, consulte o [README oficial do SlopBro](https://github.com/throwaway96/slopbro#readme). O projeto é AGPL-3.0; este repositório apenas referencia o projeto, não incorpora o código dele.

## Pré-requisitos

1. Uma TV LG webOS com compatibilidade confirmada para SlopBro no [cani.rootmy.tv](https://cani.rootmy.tv/).
2. Atualizações automáticas da TV desativadas.
3. TV e computador na mesma rede local, com comunicação HTTP da TV para o computador e SSAP do computador para a TV.
4. Python 3 no computador que executará o procedimento.
5. Acesso físico ao controle remoto para aceitar o pedido de pareamento exibido pela TV.
6. Um endereço IP local estável ou identificado para a TV e para o computador. Exemplos abaixo usam `TV_IP` e `PC_IP`; substitua pelos valores reais.

> Não publique os IPs da sua casa, arquivos `.key` gerados pelo pareamento, senhas ou logs completos.

## 1. Confirmar a compatibilidade e registrar o estado atual

Antes de baixar qualquer coisa, anote em **Configurações → Suporte → Informações da TV**:

- modelo;
- versão do webOS;
- versão do software/firmware;
- plataforma, se disponível.

Consulte o [cani.rootmy.tv](https://cani.rootmy.tv/) com esses dados. Se SlopBro não estiver indicado para a sua combinação, pare aqui. Não tente adaptar métodos corrigidos ou destinados a outro firmware.

Também vale fotografar a tela de configurações e listar os aplicativos importantes. Isso ajuda a verificar, depois, que Netflix, YouTube, Prime Video e os demais continuam presentes.

## 2. Preparar o computador e obter o SlopBro original

No computador conectado à mesma LAN da TV:

```sh
git clone https://github.com/throwaway96/slopbro.git
cd slopbro
python3 --version
python3 slopbro.py --help
```

O SlopBro atual usa apenas a biblioteca padrão do Python 3. Para auditoria e repetibilidade, registre o commit utilizado:

```sh
git rev-parse HEAD
```

Não baixe versões empacotadas ou forks aleatórios sem verificar origem, mudanças e licença.

## 3. Testar a conectividade sem explorar a TV

O SlopBro oferece um servidor de teste que **não faz pareamento SSAP, não abre a página de exploração e não instala nada**.

No computador, inicie o teste simples informando o IP local correto do computador:

```sh
python3 slopbro.py --test-server simple --local-ip PC_IP TV_IP
```

Ele exibirá uma URL HTTP local. Abra essa URL no navegador da TV. Se a TV receber a resposta de texto simples, a rota HTTP necessária está funcionando.

Se falhar, revise estes pontos antes de continuar:

- TV e computador estão na mesma rede/VLAN?
- algum firewall do computador bloqueia a porta usada pelo servidor temporário?
- `PC_IP` é realmente o IP da interface da rede local, e não VPN, loopback ou outra interface?
- a TV consegue navegar na rede local?

O próprio README oficial recomenda `--local-ip` quando a detecção automática escolher a interface errada.

## 4. Executar o SlopBro

> **Ponto de não retorno operacional:** a partir daqui a TV irá carregar o payload e o procedimento tentará instalar o Homebrew Channel. Confirme os dados, os riscos e tenha o controle remoto em mãos antes de executar.

Para uma TV webOS 6, use o comando oficial com os endereços substituídos:

```sh
python3 slopbro.py --local-ip PC_IP --webos-version 6 TV_IP
```

Em seguida:

1. Aceite o pedido de pareamento mostrado na TV.
2. Acompanhe os logs no terminal e a tela da TV; não desligue a TV ou o computador durante a transferência.
3. Aguarde a solicitação de reinicialização.
4. Reinicie a TV somente quando o procedimento pedir.

### Sobre `--curl-insecure`

Evite usar `--curl-insecure`: ele desativa a verificação de certificados TLS quando a TV baixa o Homebrew Channel. O mantenedor o descreve como alternativa apenas para casos necessários, como data incorreta na TV. Corrija a causa antes de recorrer a ele.

## 5. Verificar o Homebrew Channel e endurecer a configuração

Após o reboot, abra **Homebrew Channel** e confirme:

- `webosbrew version` aparece na tela;
- `Root status` mostra `ok`;
- o app abre normalmente após uma nova inicialização da TV.

Configuração recomendada na tela **Settings** do Homebrew Channel:

| Configuração | Recomendação |
| --- | --- |
| Block system updates | Ativar e reiniciar para aplicar |
| Telnet | Desativado |
| SSH Server | Desativado; ativar apenas temporariamente se for indispensável |
| Failsafe mode | Manter conforme o estado estável confirmado pela sua TV; não desligar sem entender a recuperação oferecida |

Depois de qualquer ajuste nessa tela, reinicie quando o Homebrew Channel informar que é necessário. Uma validação simples é confirmar que as portas Telnet (23) e SSH (22) não estão expostas quando esses serviços estiverem desligados.

## 6. Próximos passos seguros

Com o Homebrew Channel instalado, prefira aplicativos sandboxed e reversíveis. Para esta interface, o projeto [LG Minimal Home](../README.md) é distribuído como um IPK independente: não substitui o firmware, não altera serviços de inicialização e mantém o **Início LG** acessível.

Para reduzir elementos promocionais, trate bloqueadores de anúncios como uma etapa separada: faça diagnóstico, mantenha backup do estado e confirme que seus apps essenciais continuam funcionando. Não desinstale serviços internos do webOS apenas para “limpar” a interface.

## Solução de problemas

### A TV não conecta ao servidor HTTP local

Use primeiro `--test-server simple`; não tente o exploit até a resposta simples abrir no navegador da TV. Confirme o `PC_IP` manualmente e verifique firewall, Wi-Fi de convidados, isolamento de clientes e VLANs.

### O pedido de pareamento não aparece

Confirme se `TV_IP` está correto e se a TV está ligada na mesma LAN. Reiniciar somente a TV pode ajudar; não apague a chave de pareamento sem motivo, pois ela é reutilizada nas conexões seguintes.

### O SlopBro seleciona um app incompatível

Informe a versão maior do webOS com `--webos-version`. Por exemplo, `6.5` é aceito e tratado como versão maior `6`, conforme a documentação oficial.

### A TV reiniciou e parece normal

Isso, por si só, não confirma nem nega o resultado. Abra o Homebrew Channel e verifique `Root status: ok`. Não repita o exploit automaticamente se a confirmação visual ainda não tiver sido feita.

## Referências

- [SlopBro original — README e código-fonte](https://github.com/throwaway96/slopbro)
- [Verificador comunitário de compatibilidade RootMyTV](https://cani.rootmy.tv/)
- [Homebrew Channel / webOSbrew](https://www.webosbrew.org/)

