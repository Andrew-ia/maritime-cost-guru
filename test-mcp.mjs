import { spawn } from 'child_process';
import readline from 'readline';

// Testar conexão MCP do Supabase
async function testMCP() {
  console.log('🔍 Verificando servidor MCP do Supabase...\n');
  
  // Tentar encontrar o processo MCP
  const findMCP = spawn('ps', ['aux']);
  const rl = readline.createInterface({
    input: findMCP.stdout,
    output: process.stdout,
    terminal: false
  });
  
  rl.on('line', (line) => {
    if (line.includes('mcp-server-supabase')) {
      console.log('✅ Servidor MCP encontrado:');
      console.log(line);
    }
  });
  
  findMCP.on('close', () => {
    console.log('\n📝 Para conectar ao MCP correto do Supabase, você precisa:');
    console.log('1. Parar o servidor MCP atual (projeto zmralivaehlboesidyxj)');
    console.log('2. Iniciar um novo servidor MCP com o projeto vijudxopszufoqvrwspg');
    console.log('\nComandos necessários:');
    console.log('# Parar o servidor atual:');
    console.log('pkill -f mcp-server-supabase');
    console.log('\n# Iniciar novo servidor:');
    console.log('npx @supabase/mcp-server-supabase --project-ref=vijudxopszufoqvrwspg');
    console.log('\nOu configure no Claude Desktop:');
    console.log('Abra as configurações do Claude Desktop e atualize o project-ref do MCP Supabase');
  });
}

testMCP();