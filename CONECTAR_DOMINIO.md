# Guia para Conectar seu Próprio Domínio ao RH Master

Este guia explica como conectar seu próprio domínio (por exemplo, rhmaster.seudominio.com.br) à aplicação RH Master hospedada no Replit.

## Pré-requisitos

1. Um domínio registrado (por exemplo, via Registro.br, GoDaddy, Namecheap, etc.)
2. Acesso administrativo ao painel de controle DNS do seu domínio
3. A aplicação RH Master já deployada no Replit

## Passo 1: Deploy da Aplicação no Replit

Antes de conectar seu domínio, certifique-se de que a aplicação esteja deployada:

1. Acesse o projeto no Replit
2. Clique no botão "Run" para garantir que a aplicação esteja funcionando
3. No painel lateral, clique na aba "Deployments"
4. Clique em "Deploy" para criar um deploy da aplicação

Após o deploy, o Replit fornecerá uma URL no formato: `https://rhmaster.replit.app`

## Passo 2: Configuração do Domínio no Replit

1. Na aba "Deployments" do Replit, clique em "Settings"
2. Role para baixo até a seção "Custom domains"
3. Clique em "Add custom domain"
4. Digite seu domínio (exemplo: `rhmaster.seudominio.com.br` ou `app.seudominio.com.br`)
5. Clique em "Add domain"

O Replit fornecerá as informações necessárias para configurar seus registros DNS:
- Um registro CNAME apontando para seu domínio Replit
- Possivelmente configurações TXT para verificação de propriedade

## Passo 3: Configuração DNS no seu Provedor de Domínio

Acesse o painel de controle DNS do seu provedor de domínio (Registro.br, GoDaddy, etc.) e configure:

### Para um subdomínio (recomendado, exemplo: rhmaster.seudominio.com.br)

Adicione um registro CNAME:
- **Nome/Host**: `rhmaster` (ou o subdomínio que você deseja)
- **Valor/Destino**: O domínio Replit fornecido (algo como `rhmaster.replit.app`)
- **TTL**: 3600 (ou o valor recomendado pelo seu provedor)

### Para o domínio raiz (exemplo: seudominio.com.br)

Para um domínio raiz, você precisará configurar:

1. Um registro A para o endereço IP fornecido pelo Replit
2. Um registro AAAA se fornecido (para IPv6)

**Observação**: Muitos registradores de domínio não permitem registros CNAME para o domínio raiz. Nesse caso, é melhor usar um subdomínio.

## Passo 4: Verificação e Propagação DNS

A propagação DNS pode levar até 48 horas para ser concluída globalmente, embora geralmente seja muito mais rápida.

Para verificar se a configuração está funcionando:

1. Use uma ferramenta como [dnschecker.org](https://dnschecker.org) para verificar a propagação do seu registro CNAME
2. Tente acessar seu site pelo novo domínio após algumas horas

## Passo 5: Certificado SSL

O Replit gerencia automaticamente o certificado SSL para seu domínio personalizado, então você não precisa se preocupar com isso.

## Problemas Comuns

1. **O domínio não funciona após configuração**: Verifique se você configurou corretamente o registro CNAME e aguarde a propagação DNS.

2. **Erro "DNS not configured"**: Verifique no painel de controle do Replit se o registro CNAME está configurado corretamente no seu provedor de DNS.

3. **Erro de SSL**: Aguarde algumas horas para que o Replit emita automaticamente um certificado SSL para seu domínio.

Para qualquer outro problema, consulte a documentação do Replit sobre domínios personalizados ou entre em contato com o suporte.

## Domínios de Produção

Para ambientes de produção, considere adicionar estes registros extras para melhorar a segurança e a entrega de e-mails:

- **SPF (TXT)**: Ajuda a prevenir falsificação de e-mail
- **DMARC (TXT)**: Adiciona uma camada extra de proteção de e-mail
- **BIMI (TXT)**: Para exibir seu logotipo em clientes de e-mail compatíveis

---

Após a configuração bem-sucedida, seu RH Master estará disponível no seu próprio domínio, oferecendo uma experiência mais profissional para seus usuários.