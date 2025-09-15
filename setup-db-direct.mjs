import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vijudxopszufoqvrwspg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpanVkeG9wc3p1Zm9xdnJ3c3BnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk2MzE5MSwiZXhwIjoyMDczNTM5MTkxfQ.kcWWv8N7_wZwNaR0EILFtB08I7lNmQ-mhuVmTShCCcY';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: {
    schema: 'public'
  },
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupDatabase() {
  console.log('🚀 Configurando banco de dados Supabase...\n');

  try {
    // 1. Criar tabela profiles
    console.log('1️⃣ Criando tabela profiles...');
    const { error: profilesError } = await supabase.from('profiles').select('id').limit(1);
    
    if (profilesError && profilesError.code === '42P01') {
      // Tabela não existe, vamos criar via API REST diretamente
      console.log('   ⚠️  Tabela profiles não existe.');
      console.log('   📝 Por favor, execute o seguinte SQL no Supabase Dashboard:');
      console.log(`
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT,
  company TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`);
    } else if (!profilesError) {
      console.log('   ✅ Tabela profiles já existe!');
    }

    // 2. Criar tabela calculations_history
    console.log('\n2️⃣ Criando tabela calculations_history...');
    const { error: calculationsError } = await supabase.from('calculations_history').select('id').limit(1);
    
    if (calculationsError && calculationsError.code === '42P01') {
      console.log('   ⚠️  Tabela calculations_history não existe.');
      console.log('   📝 Por favor, execute o seguinte SQL no Supabase Dashboard:');
      console.log(`
CREATE TABLE IF NOT EXISTS public.calculations_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  calculation_name TEXT NOT NULL,
  calculation_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`);
    } else if (!calculationsError) {
      console.log('   ✅ Tabela calculations_history já existe!');
    }

    // 3. Verificar se há usuários
    console.log('\n3️⃣ Verificando usuários...');
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (!usersError) {
      console.log(`   📊 Total de usuários: ${users?.length || 0}`);
      if (users && users.length > 0) {
        console.log('   Usuários existentes:');
        users.forEach(user => {
          console.log(`      - ${user.email} (ID: ${user.id})`);
        });
      }
    } else {
      console.log('   ⚠️  Não foi possível listar usuários:', usersError.message);
    }

    // 4. Instruções finais
    console.log('\n' + '='.repeat(60));
    console.log('📋 PRÓXIMOS PASSOS:');
    console.log('='.repeat(60));
    console.log('\n1. Acesse o Supabase Dashboard:');
    console.log('   https://supabase.com/dashboard/project/vijudxopszufoqvrwspg/sql/new');
    console.log('\n2. Execute o script SQL completo do arquivo: supabase-setup.sql');
    console.log('\n3. Isso irá:');
    console.log('   - Criar as tabelas (se não existirem)');
    console.log('   - Habilitar RLS (Row Level Security)');
    console.log('   - Criar políticas de segurança');
    console.log('   - Criar triggers e funções automáticas');
    console.log('\n4. Após executar o SQL, o sistema estará pronto para uso!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

setupDatabase();