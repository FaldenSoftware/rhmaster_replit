import { useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  HelpCircle, 
  Video, 
  FileText, 
  BookOpen, 
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";

export default function HelpPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("faq");

  const isMentor = user?.role === "mentor";
  
  const faqItems = [
    {
      question: "Como adicionar novos clientes?",
      answer: "Para adicionar novos clientes, navegue até a seção 'Clientes' no menu lateral e clique no botão 'Adicionar Cliente'. Preencha as informações necessárias e envie um convite por e-mail. O cliente receberá as instruções para se cadastrar na plataforma.",
      role: "mentor"
    },
    {
      question: "Como atribuir testes comportamentais aos clientes?",
      answer: "Acesse a seção 'Testes' no menu lateral e depois navegue até 'Atribuir Testes'. No quadro Kanban, arraste o teste desejado para o cliente que deseja atribuir e configure as datas limite conforme necessário.",
      role: "mentor"
    },
    {
      question: "Como visualizar o progresso dos meus clientes?",
      answer: "No dashboard principal você pode visualizar estatísticas gerais. Para análises mais detalhadas, acesse a seção 'Análises' no menu lateral, onde você encontrará gráficos e relatórios sobre o progresso de cada cliente.",
      role: "mentor"
    },
    {
      question: "Como utilizar o Assistente IA?",
      answer: "O Assistente IA pode ser acessado clicando no ícone de cérebro na barra superior ou na opção 'Assistente IA' no menu lateral. Você pode fazer perguntas sobre mentoria, desenvolvimento de líderes e interpretação de resultados de testes comportamentais.",
      role: "all"
    },
    {
      question: "Como fazer um teste comportamental?",
      answer: "Acesse a seção 'Meus Testes' no menu lateral, onde encontrará todos os testes atribuídos a você. Clique em 'Iniciar Teste' no teste que deseja realizar e siga as instruções apresentadas na tela.",
      role: "client"
    },
    {
      question: "Como ver o histórico dos meus resultados?",
      answer: "Para visualizar seus resultados anteriores, acesse a seção 'Resultados' no menu lateral. Lá você encontrará todos os testes que completou, organizados por data, incluindo gráficos de progresso e análises comparativas.",
      role: "client"
    },
    {
      question: "Como mudar meu plano de assinatura?",
      answer: "Para alterar seu plano, vá até as Configurações, acesse a aba 'Assinatura' e clique em 'Gerenciar Plano'. Lá você poderá visualizar as opções disponíveis e fazer a alteração para o plano mais adequado às suas necessidades.",
      role: "mentor"
    },
    {
      question: "Como cancelar minha assinatura?",
      answer: "Para cancelar sua assinatura, acesse as Configurações, vá para a aba 'Assinatura' e clique em 'Cancelar Assinatura'. Você poderá escolher continuar usando o serviço até o final do período pago ou cancelar imediatamente.",
      role: "mentor"
    }
  ];

  // Filtrar FAQs com base no papel do usuário e no termo de pesquisa
  const filteredFaqs = faqItems.filter(item => 
    (item.role === "all" || item.role === user?.role) && 
    (item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
     item.answer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const videoTutorials = [
    { 
      title: "Introdução ao RH Master", 
      description: "Visão geral da plataforma e principais recursos",
      duration: "5:32",
      role: "all"
    },
    { 
      title: "Como atribuir testes a clientes", 
      description: "Tutorial completo do sistema de atribuição de testes",
      duration: "7:15",
      role: "mentor"
    },
    { 
      title: "Interpretando resultados de testes", 
      description: "Como analisar e utilizar os dados dos testes comportamentais",
      duration: "12:45",
      role: "mentor"
    },
    { 
      title: "Como realizar um teste comportamental", 
      description: "Orientação passo a passo para fazer um teste",
      duration: "8:20",
      role: "client"
    },
    { 
      title: "Utilizando o Assistente IA", 
      description: "Dicas para obter o máximo do assistente inteligente",
      duration: "6:18",
      role: "all"
    }
  ];

  // Filtrar vídeos com base no papel do usuário
  const filteredVideos = videoTutorials.filter(video => 
    video.role === "all" || video.role === user?.role
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Central de Ajuda</h1>
            </div>
            <p className="text-muted-foreground mt-2 ml-11">
              Encontre respostas, tutoriais e recursos para utilizar a plataforma RH Master.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar na central de ajuda..."
              className="pl-10 py-6 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-4 mx-auto max-w-3xl">
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span>FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span>Vídeos</span>
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Guias</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Contato</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq">
            <div className="max-w-3xl mx-auto">
              {searchTerm && (
                <p className="mb-4 text-sm text-muted-foreground">
                  Mostrando resultados para: <span className="font-medium">{searchTerm}</span>
                </p>
              )}
              
              {filteredFaqs.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center">
                    <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Nenhum resultado encontrado</h3>
                    <p className="text-muted-foreground">
                      Tente modificar sua busca ou navegue pelas categorias disponíveis.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Accordion type="single" collapsible className="space-y-4">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border bg-white rounded-lg shadow-sm">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline text-left">
                        <span className="font-medium">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {filteredVideos.map((video, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-slate-100 flex items-center justify-center">
                    <Video className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                    <CardDescription>{video.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Duração: {video.duration}</span>
                      <Button variant="ghost" size="sm" className="text-primary">Assistir</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="guides">
            <div className="max-w-3xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Guias e Documentação</CardTitle>
                  <CardDescription>
                    Manuais detalhados e guias passo a passo para maximizar sua experiência
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium">Manual do Usuário</h3>
                        <p className="text-sm text-muted-foreground">Guia completo da plataforma</p>
                      </div>
                    </div>
                    <Button variant="ghost" className="gap-1">
                      <span>Ver</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {isMentor && (
                    <div className="bg-slate-50 p-4 rounded-lg flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-medium">Guia do Mentor</h3>
                          <p className="text-sm text-muted-foreground">Melhores práticas e estratégias para mentores</p>
                        </div>
                      </div>
                      <Button variant="ghost" className="gap-1">
                        <span>Ver</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  {!isMentor && (
                    <div className="bg-slate-50 p-4 rounded-lg flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-medium">Guia do Cliente</h3>
                          <p className="text-sm text-muted-foreground">Como aproveitar ao máximo sua experiência de mentoria</p>
                        </div>
                      </div>
                      <Button variant="ghost" className="gap-1">
                        <span>Ver</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  <div className="bg-slate-50 p-4 rounded-lg flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium">Glossário de Termos</h3>
                        <p className="text-sm text-muted-foreground">Definições dos termos utilizados na plataforma</p>
                      </div>
                    </div>
                    <Button variant="ghost" className="gap-1">
                      <span>Ver</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Entre em Contato</CardTitle>
                  <CardDescription>
                    Precisa de ajuda adicional? Nossa equipe de suporte está pronta para te ajudar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Assunto</label>
                      <Input placeholder="Descreva resumidamente o assunto" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Mensagem</label>
                      <textarea 
                        className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Descreva detalhadamente sua dúvida ou problema"
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Outras formas de contato</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Email:</strong> suporte@rhmaster.com.br</p>
                      <p><strong>Telefone:</strong> (11) 3456-7890</p>
                      <p><strong>Horário:</strong> Segunda a Sexta, das 9h às 18h</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Enviar Mensagem</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}