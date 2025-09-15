# 📋 Como Usar o Maritime Cost Guru

## 🚀 Iniciando o Sistema

1. **Instale as dependências**:
   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente**:
   ```bash
   cp .env.example .env
   ```

3. **Execute o projeto**:
   ```bash
   npm run dev
   ```

4. **Acesse**: http://localhost:8080

## 🔐 Primeira Vez no Sistema

### Criando sua Conta
1. Clique em **"Cadastrar"** na tela de login
2. Preencha:
   - Nome completo
   - Email válido
   - Senha (mínimo 6 caracteres)
   - Confirmação da senha
3. Clique em **"Criar Conta"**
4. Verifique seu email para confirmar a conta
5. Faça login com suas credenciais

## 🧮 Fazendo um Cálculo

### Preenchendo os Dados
1. Na página principal, preencha o formulário à esquerda:
   - **Cotação USD**: Taxa de câmbio atual
   - **Valor FOB**: Valor da mercadoria
   - **Frete Internacional**: Custo do frete
   - **Seguro Internacional**: Valor do seguro
   - **Alíquotas**: Percentuais dos impostos
   - **Despesas Locais**: Custos adicionais
   - **Serviços**: Honorários e taxas

2. Clique em **"Calcular"**

### Visualizando Resultados
- Os resultados aparecem automaticamente à direita
- Veja valores em BRL e USD
- Analise a composição dos custos
- Confira o custo final da importação

## 💾 Salvando um Cálculo

### Como Salvar
1. Após fazer um cálculo, clique no botão **"Salvar Cálculo"**
2. Digite um nome descritivo para o cálculo
   - Exemplo: "Container 40ft Eletrônicos - Janeiro 2025"
3. Clique em **"Salvar"**
4. O cálculo será salvo no seu histórico

### Acessando Cálculos Salvos
1. Clique no **avatar do usuário** (canto superior direito)
2. Selecione **"Cálculos Salvos"**
3. Veja todos os seus cálculos organizados por data
4. Cada card mostra:
   - Nome do cálculo
   - Data de criação
   - CIF e Custo Final
   - Cotação USD e FOB

### Gerenciando Cálculos
- **Download PDF**: Clique no botão de download
- **Excluir**: Clique no ícone da lixeira (com confirmação)

## 📄 Gerando PDF

### Exportar Relatório
1. Após calcular, clique em **"Exportar PDF"**
2. O arquivo será baixado automaticamente
3. O PDF contém:
   - Dados da importação
   - Detalhes de todos os impostos
   - Custo final e composição
   - Formatação profissional

## 👤 Gerenciando seu Perfil

### Atualizando Informações
1. Menu do usuário → **"Perfil"**
2. Edite:
   - Nome completo
   - Empresa (opcional)
3. Clique em **"Salvar Alterações"**

### Visualizando Dados da Conta
- ID da conta
- Data de criação
- Última atualização
- Nível de acesso

## ⚙️ Configurações

### Personalizando o Sistema
1. Menu do usuário → **"Configurações"**
2. Configure:
   - **Notificações**: Email e navegador
   - **Preferências**: 
     - Salvamento automático
     - Moeda padrão
     - Tema do sistema
   - **Privacidade**:
     - Exportar dados pessoais
     - Excluir conta

## 🔍 Dicas de Uso

### Melhores Práticas
- **Nomes Descritivos**: Use nomes que identifiquem facilmente o cálculo
- **Salve Regularmente**: Não perca cálculos importantes
- **Organize por Data**: Os cálculos são ordenados automaticamente
- **Use PDFs**: Para enviar cotações profissionais

### Valores Comuns
- **Cotação USD**: Consulte o câmbio atual
- **Alíquota II**: Varia por NCM (comum: 35%)
- **PIS**: Geralmente 2,62%
- **COFINS**: Geralmente 12,57%
- **ICMS**: Varia por estado (comum: 17-20%)

### Despesas Típicas
- Capatazias
- Taxa SISCOMEX
- Adicional Marinha Mercante
- Honorários do despachante
- Emissão de LI
- Taxa de expediente

## 🆘 Solução de Problemas

### Não Consigo Salvar Cálculos
- Verifique se está logado
- Faça um cálculo primeiro
- Tente recarregar a página

### PDF Não Gera
- Verifique se há resultados calculados
- Tente fazer um novo cálculo
- Limpe o cache do navegador

### Problemas de Login
- Verifique email e senha
- Confirme sua conta no email
- Use "Esqueceu a senha?" se necessário

## 📞 Suporte

Para problemas técnicos ou dúvidas:
- Verifique este guia primeiro
- Recarregue a página
- Limpe o cache do navegador
- Entre em contato com o suporte técnico

---

Desenvolvido com ❤️ para facilitar cálculos de importação marítima