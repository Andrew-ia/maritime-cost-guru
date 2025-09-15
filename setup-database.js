import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Usar service role key para operações administrativas
const supabaseUrl = 'https://vijudxopszufoqvrwspg.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpanVkeG9wc3p1Zm9xdnJ3c3BnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk2MzE5MSwiZXhwIjoyMDczNTM5MTkxfQ.kcWWv8N7_wZwNaR0EILFtB08I7lNmQ-mhuVmTShCCcY';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function setupDatabase() {
  try {
    console.log('🚀 Iniciando configuração do banco de dados...');
    
    // Ler o arquivo SQL
    const sqlScript = fs.readFileSync('./supabase-setup.sql', 'utf8');
    
    // Executar o script SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlScript }).catch(async (err) => {
      // Se exec_sql não existir, tentar executar comandos individualmente
      console.log('⚠️  Função exec_sql não encontrada. Executando comandos individualmente...');
      
      const commands = sqlScript
        .split(';')
        .map(cmd => cmd.trim())
        .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
      
      for (const command of commands) {
        try {
          // Para comandos CREATE TABLE, usar o cliente admin
          if (command.includes('CREATE TABLE') || command.includes('ALTER TABLE') || 
              command.includes('CREATE POLICY') || command.includes('CREATE INDEX') ||
              command.includes('CREATE FUNCTION') || command.includes('CREATE TRIGGER') ||
              command.includes('DROP TRIGGER')) {
            console.log(`Executando: ${command.substring(0, 50)}...`);
            
            // Nota: Supabase JS client não suporta execução direta de SQL DDL
            // Vamos criar as tabelas usando a API REST
            console.log('⚠️  Comando SQL DDL detectado. Por favor, execute o script SQL diretamente no Supabase Dashboard.');
          }
        } catch (cmdError) {
          console.error(`Erro ao executar comando: ${cmdError.message}`);
        }
      }
      
      return { error: 'Por favor, execute o script SQL diretamente no Supabase Dashboard' };
    });
    
    if (error) {
      console.error('❌ Erro ao configurar banco de dados:', error);
      console.log('\n📝 INSTRUÇÕES MANUAIS:');
      console.log('1. Acesse https://supabase.com/dashboard/project/vijudxopszufoqvrwspg/sql/new');
      console.log('2. Cole o conteúdo do arquivo supabase-setup.sql');
      console.log('3. Execute o script');
      console.log('\n✅ Após executar o script no dashboard, o sistema estará pronto!');
    } else {
      console.log('✅ Banco de dados configurado com sucesso!');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.log('\n📝 INSTRUÇÕES MANUAIS:');
    console.log('1. Acesse https://supabase.com/dashboard/project/vijudxopszufoqvrwspg/sql/new');
    console.log('2. Cole o conteúdo do arquivo supabase-setup.sql');
    console.log('3. Execute o script');
  }
}

setupDatabase();