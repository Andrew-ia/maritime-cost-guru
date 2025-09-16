# Configuração das Variáveis de Ambiente no Vercel

## Problema Identificado
O erro "invalid API key" está ocorrendo porque as variáveis de ambiente não estão configuradas no Vercel.

## Variáveis Necessárias
Você precisa adicionar estas variáveis no painel do Vercel:

```
VITE_SUPABASE_URL=https://vijudxopszufoqvrwspg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpanVkeG9wc3p1Zm9xdnJ3c3BnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NjMxOTEsImV4cCI6MjA3MzUzOTE5MX0.WbUdinPVI9hecQFsb2x_hfEtmSObzxQQiahZS54NsC0
```

## Como Configurar no Vercel

1. Acesse o dashboard do Vercel
2. Entre no seu projeto
3. Vá em "Settings" → "Environment Variables"
4. Adicione cada variável:
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://vijudxopszufoqvrwspg.supabase.co`
   - Environment: Production, Preview, Development
   
5. Adicione a segunda variável:
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpanVkeG9wc3p1Zm9xdnJ3c3BnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NjMxOTEsImV4cCI6MjA3MzUzOTE5MX0.WbUdinPVI9hecQFsb2x_hfEtmSObzxQQiahZS54NsC0`
   - Environment: Production, Preview, Development

6. Após adicionar, faça um novo deploy

## Importante
- As variáveis devem começar com `VITE_` para serem expostas ao frontend pelo Vite
- Certifique-se de marcar todos os ambientes (Production, Preview, Development)
- Após adicionar as variáveis, você precisa fazer um novo deploy para que elas sejam aplicadas