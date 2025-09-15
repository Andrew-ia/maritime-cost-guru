# Maritime Cost Guru - Pré-Custo Importação Marítima

## 📊 Sobre o Projeto

Sistema completo para cálculo de impostos e custos de importação marítima, desenvolvido para facilitar o processo de precificação de importações.

### ✨ Funcionalidades

- **Cálculo Automático de Impostos**
  - II (Imposto de Importação)
  - IPI (Imposto sobre Produtos Industrializados)
  - PIS (Programa de Integração Social)
  - COFINS (Contribuição para Financiamento da Seguridade Social)
  - ICMS (Imposto sobre Circulação de Mercadorias e Serviços)

- **Gestão de Custos**
  - Valor FOB
  - Frete Internacional
  - Seguro Internacional
  - Despesas Locais (BRL e USD)
  - Serviços Fixos
  - Taxas (SISCOMEX, Marinha Mercante)

- **Exportação de Relatórios**
  - Geração de PDF profissional
  - Valores em BRL e USD
  - Layout otimizado para impressão

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Estilização**: Tailwind CSS
- **Componentes**: shadcn/ui
- **PDF**: jsPDF + jspdf-autotable
- **Formulários**: React Hook Form
- **Validação**: Zod

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/Andrew-ia/maritime-cost-guru.git

# Entre no diretório
cd maritime-cost-guru

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais do Supabase

# Execute o projeto
npm run dev
```

O projeto estará disponível em: **http://localhost:8080**

## 🖥️ Scripts Disponíveis

```bash
npm run dev       # Inicia o servidor de desenvolvimento
npm run build     # Gera build de produção
npm run lint      # Executa o linter
npm run preview   # Visualiza o build de produção
```

## 📈 Fórmulas de Cálculo

### CIF (Cost, Insurance and Freight)
```
CIF = (FOB + Frete + Seguro) × Cotação USD
```

### Base ICMS
```
Base ICMS = (CIF + II + IPI + PIS + COFINS + Outras Taxas) ÷ (1 - Alíquota ICMS)
```

### Custo Final
```
Custo Final = CIF + Total Impostos + Total Despesas + Total Serviços
```

## 🎯 Principais Recursos

1. **Interface Intuitiva**: Design limpo e moderno com foco na usabilidade
2. **Cálculos Precisos**: Fórmulas atualizadas conforme legislação brasileira
3. **Responsividade**: Funciona perfeitamente em desktop e mobile
4. **Exportação PDF**: Relatórios profissionais prontos para envio ao cliente
5. **Validação de Dados**: Verificação automática de valores inseridos
6. **Autenticação Segura**: Sistema completo de login/registro com Supabase
7. **Histórico de Cálculos**: Salve e gerencie todos os seus cálculos
8. **Gerenciamento de Perfil**: Configure suas informações pessoais
9. **Configurações Personalizadas**: Ajuste preferências do sistema

## 📝 Estrutura do Projeto

```
src/
├── components/         # Componentes React
│   ├── ui/            # Componentes shadcn/ui
│   ├── FormularioImportacao.tsx
│   ├── InputMonetario.tsx
│   ├── ResultadosCalculos.tsx
│   └── TabelaDespesas.tsx
├── pages/             # Páginas da aplicação
│   ├── Index.tsx      # Página principal (calculadora)
│   ├── Auth.tsx       # Página de login/registro
│   ├── Calculations.tsx # Histórico de cálculos
│   ├── Profile.tsx    # Gerenciamento de perfil
│   ├── Settings.tsx   # Configurações do usuário
│   └── NotFound.tsx   # Página 404
├── utils/             # Funções utilitárias
│   └── generatePDF.ts # Geração de PDF
├── hooks/             # React hooks customizados
├── contexts/          # Contextos React
│   └── AuthContext.tsx # Contexto de autenticação
└── lib/               # Configurações e utilitários
    ├── supabase.ts    # Cliente Supabase
    └── utils.ts       # Utilitários gerais

```

## 🗄️ Banco de Dados

O projeto utiliza **Supabase** como backend e inclui:

### Tabelas
- **profiles**: Perfis de usuário
- **calculations_history**: Histórico de cálculos salvos

### Recursos de Segurança
- **Row Level Security (RLS)**: Cada usuário só acessa seus próprios dados
- **Políticas de Segurança**: Controle granular de acesso
- **Triggers**: Criação automática de perfil e atualização de timestamps

### Funcionalidades
- **Autenticação**: Login/registro com email e senha
- **Persistência**: Salvamento automático de cálculos
- **Histórico**: Consulta e gerenciamento de cálculos anteriores

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto está sob licença MIT.

---

Desenvolvido com ❤️ para facilitar cálculos de importação marítima