# Tradução do PRD - Seção Introdução

# Documento de Requisitos do Produto (PRD)
# RH Master

**Plataforma SaaS para Mentores Treinarem seus Líderes**

**Versão:** 1.0 (MVP)  
**Data:** 25 de Abril de 2025

## Sumário

1. [Introdução e Visão Geral](#1-introdução-e-visão-geral)
2. [Objetivos do Produto](#2-objetivos-do-produto)
3. [Personas e Jornadas do Usuário](#3-personas-e-jornadas-do-usuário)
4. [Requisitos Funcionais](#4-requisitos-funcionais)
5. [Requisitos Não-Funcionais](#5-requisitos-não-funcionais)
6. [Arquitetura do Sistema](#6-arquitetura-do-sistema)
7. [Modelos de Planos e Preços](#7-modelos-de-planos-e-preços)
8. [Especificações de Testes Comportamentais](#8-especificações-de-testes-comportamentais)
9. [Sistema de Gamificação](#9-sistema-de-gamificação)
10. [Mockups e Design Visual](#10-mockups-e-design-visual)
11. [Roadmap e Cronograma](#11-roadmap-e-cronograma)
12. [Métricas de Sucesso](#12-métricas-de-sucesso)
13. [Schema do Banco de Dados](#13-schema-do-banco-de-dados)
14. [Assistentes Virtuais de IA](#14-assistentes-virtuais-de-ia)
15. [Landing Page](#15-landing-page)

## Introdução

Este documento apresenta os requisitos para o desenvolvimento do MVP (Minimum Viable Product) da plataforma RH Master, um sistema SaaS (Software as a Service) projetado para mentores de liderança e desenvolvimento profissional que desejam treinar, acompanhar e avaliar o progresso de seus clientes de forma estruturada e eficiente.

O RH Master oferece uma solução centralizada onde mentores podem convidar seus clientes, atribuir testes comportamentais, acompanhar resultados e utilizar um sistema de gamificação para estimular o engajamento, tudo isso com dashboards diferenciados para mentores e clientes.

Este PRD detalha as funcionalidades, requisitos técnicos, fluxos de usuário e outros aspectos essenciais para o desenvolvimento bem-sucedido da plataforma.
# 1. Introdução e Visão Geral

## 1.1 Sobre o RH Master

O RH Master é uma plataforma SaaS (Software as a Service) projetada para mentores de liderança e desenvolvimento profissional que desejam treinar, acompanhar e avaliar o progresso de seus clientes (líderes em formação) de forma estruturada e eficiente. A plataforma oferece um ambiente digital centralizado onde mentores podem convidar seus clientes, atribuir testes comportamentais, acompanhar resultados e utilizar um sistema de gamificação para estimular o engajamento.

## 1.2 Proposta de Valor

O RH Master resolve diversos problemas enfrentados por mentores profissionais:

- **Centralização de informações**: Elimina a necessidade de usar múltiplas ferramentas para gerenciar clientes, aplicar testes e acompanhar resultados.
- **Gestão simplificada de clientes**: Facilita o processo de convite, cadastro e acompanhamento de clientes.
- **Avaliação objetiva**: Fornece testes comportamentais padronizados que permitem avaliações consistentes.
- **Engajamento através de gamificação**: Utiliza elementos de gamificação para motivar clientes a completarem os testes e atividades.
- **Insights valiosos**: Oferece dados e análises que ajudam mentores a personalizar seu trabalho com cada cliente.
- **Assistência inteligente**: Fornece assistentes virtuais de IA para auxiliar tanto mentores quanto clientes em suas jornadas.

## 1.3 Mercado-Alvo

O RH Master é direcionado principalmente para:

- Mentores de liderança e desenvolvimento profissional
- Consultores de RH independentes
- Coaches executivos
- Profissionais de treinamento corporativo
- Especialistas em desenvolvimento de talentos

## 1.4 Diferenciação Competitiva

O RH Master se diferencia de outras soluções no mercado por:

1. **Foco na relação mentor-cliente**: A plataforma é projetada especificamente para facilitar a relação entre mentores e seus clientes, diferente de plataformas genéricas de RH.
2. **Sistema de convite exclusivo**: Clientes só podem acessar a plataforma mediante convite do mentor, garantindo controle e exclusividade.
3. **Dashboards diferenciados**: Interfaces distintas para mentores e clientes, com informações estratégicas visíveis apenas para mentores.
4. **Gamificação invisível**: Sistema de gamificação e ranking visível apenas para mentores, evitando competição direta entre clientes.
5. **Testes comportamentais especializados**: Conjunto inicial de três testes comportamentais relevantes para desenvolvimento de liderança.
6. **Assistentes virtuais de IA**: Assistentes baseados no modelo Gemini 2.0 Flash para auxiliar mentores e clientes em suas atividades na plataforma.
7. **Interface Kanban para atribuição de testes**: Sistema intuitivo e visual para mentores atribuírem testes aos clientes.

## 1.5 Visão de Produto

A visão para o RH Master é se tornar a plataforma preferida de mentores profissionais para gerenciamento e desenvolvimento de seus clientes, oferecendo uma experiência digital que complementa e potencializa o trabalho de mentoria presencial ou remota. A longo prazo, o RH Master pretende expandir seu conjunto de ferramentas e recursos para se tornar um ecossistema completo para desenvolvimento de liderança, incorporando tecnologias avançadas de IA para personalização e insights cada vez mais precisos.
# 2. Objetivos do Produto

## 2.1 Objetivos de Negócio

- Criar uma plataforma SaaS rentável com modelo de assinatura mensal para mentores
- Estabelecer uma base de usuários mentores ativos e engajados
- Desenvolver um produto escalável que possa crescer em funcionalidades e base de usuários
- Posicionar o RH Master como ferramenta essencial para profissionais de mentoria e desenvolvimento de liderança

## 2.2 Objetivos do MVP

1. **Lançar uma plataforma funcional** com recursos essenciais para mentores gerenciarem seus clientes
2. **Implementar sistema de convites** que permita apenas acesso mediante convite do mentor
3. **Oferecer três testes comportamentais** iniciais (Perfil Comportamental, Inteligência Emocional e Eneagrama)
4. **Criar dashboards diferenciados** para mentores e clientes
5. **Desenvolver sistema de gamificação** visível apenas para mentores
6. **Estabelecer três níveis de planos de assinatura** com diferentes benefícios
7. **Integrar assistentes virtuais de IA** em ambos os dashboards para auxiliar usuários
8. **Implementar interface Kanban** para atribuição de testes
9. **Criar landing page otimizada** para conversão de visitantes em assinantes

## 2.3 Métricas de Sucesso

### Métricas de Aquisição
- Número de mentores cadastrados
- Taxa de conversão de visitantes para assinantes
- Custo de aquisição de cliente (CAC)

### Métricas de Engajamento
- Número médio de clientes por mentor
- Taxa de conclusão de testes pelos clientes
- Frequência de acesso à plataforma por mentores
- Taxa de interação com assistentes virtuais de IA

### Métricas de Retenção
- Taxa de renovação de assinatura
- Churn mensal
- Lifetime Value (LTV) dos mentores assinantes

### Métricas de Receita
- Receita mensal recorrente (MRR)
- Distribuição de assinantes entre os diferentes planos
- Ticket médio por mentor

## 2.4 Resultados Esperados para o MVP

- Lançamento da plataforma com todas as funcionalidades essenciais em até 3 meses
- Aquisição de 50-100 mentores assinantes nos primeiros 3 meses após o lançamento
- Média de 5 clientes cadastrados por mentor ativo
- Taxa de conclusão de testes de pelo menos 70% pelos clientes
- Feedback positivo de mentores sobre a utilidade da plataforma (NPS > 40)
- Taxa de interação com assistentes virtuais de IA de pelo menos 60%
# 3. Personas e Jornadas do Usuário

## 3.1 Personas

### 3.1.1 Mentor - Carlos Silva

**Perfil:**
- 42 anos, consultor de desenvolvimento de liderança
- Atende entre 15-20 clientes simultaneamente
- Possui MBA em Gestão de Pessoas e certificações em coaching
- Trabalha de forma independente há 8 anos

**Objetivos:**
- Escalar seu negócio de mentoria sem perder qualidade no atendimento
- Obter insights objetivos sobre o perfil de seus clientes
- Acompanhar o progresso de seus mentorados de forma estruturada
- Otimizar seu tempo eliminando tarefas administrativas

**Pontos de dor:**
- Dificuldade em gerenciar múltiplos clientes usando planilhas e e-mails
- Falta de ferramentas específicas para aplicar e analisar testes comportamentais
- Tempo excessivo gasto em tarefas administrativas
- Dificuldade em mensurar objetivamente o progresso dos clientes

**Expectativas:**
- Interface intuitiva que não exija treinamento extensivo
- Acesso a dados relevantes sobre seus clientes
- Capacidade de personalizar a experiência para diferentes clientes
- Ferramentas que complementem seu trabalho de mentoria presencial
- Assistência inteligente para otimizar seu trabalho

### 3.1.2 Cliente - Ana Martins

**Perfil:**
- 35 anos, gerente de equipe em empresa de médio porte
- Recém-promovida a uma posição de liderança
- Formada em Administração com especialização em Marketing
- Busca desenvolver habilidades de liderança para crescer na carreira

**Objetivos:**
- Desenvolver competências de liderança
- Entender melhor seu perfil comportamental e pontos de melhoria
- Aplicar aprendizados na gestão de sua equipe
- Progredir na carreira corporativa

**Pontos de dor:**
- Insegurança em seu novo papel de liderança
- Dificuldade em receber feedback objetivo sobre seu desempenho
- Falta de tempo para participar de treinamentos extensos
- Necessidade de resultados rápidos e aplicáveis

**Expectativas:**
- Acesso fácil a testes e recursos de desenvolvimento
- Interface simples e direta que não consuma muito tempo
- Feedback claro sobre seus resultados
- Experiência personalizada baseada em suas necessidades específicas
- Suporte para esclarecer dúvidas sobre seu desenvolvimento

## 3.2 Jornadas do Usuário

### 3.2.1 Jornada do Mentor

1. **Descoberta e Cadastro**
   - Carlos descobre o RH Master através de marketing digital ou indicação
   - Acessa a landing page e conhece os benefícios da plataforma
   - Cadastra-se escolhendo um dos planos de assinatura
   - Configura seu perfil e personaliza sua conta

2. **Convite aos Clientes**
   - Acessa seu dashboard de mentor
   - Utiliza a função "Convidar Cliente" para adicionar seus mentorados
   - Insere nome e e-mail dos clientes que deseja convidar
   - Sistema envia e-mails de convite automaticamente

3. **Gerenciamento de Clientes**
   - Visualiza lista de clientes convidados e seus status (pendente/ativo)
   - Monitora quais clientes já completaram o cadastro
   - Organiza clientes em grupos ou categorias (opcional)
   - Utiliza o assistente virtual de IA para obter insights sobre seus clientes

4. **Atribuição de Testes**
   - Acessa a interface Kanban de atribuição de testes
   - Arrasta os testes desejados da coluna de "Disponíveis" para a coluna do cliente específico
   - Define prazo para conclusão (opcional)
   - Sistema notifica cliente sobre novos testes disponíveis

5. **Acompanhamento de Resultados**
   - Recebe notificação quando cliente completa um teste
   - Acessa resultados detalhados dos testes
   - Visualiza dashboard com métricas e insights
   - Acompanha ranking e pontuação de gamificação
   - Consulta o assistente virtual para análises mais profundas dos resultados

6. **Análise e Planejamento**
   - Utiliza dados dos testes para planejar próximas sessões de mentoria
   - Identifica padrões e áreas de desenvolvimento
   - Prepara estratégias personalizadas baseadas nos resultados
   - Solicita recomendações ao assistente virtual de IA

### 3.2.2 Jornada do Cliente

1. **Recebimento do Convite**
   - Ana recebe e-mail com convite para acessar o RH Master
   - Clica no link exclusivo de cadastro
   - Cria sua conta com senha pessoal
   - Completa informações básicas de perfil

2. **Primeiro Acesso**
   - Acessa seu dashboard de cliente
   - Visualiza mensagem de boas-vindas e orientações iniciais
   - Explora a interface para se familiarizar com a plataforma
   - Interage com o assistente virtual de IA para esclarecer dúvidas

3. **Realização de Testes**
   - Visualiza testes disponibilizados pelo mentor
   - Seleciona um teste para iniciar
   - Responde às questões do teste
   - Submete suas respostas
   - Recebe orientações do assistente virtual durante o processo

4. **Visualização de Resultados**
   - Acessa resultados de seus testes
   - Visualiza interpretações e insights sobre seu perfil
   - Identifica pontos fortes e áreas de desenvolvimento
   - Solicita esclarecimentos ao assistente virtual sobre seus resultados

5. **Acompanhamento de Progresso**
   - Retorna à plataforma periodicamente
   - Verifica novos testes atribuídos
   - Acompanha seu histórico de resultados
   - Utiliza insights para aplicar em seu desenvolvimento profissional
   - Consulta o assistente virtual para dicas de desenvolvimento
# 4. Requisitos Funcionais

## 4.1 Sistema de Usuários e Autenticação

### 4.1.1 Cadastro e Autenticação de Mentores
- Cadastro de mentores com e-mail, senha e informações de perfil
- Autenticação segura com opção de recuperação de senha
- Seleção de plano de assinatura durante o cadastro
- Integração com sistema de pagamento Stripe para processamento de assinaturas

### 4.1.2 Sistema de Convites para Clientes
- Interface para mentores adicionarem clientes (nome e e-mail)
- Geração automática de links exclusivos de convite
- Envio de e-mails de convite personalizados
- Monitoramento de status de convites (pendente, aceito, expirado)
- Opção para reenvio de convites não aceitos

### 4.1.3 Cadastro e Autenticação de Clientes
- Formulário de cadastro acessível apenas via link de convite
- Criação de conta com senha pessoal
- Vinculação automática ao mentor que enviou o convite
- Autenticação segura com opção de recuperação de senha

## 4.2 Dashboard do Mentor

### 4.2.1 Visão Geral
- Resumo de métricas principais (total de clientes, testes atribuídos, testes concluídos)
- Gráficos de atividade e engajamento
- Alertas e notificações sobre atividades recentes
- Acesso rápido às principais funcionalidades
- Assistente virtual de IA (Gemini 2.0 Flash) para suporte e insights

### 4.2.2 Gerenciamento de Clientes
- Lista completa de clientes com status e informações básicas
- Filtros e busca para localização rápida de clientes
- Visualização detalhada de perfil individual de cliente
- Opções para adicionar, remover ou desativar clientes

### 4.2.3 Gerenciamento de Testes
- Interface Kanban para atribuição de testes a clientes
- Arrastar e soltar testes da coluna "Disponíveis" para colunas de clientes específicos
- Definição de prazos para conclusão de testes (opcional)
- Monitoramento de status de conclusão de testes
- Acesso a resultados detalhados de testes por cliente

### 4.2.4 Sistema de Gamificação e Ranking
- Tabela de classificação de clientes baseada em pontuação
- Métricas de pontuação por testes concluídos
- Critérios de desempate (tempo de resposta, completude)
- Visualização de progresso e engajamento por cliente
- Opções para personalização de regras de pontuação

### 4.2.5 Análise e Relatórios
- Relatórios consolidados de resultados de testes
- Comparação de perfis entre diferentes clientes
- Identificação de padrões e tendências
- Exportação de dados e relatórios em formatos padrão
- Análises avançadas com suporte do assistente virtual de IA

## 4.3 Dashboard do Cliente

### 4.3.1 Visão Geral
- Boas-vindas e orientações iniciais
- Resumo de testes disponíveis e concluídos
- Notificações sobre novos testes atribuídos
- Interface simplificada e intuitiva
- Assistente virtual de IA (Gemini 2.0 Flash) para suporte e esclarecimentos

### 4.3.2 Realização de Testes
- Lista de testes disponíveis com descrições
- Interface para responder às questões dos testes
- Indicador de progresso durante a realização do teste
- Confirmação de envio e conclusão
- Suporte do assistente virtual para dúvidas durante o teste

### 4.3.3 Visualização de Resultados
- Acesso aos resultados de testes concluídos
- Interpretações e insights sobre perfil pessoal
- Identificação de pontos fortes e áreas de desenvolvimento
- Histórico de testes realizados
- Explicações adicionais via assistente virtual de IA

## 4.4 Testes Comportamentais

### 4.4.1 Teste de Perfil Comportamental (Águia, Gato, Lobo e Tubarão)
- Questionário com 20-30 perguntas de múltipla escolha
- Algoritmo de classificação nos quatro perfis
- Resultados com percentuais de cada perfil
- Interpretação detalhada de características de cada perfil
- Recomendações baseadas no perfil predominante

### 4.4.2 Teste de Inteligência Emocional
- Avaliação de cinco dimensões da IE (autoconsciência, autocontrole, automotivação, empatia, habilidades sociais)
- Questionário com 25-35 perguntas situacionais
- Escala de pontuação para cada dimensão
- Resultados com gráficos comparativos
- Sugestões de desenvolvimento para cada dimensão

### 4.4.3 Teste de Eneagrama
- Identificação dos nove tipos de personalidade do Eneagrama
- Questionário com 30-40 perguntas de autoavaliação
- Algoritmo de classificação do tipo predominante e tipos secundários
- Descrição detalhada do tipo identificado
- Insights sobre motivações, medos e padrões de comportamento

## 4.5 Sistema de Planos e Assinaturas

### 4.5.1 Plano Básico
- Acesso a até 10 clientes simultâneos
- Três testes comportamentais disponíveis
- Funcionalidades básicas de dashboard
- Sistema de gamificação simplificado
- Relatórios básicos
- Acesso limitado ao assistente virtual de IA

### 4.5.2 Plano Profissional
- Acesso a até 30 clientes simultâneos
- Três testes comportamentais disponíveis
- Funcionalidades completas de dashboard
- Sistema de gamificação avançado
- Relatórios detalhados e exportáveis
- Personalização de e-mails de convite
- Acesso completo ao assistente virtual de IA

### 4.5.3 Plano Enterprise
- Acesso ilimitado a clientes
- Três testes comportamentais disponíveis
- Funcionalidades completas de dashboard
- Sistema de gamificação avançado com personalização
- Relatórios avançados com análise comparativa
- Personalização de marca nos e-mails e interface
- Acesso prioritário ao assistente virtual de IA com recursos avançados
- Suporte prioritário

## 4.6 Landing Page

### 4.6.1 Elementos Principais
- Header com logo, menu de navegação e CTA principal
- Seção hero com proposta de valor clara e CTA destacado
- Demonstração visual das principais funcionalidades
- Seção de benefícios com ícones e descrições concisas
- Depoimentos de mentores que utilizam a plataforma
- Comparativo de planos e preços
- FAQ com perguntas comuns
- Formulário de contato
- Footer com informações legais e links importantes

### 4.6.2 Elementos de Conversão
- CTAs estrategicamente posicionados ao longo da página
- Oferta de período de teste gratuito
- Pop-up de saída com oferta especial
- Chat para dúvidas em tempo real
- Demonstração interativa da plataforma
- Contador regressivo para promoções especiais
- Selos de segurança e garantia de satisfação
# 5. Requisitos Não-Funcionais

## 5.1 Desempenho
- Tempo de carregamento de página inferior a 3 segundos
- Capacidade para suportar até 1.000 usuários simultâneos
- Tempo de resposta do servidor inferior a 500ms para 95% das requisições
- Processamento de resultados de testes em menos de 5 segundos
- Resposta do assistente virtual de IA em menos de 2 segundos

## 5.2 Segurança
- Criptografia de dados sensíveis em trânsito (HTTPS) e em repouso
- Autenticação segura com senhas fortes e opção de autenticação de dois fatores
- Proteção contra ataques comuns (XSS, CSRF, SQL Injection)
- Backups diários automatizados com retenção de 30 dias
- Conformidade com LGPD para tratamento de dados pessoais
- Auditoria de transações financeiras via Stripe

## 5.3 Usabilidade
- Interface responsiva compatível com dispositivos desktop e móveis
- Design intuitivo que não requer treinamento extensivo
- Acessibilidade conforme diretrizes WCAG 2.1 nível AA
- Suporte a navegadores modernos (Chrome, Firefox, Safari, Edge)
- Feedback visual claro para ações do usuário
- Interface Kanban intuitiva com funcionalidade de arrastar e soltar

## 5.4 Confiabilidade
- Disponibilidade de 99,9% (downtime máximo de 8,76 horas/ano)
- Recuperação de falhas em menos de 4 horas
- Monitoramento contínuo de desempenho e disponibilidade
- Plano de contingência para falhas críticas
- Redundância para serviços essenciais

## 5.5 Escalabilidade
- Arquitetura que permite escalar horizontalmente para acomodar crescimento
- Capacidade de aumentar número de usuários sem degradação de desempenho
- Otimização de banco de dados PostgreSQL para consultas eficientes mesmo com grande volume de dados
- Balanceamento de carga para distribuir tráfego

## 5.6 Manutenibilidade
- Código modular e bem documentado
- Logs detalhados para facilitar diagnóstico de problemas
- Ambiente de teste separado para validação de atualizações
- Processo de deploy automatizado com possibilidade de rollback
- Estrutura de código organizada seguindo boas práticas do React e Vite

## 5.7 Compatibilidade
- API RESTful para possíveis integrações externas
- Exportação de dados em formatos padrão (CSV, PDF)
- Estrutura de dados que permita expansão futura
- Integração com serviços externos (Stripe, serviços de e-mail)
# 6. Arquitetura do Sistema

## 6.1 Visão Geral da Arquitetura

O RH Master será desenvolvido como uma aplicação web moderna, utilizando uma arquitetura de três camadas:

1. **Frontend**: Interface de usuário responsiva e intuitiva
2. **Backend**: API RESTful para processamento de lógica de negócios
3. **Banco de Dados**: Armazenamento persistente de dados

![Arquitetura do Sistema](arquitetura_sistema.png)

## 6.2 Componentes Principais

### 6.2.1 Frontend
- Aplicação web responsiva desenvolvida com React e Vite
- Componentes de UI utilizando ShadcnUI para consistência visual
- Design system baseado na identidade visual do RH Master
- Componentes reutilizáveis para consistência visual
- Estado gerenciado com Redux ou Context API
- Comunicação com backend via chamadas de API RESTful
- Interface Kanban implementada com biblioteca de drag-and-drop

### 6.2.2 Backend
- API RESTful desenvolvida com Node.js e Express
- Autenticação e autorização via JWT (JSON Web Tokens)
- Middleware para validação de requisições e tratamento de erros
- Serviços separados por domínio (usuários, testes, gamificação)
- Integração com serviços de e-mail para envio de convites
- Integração com Stripe para processamento de assinaturas
- Integração com API do Gemini 2.0 Flash para assistentes virtuais de IA

### 6.2.3 Banco de Dados
- PostgreSQL como banco de dados principal
- Modelagem de dados otimizada para consultas frequentes
- Índices para melhorar performance de consultas
- Backup automatizado diário
- Migrations para controle de versão do schema

## 6.3 Integrações Externas

### 6.3.1 Serviço de E-mail
- Integração com serviço como SendGrid ou AWS SES
- Templates personalizáveis para diferentes tipos de e-mail
- Rastreamento de entregas e aberturas

### 6.3.2 Gateway de Pagamento
- Integração com Stripe
- Processamento seguro de pagamentos recorrentes
- Gestão de assinaturas e ciclos de cobrança
- Webhooks para atualização de status de pagamento

### 6.3.3 Serviço de Armazenamento
- Armazenamento de arquivos estáticos em serviço como AWS S3
- CDN para entrega otimizada de assets

### 6.3.4 API de IA
- Integração com API do Gemini 2.0 Flash
- Processamento de linguagem natural para assistentes virtuais
- Análise de dados para insights personalizados

## 6.4 Considerações de Segurança

- Todas as comunicações via HTTPS
- Dados sensíveis criptografados em repouso
- Autenticação segura com tokens JWT de curta duração
- Validação de entrada em todas as APIs
- Proteção contra ataques comuns (CSRF, XSS, SQL Injection)
- Auditoria de ações sensíveis
- Segurança em transações financeiras via Stripe

## 6.5 Escalabilidade

- Arquitetura stateless para facilitar escalabilidade horizontal
- Balanceamento de carga para distribuir tráfego
- Caching para reduzir carga no banco de dados
- Otimização de consultas para grandes volumes de dados
- Índices eficientes no PostgreSQL
# 7. Modelos de Planos e Preços

## 7.1 Estrutura de Planos

O RH Master oferecerá três níveis de planos de assinatura para atender diferentes perfis de mentores, desde profissionais independentes até empresas de consultoria. Todos os planos funcionarão com modelo de assinatura mensal recorrente, processados através da plataforma Stripe.

### 7.1.1 Plano Básico

**Preço:** R$ 79,90/mês

**Características:**
- Acesso a até 10 clientes simultâneos
- Três testes comportamentais disponíveis:
  - Perfil Comportamental (Águia, Gato, Lobo e Tubarão)
  - Teste de Inteligência Emocional
  - Teste de Eneagrama
- Dashboard básico com métricas essenciais
- Sistema de gamificação simplificado
- Relatórios básicos de resultados
- E-mails de convite com template padrão
- Acesso limitado ao assistente virtual de IA
- Interface Kanban simplificada
- Suporte por e-mail

**Público-alvo:** Mentores iniciantes ou com poucos clientes, profissionais que estão testando a plataforma.

### 7.1.2 Plano Profissional

**Preço:** R$ 149,90/mês

**Características:**
- Acesso a até 30 clientes simultâneos
- Três testes comportamentais disponíveis (mesmos do plano básico)
- Dashboard completo com métricas avançadas
- Sistema de gamificação avançado
- Relatórios detalhados e exportáveis (PDF, CSV)
- Personalização de e-mails de convite
- Acesso completo ao assistente virtual de IA
- Interface Kanban completa com recursos avançados
- Agrupamento de clientes por categorias
- Suporte por e-mail e chat

**Público-alvo:** Mentores estabelecidos com carteira média de clientes, consultores independentes.

### 7.1.3 Plano Enterprise

**Preço:** R$ 299,90/mês

**Características:**
- Acesso ilimitado a clientes
- Três testes comportamentais disponíveis (mesmos dos outros planos)
- Dashboard completo com métricas avançadas e personalizáveis
- Sistema de gamificação avançado com regras personalizáveis
- Relatórios avançados com análise comparativa e tendências
- Personalização de marca nos e-mails e interface (white-label)
- Acesso prioritário ao assistente virtual de IA com recursos exclusivos
- Interface Kanban avançada com automações personalizáveis
- Múltiplos usuários administradores (até 3)
- Suporte prioritário por e-mail, chat e telefone
- Onboarding personalizado

**Público-alvo:** Empresas de consultoria, equipes de mentores, profissionais com grande volume de clientes.

## 7.2 Política de Pagamentos

- Cobrança mensal recorrente via Stripe (cartão de crédito)
- Opção de pagamento anual com desconto de 15%
- Período de teste gratuito de 14 dias para novos usuários
- Garantia de satisfação de 30 dias com reembolso integral
- Faturas automáticas enviadas por e-mail

## 7.3 Upgrades e Downgrades

- Possibilidade de upgrade de plano a qualquer momento
- Cobrança proporcional ao mudar de plano durante o ciclo de faturamento
- Downgrade efetivo apenas no próximo ciclo de faturamento
- Sem perda de dados ao fazer downgrade, apenas limitação de acesso a recursos
- Processo simplificado gerenciado pela integração com Stripe

## 7.4 Expansão Futura de Planos

Para versões futuras após o MVP, considera-se:

- Plano personalizado para grandes empresas
- Opções de add-ons para recursos específicos
- Pacotes de testes adicionais
- Descontos para instituições educacionais e ONGs
- Planos com recursos avançados de IA
# 13. Schema do Banco de Dados

## 13.1 Visão Geral do Banco de Dados

O RH Master utilizará PostgreSQL como sistema de gerenciamento de banco de dados relacional. A estrutura do banco foi projetada para suportar todas as funcionalidades da plataforma de forma eficiente e escalável.

## 13.2 Diagrama de Entidade-Relacionamento

![Diagrama ER](diagrama_er.png)

## 13.3 Tabelas Principais

### 13.3.1 Users

Armazena informações de todos os usuários do sistema (mentores e clientes).

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    profile_image VARCHAR(255),
    user_type ENUM('mentor', 'client') NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_login TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);
```

### 13.3.2 Mentors

Armazena informações específicas dos mentores.

```sql
CREATE TABLE mentors (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    bio TEXT,
    website VARCHAR(255),
    phone VARCHAR(20),
    subscription_plan ENUM('basic', 'professional', 'enterprise') NOT NULL,
    subscription_status ENUM('active', 'trial', 'canceled', 'expired') NOT NULL,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    trial_ends_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 13.3.3 Clients

Armazena informações específicas dos clientes.

```sql
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mentor_id INTEGER NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    position VARCHAR(255),
    company VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 13.3.4 Invitations

Gerencia os convites enviados pelos mentores aos clientes.

```sql
CREATE TABLE invitations (
    id SERIAL PRIMARY KEY,
    mentor_id INTEGER NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    custom_message TEXT,
    status ENUM('pending', 'accepted', 'expired') NOT NULL DEFAULT 'pending',
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 13.3.5 Tests

Armazena os tipos de testes disponíveis na plataforma.

```sql
CREATE TABLE tests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    instructions TEXT NOT NULL,
    estimated_time INTEGER NOT NULL, -- em minutos
    question_count INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 13.3.6 Questions

Armazena as perguntas de cada teste.

```sql
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    test_id INTEGER NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_order INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 13.3.7 Options

Armazena as opções de resposta para cada pergunta.

```sql
CREATE TABLE options (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    option_order INTEGER NOT NULL,
    profile_type VARCHAR(50), -- para o teste de perfil comportamental
    dimension VARCHAR(50), -- para o teste de inteligência emocional
    enneagram_type INTEGER, -- para o teste de eneagrama
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 13.3.8 TestAssignments

Gerencia a atribuição de testes aos clientes.

```sql
CREATE TABLE test_assignments (
    id SERIAL PRIMARY KEY,
    mentor_id INTEGER NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    test_id INTEGER NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    status ENUM('assigned', 'in_progress', 'completed', 'expired') NOT NULL DEFAULT 'assigned',
    deadline TIMESTAMP,
    assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 13.3.9 TestResponses

Armazena as respostas dos clientes aos testes.

```sql
CREATE TABLE test_responses (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER NOT NULL REFERENCES test_assignments(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_id INTEGER NOT NULL REFERENCES options(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 13.3.10 TestResults

Armazena os resultados processados dos testes.

```sql
CREATE TABLE test_results (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER NOT NULL REFERENCES test_assignments(id) ON DELETE CASCADE,
    result_data JSONB NOT NULL, -- armazena resultados específicos de cada tipo de teste
    summary TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 13.3.11 GamificationPoints

Gerencia os pontos de gamificação dos clientes.

```sql
CREATE TABLE gamification_points (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    assignment_id INTEGER NOT NULL REFERENCES test_assignments(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    reason VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 13.3.12 Achievements

Armazena as conquistas desbloqueadas pelos clientes.

```sql
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 13.3.13 ClientAchievements

Relaciona clientes e suas conquistas.

```sql
CREATE TABLE client_achievements (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(client_id, achievement_id)
);
```

### 13.3.14 AIAssistantInteractions

Registra as interações dos usuários com os assistentes virtuais de IA.

```sql
CREATE TABLE ai_assistant_interactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_type ENUM('mentor', 'client') NOT NULL,
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 13.3.15 Subscriptions

Gerencia as assinaturas dos mentores.

```sql
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    mentor_id INTEGER NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    plan ENUM('basic', 'professional', 'enterprise') NOT NULL,
    status ENUM('active', 'canceled', 'expired') NOT NULL,
    stripe_subscription_id VARCHAR(255) NOT NULL,
    current_period_start TIMESTAMP NOT NULL,
    current_period_end TIMESTAMP NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 13.3.16 Payments

Registra os pagamentos realizados pelos mentores.

```sql
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    mentor_id INTEGER NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    subscription_id INTEGER NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
    stripe_payment_id VARCHAR(255) NOT NULL,
    status ENUM('succeeded', 'pending', 'failed') NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## 13.4 Índices

Para otimizar o desempenho do banco de dados, os seguintes índices serão criados:

```sql
-- Índices para busca rápida de usuários
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);

-- Índices para relacionamentos frequentemente consultados
CREATE INDEX idx_clients_mentor_id ON clients(mentor_id);
CREATE INDEX idx_test_assignments_client_id ON test_assignments(client_id);
CREATE INDEX idx_test_assignments_mentor_id ON test_assignments(mentor_id);
CREATE INDEX idx_test_responses_assignment_id ON test_responses(assignment_id);

-- Índices para consultas de gamificação
CREATE INDEX idx_gamification_points_client_id ON gamification_points(client_id);
CREATE INDEX idx_client_achievements_client_id ON client_achievements(client_id);

-- Índices para consultas de pagamento
CREATE INDEX idx_subscriptions_mentor_id ON subscriptions(mentor_id);
CREATE INDEX idx_payments_mentor_id ON payments(mentor_id);
```

## 13.5 Constraints e Integridade Referencial

O banco de dados utiliza chaves estrangeiras (FOREIGN KEY) para garantir a integridade referencial entre as tabelas. Além disso, constraints UNIQUE são aplicadas onde necessário para evitar duplicação de dados críticos.

## 13.6 Migrations e Versionamento

O schema do banco de dados será gerenciado através de migrations, permitindo:

- Controle de versão do schema
- Atualizações incrementais
- Rollback de alterações quando necessário
- Sincronização entre ambientes (desenvolvimento, teste, produção)

As migrations serão executadas automaticamente durante o deploy da aplicação.
# 14. Assistentes Virtuais de IA

## 14.1 Visão Geral

O RH Master integrará assistentes virtuais de IA baseados no modelo Gemini 2.0 Flash em ambos os dashboards (mentor e cliente). Estes assistentes fornecerão suporte contextual, insights personalizados e recomendações baseadas nos dados disponíveis na plataforma.

## 14.2 Assistente Virtual para Mentores

### 14.2.1 Funcionalidades Principais

- **Análise de Perfis**: Fornece insights aprofundados sobre os perfis comportamentais dos clientes
- **Recomendações Personalizadas**: Sugere abordagens de mentoria baseadas nos resultados dos testes
- **Interpretação de Dados**: Ajuda a interpretar padrões e tendências nos resultados dos clientes
- **Suporte à Decisão**: Auxilia na tomada de decisões sobre atribuição de testes e desenvolvimento de clientes
- **Resposta a Perguntas**: Esclarece dúvidas sobre funcionalidades da plataforma e interpretação de resultados

### 14.2.2 Casos de Uso

- Análise comparativa entre diferentes perfis de clientes
- Sugestão de próximos passos no desenvolvimento de um cliente específico
- Identificação de padrões comportamentais em grupos de clientes
- Recomendação de abordagens para diferentes tipos de personalidade
- Esclarecimento de dúvidas sobre metodologias de testes comportamentais

### 14.2.3 Interface de Interação

- Chat persistente acessível em todas as páginas do dashboard
- Painel de sugestões proativas baseadas no contexto atual
- Opção de consultas por voz
- Histórico de interações pesquisável
- Capacidade de exportar insights para relatórios

## 14.3 Assistente Virtual para Clientes

### 14.3.1 Funcionalidades Principais

- **Orientação nos Testes**: Auxilia os clientes durante a realização dos testes
- **Explicação de Resultados**: Ajuda a interpretar os resultados dos testes de forma personalizada
- **Sugestões de Desenvolvimento**: Oferece dicas práticas para desenvolvimento pessoal
- **Esclarecimento de Dúvidas**: Responde perguntas sobre os testes e conceitos relacionados
- **Suporte Técnico**: Auxilia com questões técnicas da plataforma

### 14.3.2 Casos de Uso

- Esclarecimento de dúvidas durante a realização de um teste
- Explicação detalhada sobre o significado de um resultado específico
- Sugestões práticas para desenvolver áreas de melhoria identificadas
- Orientação sobre como aplicar os insights dos testes no ambiente profissional
- Resolução de problemas técnicos básicos na plataforma

### 14.3.3 Interface de Interação

- Chat acessível em todas as páginas do dashboard
- Assistente contextual durante a realização dos testes
- Interface simplificada e amigável
- Sugestões proativas baseadas na navegação e resultados
- Opção de feedback sobre a utilidade das respostas

## 14.4 Especificações Técnicas

### 14.4.1 Modelo de IA

- **Base**: Gemini 2.0 Flash
- **Capacidades**: Processamento de linguagem natural, análise contextual, geração de texto
- **Idiomas**: Português (principal), com suporte a inglês e espanhol
- **Tempo de Resposta**: Inferior a 2 segundos para consultas padrão

### 14.4.2 Integração

- API REST para comunicação com o modelo Gemini
- Cache de respostas frequentes para otimização de desempenho
- Sistema de fallback para casos de indisponibilidade da API
- Monitoramento de uso e qualidade das respostas

### 14.4.3 Personalização

- Treinamento com dados específicos do domínio de desenvolvimento de liderança
- Adaptação contextual baseada no perfil do usuário
- Ajuste de tom e complexidade de acordo com o usuário
- Capacidade de aprendizado contínuo com base nas interações

### 14.4.4 Privacidade e Segurança

- Conformidade com LGPD para tratamento de dados pessoais
- Não armazenamento de informações sensíveis nas consultas
- Anonimização de dados para treinamento
- Opção de exclusão de histórico de interações
- Transparência sobre o uso de IA nas interações

## 14.5 Limitações e Considerações

- O assistente virtual não substitui o papel do mentor humano
- Respostas são baseadas em padrões e dados disponíveis, não em avaliação clínica
- Possibilidade de respostas genéricas para consultas muito específicas
- Dependência da qualidade da conexão de internet para respostas em tempo real
- Necessidade de revisão humana para recomendações críticas

## 14.6 Evolução Futura

- Implementação de recursos de análise de sentimento
- Personalização mais profunda baseada no histórico de interações
- Suporte a mais idiomas
- Integração com fontes externas de conhecimento
- Capacidade de processamento de imagens e documentos
# 15. Integração com Gateway de Pagamento Stripe

## 15.1 Visão Geral

O RH Master utilizará o Stripe como gateway de pagamento para processar todas as transações financeiras relacionadas às assinaturas dos mentores. Esta integração permitirá um gerenciamento eficiente de assinaturas recorrentes, oferecendo uma experiência segura e confiável tanto para a plataforma quanto para os usuários.

## 15.2 Funcionalidades da Integração

### 15.2.1 Processamento de Assinaturas
- Criação e gerenciamento de planos de assinatura (Básico, Profissional, Enterprise)
- Cobrança automática recorrente (mensal ou anual)
- Processamento de upgrades e downgrades de planos
- Cálculo automático de valores proporcionais em mudanças de plano
- Gerenciamento de períodos de teste gratuito

### 15.2.2 Métodos de Pagamento
- Cartões de crédito nacionais e internacionais
- Cartões de débito (onde aplicável)
- Possibilidade de expansão para PIX e boleto bancário em atualizações futuras
- Armazenamento seguro de métodos de pagamento para cobranças recorrentes

### 15.2.3 Gestão de Assinantes
- Criação de perfis de clientes no Stripe (Customer)
- Vinculação de métodos de pagamento aos perfis
- Histórico completo de transações por cliente
- Gestão de status de assinatura (ativa, cancelada, em atraso)

### 15.2.4 Tratamento de Eventos
- Webhooks para notificações em tempo real de eventos de pagamento
- Tratamento automático de falhas de pagamento
- Notificações de cartões prestes a expirar
- Alertas de pagamentos recusados

## 15.3 Fluxos de Pagamento

### 15.3.1 Cadastro e Primeira Assinatura
1. Mentor seleciona um plano durante o cadastro
2. Sistema redireciona para checkout seguro do Stripe
3. Mentor insere dados de pagamento no ambiente seguro do Stripe
4. Stripe processa o pagamento e retorna resultado
5. Sistema ativa a assinatura e libera acesso às funcionalidades

### 15.3.2 Renovação Automática
1. Stripe tenta cobrar automaticamente o valor da assinatura na data de renovação
2. Em caso de sucesso, sistema estende o período de assinatura
3. Em caso de falha, sistema inicia processo de retry e notifica o mentor

### 15.3.3 Cancelamento
1. Mentor solicita cancelamento através do dashboard
2. Sistema confirma intenção de cancelamento
3. Stripe é notificado para cancelar a renovação automática
4. Acesso permanece ativo até o final do período pago
5. Sistema notifica mentor sobre data de encerramento do acesso

### 15.3.4 Upgrade/Downgrade de Plano
1. Mentor seleciona novo plano no dashboard
2. Sistema calcula valor proporcional (em caso de upgrade)
3. Stripe processa a mudança de plano e ajuste de valores
4. Sistema atualiza permissões e acesso às funcionalidades

## 15.4 Segurança e Conformidade

### 15.4.1 Proteção de Dados
- Conformidade com PCI DSS para processamento seguro de cartões
- Tokenização de dados sensíveis de pagamento
- Nenhum dado de cartão armazenado nos servidores do RH Master
- Transmissão de dados via conexões criptografadas (TLS)

### 15.4.2 Prevenção de Fraudes
- Utilização do Stripe Radar para detecção automática de fraudes
- Verificação de endereço (AVS) e código de segurança (CVC)
- Monitoramento de padrões suspeitos de transação
- Processo de revisão para transações sinalizadas como risco

### 15.4.3 Conformidade Legal
- Emissão automática de recibos e faturas
- Conformidade com regulamentações fiscais brasileiras
- Suporte a notas fiscais quando necessário
- Armazenamento de registros de transação pelo período legal exigido

## 15.5 Implementação Técnica

### 15.5.1 Componentes de Integração
- Stripe.js para integração segura no frontend
- Stripe Elements para formulários de pagamento personalizados
- API Stripe no backend para gerenciamento de assinaturas
- Webhooks para processamento assíncrono de eventos

### 15.5.2 Ambiente de Desenvolvimento
- Chaves de API separadas para ambientes de desenvolvimento e produção
- Modo de teste para simulação de cenários de pagamento
- Logs detalhados para depuração de transações
- Dashboard administrativo do Stripe para monitoramento

### 15.5.3 Monitoramento e Relatórios
- Painel de controle para acompanhamento de métricas financeiras
- Relatórios de receita recorrente mensal (MRR)
- Análise de churn e retenção
- Exportação de dados financeiros para integração contábil

## 15.6 Considerações Futuras

- Implementação de métodos de pagamento adicionais (PIX, boleto)
- Suporte a múltiplas moedas para expansão internacional
- Integração com sistemas de contabilidade
- Implementação de programas de afiliados e comissões
- Suporte a cupons de desconto e promoções sazonais
# 16. Interface Kanban para Atribuição de Testes

## 16.1 Visão Geral

A interface Kanban para atribuição de testes é uma funcionalidade exclusiva do dashboard do mentor, projetada para tornar o processo de atribuição de testes aos clientes mais visual, intuitivo e eficiente. Utilizando o conceito de arrastar e soltar (drag-and-drop), os mentores poderão facilmente gerenciar quais testes estarão disponíveis para cada cliente.

## 16.2 Design e Layout

### 16.2.1 Estrutura Principal

A interface Kanban será organizada em um sistema de colunas:

- **Coluna de Testes Disponíveis**: Localizada à esquerda, contém cards representando os três testes comportamentais disponíveis na plataforma.
- **Colunas de Clientes**: Localizadas à direita, cada coluna representa um cliente específico e contém os testes atribuídos a ele.

### 16.2.2 Cards de Teste

Cada teste será representado por um card visual contendo:

- **Título do Teste**: Nome do teste comportamental
- **Ícone Representativo**: Símbolo visual que identifica o tipo de teste
- **Breve Descrição**: Resumo conciso do objetivo do teste
- **Tempo Estimado**: Indicação do tempo médio para conclusão
- **Número de Questões**: Quantidade total de perguntas

### 16.2.3 Elementos Visuais

- **Esquema de Cores**: Utilização das cores da identidade visual (verde-azulado e dourado)
- **Indicadores de Status**: Cores ou ícones que mostram o status de cada teste (pendente, em andamento, concluído)
- **Animações Suaves**: Feedback visual durante as operações de arrastar e soltar
- **Design Responsivo**: Adaptação para diferentes tamanhos de tela

## 16.3 Funcionalidades

### 16.3.1 Atribuição de Testes

- **Arrastar e Soltar**: Mentor arrasta um card de teste da coluna de disponíveis para a coluna de um cliente
- **Cópia Automática**: O teste permanece disponível na coluna de origem para ser atribuído a outros clientes
- **Confirmação Visual**: Animação e feedback visual confirmando a atribuição bem-sucedida
- **Definição de Prazo**: Opção para adicionar prazo de conclusão ao atribuir um teste

### 16.3.2 Gerenciamento de Atribuições

- **Remoção de Testes**: Opção para remover um teste atribuído que ainda não foi iniciado
- **Filtros de Visualização**: Possibilidade de filtrar por status de teste ou por cliente
- **Ordenação de Clientes**: Opções para ordenar colunas de clientes por nome, data de cadastro ou atividade
- **Busca Rápida**: Campo de busca para localizar clientes específicos

### 16.3.3 Monitoramento de Status

- **Atualização em Tempo Real**: Status dos testes atualizados automaticamente
- **Indicadores Visuais**: Cores e ícones diferentes para cada status (pendente, em andamento, concluído)
- **Notificações**: Alertas visuais quando um cliente conclui um teste
- **Prazos**: Indicadores de proximidade de prazo (quando definido)

### 16.3.4 Ações Contextuais

- **Menu de Opções**: Acesso a ações específicas ao clicar em um card de teste
- **Visualização Rápida**: Preview de resultados para testes concluídos
- **Envio de Lembretes**: Opção para enviar lembrete ao cliente sobre teste pendente
- **Definição de Prioridade**: Marcação de testes como prioritários

## 16.4 Interação e Usabilidade

### 16.4.1 Operações de Arrastar e Soltar

- **Feedback Tátil**: Alteração visual do cursor e do card durante a operação
- **Áreas de Destino Destacadas**: Destaque visual das áreas onde o card pode ser solto
- **Prevenção de Erros**: Validação para evitar atribuições duplicadas ou inválidas
- **Desfazer/Refazer**: Opção para reverter ações recentes

### 16.4.2 Personalização da Visualização

- **Ajuste de Densidade**: Opção para visualizar mais ou menos informações em cada card
- **Modo Compacto/Expandido**: Alternância entre visualização detalhada ou resumida
- **Temas de Cores**: Opções de personalização visual (disponível no plano Enterprise)
- **Salvamento de Preferências**: Memorização das configurações de visualização do usuário

### 16.4.3 Acessibilidade

- **Navegação por Teclado**: Suporte a operações sem uso do mouse
- **Etiquetas ARIA**: Compatibilidade com leitores de tela
- **Contraste Adequado**: Cores que garantem legibilidade
- **Textos Alternativos**: Descrições para elementos visuais

## 16.5 Implementação Técnica

### 16.5.1 Tecnologias Utilizadas

- **React DnD**: Biblioteca para funcionalidade de arrastar e soltar
- **ShadcnUI**: Componentes visuais consistentes com o restante da plataforma
- **React Query**: Gerenciamento de estado e sincronização com o backend
- **Framer Motion**: Animações suaves e feedback visual

### 16.5.2 Responsividade

- **Layout Adaptativo**: Reorganização de colunas em telas menores
- **Modo Móvel**: Interface simplificada para uso em tablets e smartphones
- **Gestos Touch**: Suporte a interações por toque em dispositivos móveis
- **Breakpoints**: Ajustes específicos para diferentes tamanhos de tela

### 16.5.3 Performance

- **Carregamento Otimizado**: Renderização eficiente mesmo com muitos clientes
- **Paginação**: Carregamento sob demanda para grandes volumes de dados
- **Virtualização**: Renderização apenas dos elementos visíveis na tela
- **Sincronização Eficiente**: Atualizações em tempo real sem sobrecarga

## 16.6 Evolução Futura

- **Automações**: Regras para atribuição automática de testes baseada em critérios
- **Templates de Atribuição**: Conjuntos pré-definidos de testes para atribuição em grupo
- **Sequenciamento**: Definição de ordem recomendada para realização dos testes
- **Análise Avançada**: Visualização de métricas de conclusão e engajamento diretamente na interface
- **Personalização de Testes**: Ajuste de parâmetros específicos para cada atribuição
# 17. Landing Page de Alta Conversão

## 17.1 Visão Geral

A landing page do RH Master será projetada com foco em alta conversão, utilizando princípios de design persuasivo e otimização para transformar visitantes em assinantes. A página apresentará a proposta de valor da plataforma de forma clara e convincente, destacando os benefícios para mentores de liderança e desenvolvimento profissional.

## 17.2 Estrutura e Seções

### 17.2.1 Header
- Logo do RH Master em destaque
- Menu de navegação simplificado (Funcionalidades, Planos, Depoimentos, FAQ)
- CTA primário "Comece Grátis" destacado com cor dourada
- CTA secundário "Agendar Demonstração"
- Opção de login para usuários existentes

### 17.2.2 Hero Section
- Headline principal focada no benefício-chave: "Transforme sua Mentoria com Insights Baseados em Dados"
- Subheadline explicativa: "Plataforma completa para mentores aplicarem testes comportamentais, acompanharem resultados e potencializarem o desenvolvimento de seus clientes"
- CTA destacado "Experimente Grátis por 14 Dias"
- Imagem ou animação mostrando o dashboard do mentor em ação
- Social proof: "Utilizado por mais de X mentores profissionais"

### 17.2.3 Benefícios Principais
- 3-4 cards destacando os principais benefícios:
  - "Convide seus clientes com apenas um clique"
  - "Atribua testes com interface visual intuitiva"
  - "Obtenha insights com assistente de IA integrado"
  - "Acompanhe o progresso com sistema de gamificação exclusivo"
- Ícones representativos para cada benefício
- Breve descrição explicativa sob cada título

### 17.2.4 Demonstração Visual
- Vídeo demonstrativo de 60-90 segundos mostrando as principais funcionalidades
- Alternativa: Slider interativo com screenshots das principais telas
- Legendas explicativas destacando recursos-chave
- CTA contextual "Veja como é simples começar"

### 17.2.5 Funcionalidades Detalhadas
- Seção dividida em 3 colunas ou tabs:
  - Sistema de Convites e Gerenciamento de Clientes
  - Testes Comportamentais e Interface Kanban
  - Assistentes de IA e Insights Personalizados
- Cada funcionalidade com imagem ilustrativa, título e descrição concisa
- Ícones para representar visualmente cada recurso

### 17.2.6 Depoimentos de Usuários
- 3-5 depoimentos de mentores reais (com foto, nome e especialidade)
- Citações curtas e impactantes sobre resultados obtidos
- Métricas de sucesso quando disponíveis (ex: "aumentei minha base de clientes em 40%")
- Logos de empresas ou instituições parceiras (social proof)

### 17.2.7 Comparativo de Planos
- Tabela clara comparando os três planos (Básico, Profissional, Enterprise)
- Destaque visual para o plano Profissional como "Mais Popular"
- Listagem de recursos incluídos em cada plano
- Preços com destaque para o valor mensal
- Menção ao desconto para pagamento anual
- CTA específico para cada plano

### 17.2.8 Garantia e Segurança
- Selo de "Garantia de Satisfação de 30 Dias"
- Ícones de segurança e privacidade de dados
- Menção à conformidade com LGPD
- Breve texto tranquilizando sobre cancelamento sem burocracia

### 17.2.9 Perguntas Frequentes (FAQ)
- 6-8 perguntas mais comuns com respostas concisas
- Sistema de acordeão para economizar espaço
- CTA para contato caso a dúvida não esteja respondida
- Perguntas estratégicas que abordam objeções comuns

### 17.2.10 CTA Final
- Seção dedicada com fundo contrastante
- Headline persuasiva: "Eleve sua Mentoria ao Próximo Nível"
- Subheadline reforçando a proposta de valor
- CTA grande e destacado: "Comece seu Período Gratuito"
- Menção à não necessidade de cartão de crédito para teste

### 17.2.11 Footer
- Links para páginas importantes (Termos de Uso, Política de Privacidade)
- Contato e suporte
- Links para redes sociais
- Copyright e informações legais

## 17.3 Elementos de Conversão

### 17.3.1 Call-to-Actions (CTAs)
- Botões com cores contrastantes (dourado sobre fundo verde-azulado)
- Texto acionável e direto ("Comece Grátis", "Ver Demonstração")
- Posicionamento estratégico ao longo da página
- Tamanho adequado para destaque visual
- Micro-animações no hover para feedback visual

### 17.3.2 Social Proof
- Contador de usuários ativos
- Depoimentos com fotos reais
- Logos de empresas parceiras ou clientes conhecidos
- Selos de certificações ou prêmios relevantes
- Avaliações e estrelas (quando disponíveis)

### 17.3.3 Elementos de Escassez e Urgência
- Banner temporário para promoções especiais
- Contador regressivo para ofertas limitadas
- Menção a vagas limitadas para determinados planos
- Indicadores de alta demanda ("X pessoas se cadastraram hoje")

### 17.3.4 Redução de Atrito
- Formulário de cadastro simplificado (apenas e-mail para iniciar)
- Menção explícita a "Sem necessidade de cartão de crédito"
- FAQ estratégico abordando principais objeções
- Chat de suporte disponível para dúvidas imediatas
- Garantia de satisfação e política de cancelamento clara

## 17.4 Design e Experiência do Usuário

### 17.4.1 Identidade Visual
- Utilização consistente das cores da marca (verde-azulado e dourado)
- Tipografia limpa e profissional
- Iconografia moderna e coerente
- Imagens de alta qualidade mostrando a plataforma em uso
- Espaço em branco adequado para respiro visual

### 17.4.2 Responsividade
- Design mobile-first garantindo experiência otimizada em smartphones
- Adaptação fluida para tablets e desktops
- Elementos touch-friendly para dispositivos móveis
- Testes em múltiplos dispositivos e navegadores
- Carregamento otimizado para conexões móveis

### 17.4.3 Performance
- Otimização de imagens para carregamento rápido
- Lazy loading para conteúdo abaixo da dobra
- Tempo de carregamento total inferior a 3 segundos
- Core Web Vitals otimizados (LCP, FID, CLS)
- Caching adequado para recursos estáticos

### 17.4.4 Acessibilidade
- Conformidade com WCAG 2.1 nível AA
- Contraste adequado para texto e elementos interativos
- Textos alternativos para imagens
- Navegação possível via teclado
- Estrutura semântica adequada

## 17.5 Otimização para Conversão

### 17.5.1 A/B Testing
- Testes planejados para headlines alternativas
- Variações de cores e posicionamento de CTAs
- Diferentes formatos de apresentação de preços
- Testes de diferentes propostas de valor
- Otimização contínua baseada em dados

### 17.5.2 Analytics e Métricas
- Implementação de Google Analytics 4
- Funil de conversão claramente definido
- Eventos personalizados para ações importantes
- Heatmaps para análise de comportamento
- Gravações de sessão para insights qualitativos

### 17.5.3 SEO On-page
- Headline H1 otimizada para termos-chave
- Meta tags otimizadas (título e descrição)
- Estrutura de headings hierárquica (H1-H6)
- URLs amigáveis e descritivas
- Schema markup para rich snippets
- Otimização para palavras-chave relacionadas a mentoria e desenvolvimento de liderança

### 17.5.4 Estratégias de Remarketing
- Pixel de Facebook para campanhas de remarketing
- Tag de Google Ads para campanhas de display
- Pop-up de saída com oferta especial
- Captura de e-mail para nutrição via e-mail marketing
- Segmentação por interesse e comportamento na página

## 17.6 Implementação Técnica

### 17.6.1 Tecnologias
- Desenvolvimento com React e Vite para performance otimizada
- Componentes ShadcnUI para consistência visual
- Animações leves com Framer Motion
- Formulários com validação em tempo real
- Integração direta com API de cadastro e autenticação

### 17.6.2 Integrações
- Conexão com CRM para gestão de leads
- Integração com plataforma de e-mail marketing
- Webhook para notificações de novos cadastros
- Conexão com Stripe para processamento de assinaturas
- Integração com ferramentas de chat e suporte
# Prompts de Implementação para IA

Este documento contém prompts específicos para auxiliar no desenvolvimento do RH Master utilizando IA. Cada prompt é focado em uma funcionalidade específica do sistema e fornece instruções detalhadas para implementação.

## Prompt 1: Implementação do Frontend com React, Vite e ShadcnUI

```
Desenvolva o frontend do RH Master, uma plataforma SaaS para mentores treinarem seus líderes/clientes. Utilize React com Vite como framework e ShadcnUI para componentes de interface.

Especificações técnicas:
- Framework: React com Vite
- Biblioteca de componentes: ShadcnUI
- Gerenciamento de estado: React Context API ou Redux
- Roteamento: React Router
- Estilização: Tailwind CSS (integrado ao ShadcnUI)
- Requisitos de responsividade: Desktop, tablet e mobile

A aplicação deve ter as seguintes rotas principais:
1. Landing page pública
2. Páginas de autenticação (login/cadastro)
3. Dashboard do mentor
4. Dashboard do cliente
5. Interface de testes comportamentais
6. Sistema de convites
7. Configurações de conta e assinatura

Identidade visual:
- Cores primárias: Verde-azulado (#006B6B) e Dourado (#C9A227)
- Cores secundárias: Verde-azulado claro (#4CA1A1), Dourado claro (#E5C76B)
- Tipografia: Fonte moderna e limpa (sugestão: Inter)

Implemente primeiro a estrutura básica do projeto, configurando o Vite, instalando as dependências necessárias e criando os componentes base. Em seguida, desenvolva as páginas principais seguindo a identidade visual especificada.

Priorize a implementação de componentes reutilizáveis para manter consistência visual em toda a aplicação.
```

## Prompt 2: Implementação da Interface Kanban para Atribuição de Testes

```
Desenvolva a interface Kanban para atribuição de testes no dashboard do mentor do RH Master. Esta interface deve permitir que mentores atribuam testes aos seus clientes através de um sistema visual de arrastar e soltar.

Especificações técnicas:
- Framework: React com Vite
- Biblioteca para drag-and-drop: React DnD ou react-beautiful-dnd
- Componentes visuais: ShadcnUI
- Animações: Framer Motion

Estrutura da interface:
1. Uma coluna à esquerda contendo cards dos três testes disponíveis (Perfil Comportamental, Inteligência Emocional, Eneagrama)
2. Múltiplas colunas à direita, cada uma representando um cliente do mentor
3. Funcionalidade para arrastar um teste da coluna de testes para a coluna de um cliente específico

Cada card de teste deve conter:
- Título do teste
- Ícone representativo
- Breve descrição
- Tempo estimado para conclusão
- Número de questões

Funcionalidades necessárias:
- Arrastar e soltar testes para atribuição
- Feedback visual durante a operação de arrastar
- Confirmação visual após atribuição bem-sucedida
- Opção para definir prazo para conclusão do teste
- Indicadores de status para testes já atribuídos (pendente, em andamento, concluído)
- Filtros para visualizar clientes específicos
- Busca por nome de cliente

Garanta que a interface seja responsiva e funcione bem em diferentes tamanhos de tela. Implemente validações para evitar atribuições duplicadas e forneça feedback claro ao usuário durante todas as interações.
```

## Prompt 3: Implementação dos Assistentes Virtuais de IA com Gemini 2.0 Flash

```
Desenvolva os assistentes virtuais de IA para o RH Master utilizando a API do Gemini 2.0 Flash. A plataforma requer dois assistentes distintos: um para o dashboard do mentor e outro para o dashboard do cliente.

Especificações técnicas:
- Modelo de IA: Gemini 2.0 Flash
- Integração: API REST
- Idioma principal: Português
- Tempo de resposta desejado: < 2 segundos

Assistente do Mentor:
1. Funcionalidades:
   - Análise de perfis comportamentais dos clientes
   - Recomendações personalizadas para abordagens de mentoria
   - Interpretação de padrões e tendências nos resultados
   - Suporte à decisão para atribuição de testes
   - Resposta a perguntas sobre a plataforma e metodologias

2. Interface:
   - Chat persistente acessível em todas as páginas do dashboard
   - Painel de sugestões proativas baseadas no contexto atual
   - Histórico de interações pesquisável
   - Opção para exportar insights para relatórios

Assistente do Cliente:
1. Funcionalidades:
   - Orientação durante a realização dos testes
   - Explicação personalizada dos resultados
   - Sugestões de desenvolvimento pessoal
   - Esclarecimento de dúvidas sobre os testes
   - Suporte técnico básico

2. Interface:
   - Chat acessível em todas as páginas do dashboard
   - Assistente contextual durante a realização dos testes
   - Interface simplificada e amigável
   - Sugestões proativas baseadas na navegação

Implemente o sistema de forma que:
- As interações sejam armazenadas no banco de dados para referência futura
- Haja um sistema de fallback para casos de indisponibilidade da API
- A privacidade dos dados seja mantida conforme LGPD
- O assistente aprimore suas respostas com base nas interações anteriores
- Exista um mecanismo de feedback para avaliar a qualidade das respostas

Forneça exemplos de prompts específicos para cada tipo de assistente que serão utilizados na integração com a API do Gemini.
```

## Prompt 4: Implementação do Schema de Banco de Dados PostgreSQL

```
Implemente o schema de banco de dados PostgreSQL para o RH Master, uma plataforma SaaS para mentores treinarem seus líderes/clientes. O banco de dados deve suportar todas as funcionalidades da plataforma de forma eficiente e escalável.

Crie os scripts SQL para as seguintes tabelas principais:
1. Users - informações de todos os usuários (mentores e clientes)
2. Mentors - informações específicas dos mentores
3. Clients - informações específicas dos clientes
4. Invitations - gerenciamento de convites
5. Tests - tipos de testes disponíveis
6. Questions - perguntas de cada teste
7. Options - opções de resposta para cada pergunta
8. TestAssignments - atribuição de testes aos clientes
9. TestResponses - respostas dos clientes aos testes
10. TestResults - resultados processados dos testes
11. GamificationPoints - pontos de gamificação dos clientes
12. Achievements - conquistas desbloqueáveis
13. ClientAchievements - relação entre clientes e conquistas
14. AIAssistantInteractions - interações com assistentes de IA
15. Subscriptions - assinaturas dos mentores
16. Payments - registros de pagamentos

Cada tabela deve incluir:
- Chaves primárias e estrangeiras apropriadas
- Tipos de dados otimizados para cada coluna
- Constraints necessárias (NOT NULL, UNIQUE, etc.)
- Timestamps para criação e atualização
- Enums para campos com valores predefinidos

Além disso, crie:
- Índices para otimizar consultas frequentes
- Migrations para controle de versão do schema
- Funções ou triggers para lógicas específicas (como cálculo de pontos de gamificação)

Garanta que o schema suporte:
- Relacionamentos corretos entre todas as entidades
- Integridade referencial
- Escalabilidade para crescimento futuro
- Consultas eficientes para as operações mais comuns

Forneça também exemplos de consultas SQL para operações comuns, como:
- Listar todos os clientes de um mentor específico
- Obter resultados de testes de um cliente
- Calcular ranking de gamificação
- Verificar status de assinatura de um mentor
```

## Prompt 5: Implementação da Integração com Stripe

```
Desenvolva a integração do gateway de pagamento Stripe para o RH Master, uma plataforma SaaS para mentores treinarem seus líderes/clientes. A integração deve gerenciar assinaturas recorrentes para os três planos disponíveis: Básico, Profissional e Enterprise.

Especificações técnicas:
- API Stripe para Node.js
- Webhooks para processamento de eventos
- Stripe.js e Elements para frontend
- Modo de teste para desenvolvimento

Implemente os seguintes fluxos de pagamento:
1. Cadastro e primeira assinatura:
   - Criação de Customer no Stripe
   - Configuração de método de pagamento
   - Criação de assinatura com período de teste gratuito
   - Redirecionamento após pagamento bem-sucedido

2. Renovação automática:
   - Configuração de cobranças recorrentes
   - Tratamento de falhas de pagamento
   - Sistema de retry para cartões recusados
   - Notificações de renovação

3. Cancelamento:
   - Interface para solicitação de cancelamento
   - Cancelamento programado para final do período
   - Confirmação de cancelamento
   - Opção de reativação

4. Upgrade/Downgrade de plano:
   - Cálculo de valores proporcionais
   - Ajuste de ciclos de faturamento
   - Atualização de permissões após mudança

Funcionalidades adicionais:
- Emissão automática de recibos/faturas
- Dashboard para acompanhamento financeiro
- Histórico de transações
- Gestão de métodos de pagamento
- Tratamento de disputas e reembolsos

Segurança e conformidade:
- Implementação de PCI DSS
- Tokenização de dados sensíveis
- Validação de transações
- Logs de auditoria
- Conformidade com regulamentações brasileiras

Forneça exemplos de código para os principais endpoints da API e para a implementação dos webhooks necessários. Inclua também exemplos de como lidar com cenários de erro comuns.
```

## Prompt 6: Implementação da Landing Page de Alta Conversão

```
Desenvolva uma landing page de alta conversão para o RH Master, uma plataforma SaaS para mentores treinarem seus líderes/clientes. A página deve ser otimizada para converter visitantes em assinantes, com foco em design persuasivo e clareza na comunicação da proposta de valor.

Especificações técnicas:
- Framework: React com Vite
- Componentes: ShadcnUI
- Responsividade: Mobile-first
- Performance: Otimizada para Core Web Vitals
- SEO: Estrutura semântica e meta tags otimizadas

Estrutura da página:
1. Header:
   - Logo do RH Master
   - Menu de navegação simplificado
   - CTAs primário e secundário
   - Opção de login

2. Hero Section:
   - Headline principal focada no benefício-chave
   - Subheadline explicativa
   - CTA destacado para período gratuito
   - Imagem/animação do dashboard
   - Elemento de social proof

3. Benefícios Principais:
   - 3-4 cards com ícones e descrições concisas
   - Foco nos diferenciais da plataforma

4. Demonstração Visual:
   - Vídeo ou slider interativo
   - Destaques das principais funcionalidades

5. Funcionalidades Detalhadas:
   - Seções para cada grupo de funcionalidades
   - Imagens ilustrativas
   - Descrições focadas em benefícios

6. Depoimentos:
   - 3-5 depoimentos com fotos e nomes reais
   - Resultados quantificáveis quando possível

7. Comparativo de Planos:
   - Tabela clara dos três planos
   - Destaque para o plano Profissional
   - CTAs específicos para cada plano

8. Garantia e Segurança:
   - Selos de garantia e segurança
   - Menção à LGPD e privacidade

9. FAQ:
   - 6-8 perguntas estratégicas
   - Sistema de acordeão

10. CTA Final:
    - Seção dedicada com fundo contrastante
    - CTA grande e destacado

11. Footer:
    - Links importantes
    - Contato e redes sociais

Elementos de conversão a implementar:
- CTAs estrategicamente posicionados com cores contrastantes
- Social proof em múltiplos formatos
- Elementos de escassez e urgência
- Formulário de cadastro simplificado
- Pop-up de saída com oferta especial

Otimizações:
- Lazy loading para conteúdo abaixo da dobra
- Compressão de imagens
- Pré-carregamento de recursos críticos
- Implementação de analytics para tracking de conversão
- Estrutura preparada para A/B testing

Garanta que a página comunique claramente o valor único da plataforma e direcione os visitantes para a ação desejada (cadastro para período de teste gratuito).
```

## Prompt 7: Implementação dos Testes Comportamentais

```
Desenvolva os três testes comportamentais para o RH Master: Perfil Comportamental (Águia, Gato, Lobo e Tubarão), Teste de Inteligência Emocional e Teste de Eneagrama. Cada teste deve ter uma interface intuitiva e um algoritmo de avaliação preciso.

Especificações técnicas:
- Frontend: React com ShadcnUI
- Armazenamento de respostas: PostgreSQL
- Algoritmos de avaliação: JavaScript/Node.js
- Visualização de resultados: Gráficos com Recharts

1. Teste de Perfil Comportamental:
   - 24 questões de múltipla escolha
   - 4 opções por questão (cada uma representando um perfil)
   - Algoritmo para calcular percentuais de cada perfil
   - Identificação de perfil predominante e secundário
   - Visualização em gráfico radar dos quatro perfis
   - Interpretação detalhada de cada perfil
   - Recomendações baseadas no perfil predominante

2. Teste de Inteligência Emocional:
   - 30 questões situacionais
   - Escala Likert de 5 pontos
   - Avaliação de 5 dimensões (autoconsciência, autocontrole, automotivação, empatia, habilidades sociais)
   - Pontuação de 0-100 para cada dimensão
   - Gráfico radar para visualização comparativa
   - Interpretação de pontos fortes e áreas de desenvolvimento
   - Sugestões práticas para melhorar cada dimensão

3. Teste de Eneagrama:
   - 36 pares de afirmações para escolha forçada
   - Algoritmo para identificação do tipo principal (1-9)
   - Identificação de asas (tipos adjacentes)
   - Visualização do tipo principal e influências secundárias
   - Descrição detalhada do tipo identificado
   - Informações sobre direções de integração e desintegração
   - Recomendações de desenvolvimento pessoal

Funcionalidades comuns a todos os testes:
- Barra de progresso
- Salvamento automático de respostas
- Opção de pausar e continuar depois
- Validação para garantir que todas as questões sejam respondidas
- Cálculo de tempo de conclusão
- Visualização imediata de resultados após conclusão
- Opção de compartilhar resultados com o mentor
- Histórico de resultados anteriores

Interface do usuário:
- Design limpo e focado na tarefa
- Instruções claras no início de cada teste
- Feedback visual ao selecionar respostas
- Transições suaves entre questões
- Resultados visualmente atrativos e informativos
- Experiência responsiva em todos os dispositivos

Implemente também a lógica para pontuação no sistema de gamificação após a conclusão de cada teste.
```

## Prompt 8: Implementação do Sistema de Convites

```
Desenvolva o sistema de convites para o RH Master, que permite que mentores convidem seus clientes para a plataforma. Este é um componente crítico, pois os clientes só podem acessar a plataforma através de convites enviados pelos mentores.

Especificações técnicas:
- Frontend: React com ShadcnUI
- Backend: Node.js/Express
- Banco de dados: PostgreSQL
- Serviço de e-mail: SendGrid ou similar

Funcionalidades principais:
1. Interface para mentores adicionarem clientes:
   - Formulário para inserção de nome e e-mail do cliente
   - Opção para mensagem personalizada
   - Validação de e-mails em tempo real
   - Prevenção de convites duplicados

2. Gerenciamento de convites em massa:
   - Upload de planilha com múltiplos clientes
   - Template de planilha para download
   - Validação de dados importados
   - Feedback sobre sucesso/falha de cada convite

3. Geração e envio de convites:
   - Criação de tokens únicos e seguros
   - Definição de prazo de expiração (padrão: 7 dias)
   - Templates de e-mail personalizáveis
   - Rastreamento de entregas e aberturas

4. Monitoramento de status:
   - Dashboard com lista de convites enviados
   - Filtros por status (pendente, aceito, expirado)
   - Opções para reenvio de convites pendentes/expirados
   - Notificações quando um cliente aceita o convite

5. Processo de aceitação de convite:
   - Página de landing para o link do convite
   - Formulário de cadastro para novos clientes
   - Validação do token de convite
   - Vinculação automática ao mentor que enviou o convite
   - Redirecionamento para dashboard do cliente após cadastro

Segurança e validações:
- Proteção contra ataques de força bruta em tokens
- Limitação de taxa de envio de convites
- Verificação de permissões do mentor (limite de clientes por plano)
- Validação de e-mails para evitar spam
- Proteção contra manipulação de tokens

Fluxo de dados:
- Armazenamento de convites na tabela 'invitations'
- Registro de eventos de envio, abertura e aceitação
- Atualização de status em tempo real
- Limpeza automática de convites expirados

Implemente o sistema garantindo uma experiência fluida tanto para mentores quanto para clientes, com feedback claro em cada etapa do processo.
```
