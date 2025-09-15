import fetch from 'node-fetch';
import fs from 'fs';

const SUPABASE_URL = 'https://vijudxopszufoqvrwspg.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpanVkeG9wc3p1Zm9xdnJ3c3BnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk2MzE5MSwiZXhwIjoyMDczNTM5MTkxfQ.kcWWv8N7_wZwNaR0EILFtB08I7lNmQ-mhuVmTShCCcY';

async function executeSQLViaAPI() {
  console.log('🚀 Tentando executar SQL via API do Supabase...\n');

  // Dividir o SQL em comandos individuais
  const sqlCommands = [
    // 1. Criar tabela profiles
    `CREATE TABLE IF NOT EXISTS public.profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email TEXT UNIQUE,
      full_name TEXT,
      company TEXT,
      role TEXT DEFAULT 'user',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`,
    
    // 2. Criar tabela calculations_history
    `CREATE TABLE IF NOT EXISTS public.calculations_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      calculation_name TEXT NOT NULL,
      calculation_data JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`,
  ];

  // Tentar executar via Management API (se disponível)
  for (let i = 0; i < sqlCommands.length; i++) {
    const command = sqlCommands[i];
    console.log(`Executando comando ${i + 1}/${sqlCommands.length}...`);
    
    try {
      // Nota: A API REST do Supabase não permite execução direta de DDL
      // Precisamos usar o Dashboard ou SDK específico
      console.log('⚠️  A API REST do Supabase não suporta execução direta de DDL (CREATE TABLE, etc.)');
      break;
    } catch (error) {
      console.error('Erro:', error.message);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📋 INSTRUÇÕES PARA CONFIGURAR O MCP DO SUPABASE:');
  console.log('='.repeat(70));
  console.log('\n1. No Claude Desktop, vá em Settings (⚙️)');
  console.log('\n2. Procure a seção "MCP Servers" ou "Model Context Protocol"');
  console.log('\n3. Encontre a configuração do Supabase MCP');
  console.log('\n4. Atualize o project-ref para: vijudxopszufoqvrwspg');
  console.log('\n5. Adicione também as seguintes variáveis de ambiente:');
  console.log('   SUPABASE_URL=' + SUPABASE_URL);
  console.log('   SUPABASE_SERVICE_ROLE_KEY=' + SERVICE_ROLE_KEY);
  console.log('\n6. Reinicie o Claude Desktop');
  console.log('\n' + '='.repeat(70));
  console.log('\nAlternativamente, execute o SQL manualmente:');
  console.log('https://supabase.com/dashboard/project/vijudxopszufoqvrwspg/sql/new');
  console.log('='.repeat(70));
}

// Verificar se node-fetch está instalado
import('node-fetch').catch(() => {
  console.log('⚠️  node-fetch não está instalado. Instalando...');
  const { execSync } = require('child_process');
  execSync('npm install node-fetch', { stdio: 'inherit' });
  console.log('✅ node-fetch instalado. Execute o script novamente.');
  process.exit(0);
}).then(() => {
  executeSQLViaAPI();
});