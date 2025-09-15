import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vijudxopszufoqvrwspg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpanVkeG9wc3p1Zm9xdnJ3c3BnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk2MzE5MSwiZXhwIjoyMDczNTM5MTkxfQ.kcWWv8N7_wZwNaR0EILFtB08I7lNmQ-mhuVmTShCCcY';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  console.log('🚀 Criando tabelas no Supabase...\n');

  try {
    // 1. Criar tabela profiles
    console.log('1️⃣ Criando tabela profiles...');
    const { error: profilesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT UNIQUE,
          full_name TEXT,
          company TEXT,
          role TEXT DEFAULT 'user',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (profilesError) {
      console.log('   ⚠️  Erro:', profilesError.message);
      console.log('   💡 Tentando método alternativo...');
      
      // Método direto via REST API
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({
          sql: `
            CREATE TABLE IF NOT EXISTS public.profiles (
              id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
              email TEXT UNIQUE,
              full_name TEXT,
              company TEXT,
              role TEXT DEFAULT 'user',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `
        })
      });

      if (!response.ok) {
        console.log('   ❌ Método REST também falhou');
        console.log('   📝 Execute manualmente no Supabase Dashboard:');
        console.log('   https://supabase.com/dashboard/project/vijudxopszufoqvrwspg/sql/new');
      } else {
        console.log('   ✅ Tabela profiles criada via REST API!');
      }
    } else {
      console.log('   ✅ Tabela profiles criada!');
    }

    // 2. Criar tabela calculations_history
    console.log('\n2️⃣ Criando tabela calculations_history...');
    const { error: calculationsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.calculations_history (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          calculation_name TEXT NOT NULL,
          calculation_data JSONB NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (calculationsError) {
      console.log('   ⚠️  Erro:', calculationsError.message);
    } else {
      console.log('   ✅ Tabela calculations_history criada!');
    }

    // 3. Verificar tabelas criadas
    console.log('\n3️⃣ Verificando tabelas criadas...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (!tablesError && tables) {
      console.log('   📊 Tabelas encontradas:');
      tables.forEach(table => console.log(`      - ${table.table_name}`));
    }

    console.log('\n✅ Processo concluído!');
    console.log('\n📝 Para aplicar RLS e triggers, execute o arquivo supabase-setup.sql no dashboard.');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    console.log('\n📝 Execute manualmente o arquivo supabase-setup.sql em:');
    console.log('https://supabase.com/dashboard/project/vijudxopszufoqvrwspg/sql/new');
  }
}

createTables();