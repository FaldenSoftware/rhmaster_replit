require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Obter a chave API do ambiente
const apiKey = process.env.GEMINI_API_KEY;
console.log('Chave API definida:', apiKey ? 'Sim' : 'Não');

if (!apiKey) {
  console.log('AVISO: GEMINI_API_KEY não está definida!');
  process.exit(1);
}

// Inicializar o cliente Gemini
const genAI = new GoogleGenerativeAI(apiKey);

// Função principal para testar a conexão
async function run() {
  // Obter uma instância do modelo
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  console.log('Testando conexão com Gemini API...');
  
  try {
    // Realizar uma chamada simples de teste
    const result = await model.generateContent('Responda em português: Como você pode ajudar mentores e líderes?');
    console.log('Resposta recebida:');
    console.log(result.response.text());
    console.log('\nConexão com Gemini API bem-sucedida!');
  } catch (error) {
    console.error('Erro ao conectar com Gemini API:', error.message);
    if (error.message.includes('API key')) {
      console.error('Verifique se a chave API está correta e possui as permissões necessárias.');
    }
  }
}

// Executar o teste
run();