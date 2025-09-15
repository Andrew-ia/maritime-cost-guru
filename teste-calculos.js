// Teste dos cálculos para verificar se batem com a planilha

const dados = {
  cotacao_usd: 5.4174,
  valor_fob: 72500.00,
  frete_internacional: 6510.08,
  seguro_internacional: 43.69,
  capatazias: 0,
  aliq_ii: 35,
  aliq_ipi: 0,
  aliq_pis: 2.62,
  aliq_cofins: 12.57,
  aliq_icms: 18,
  taxa_siscomex: 154.23,
  adicional_marinha: 2840.35
};

console.log("=== VERIFICAÇÃO DOS CÁLCULOS ===\n");

// 1. CIF
const cif = (dados.valor_fob + dados.frete_internacional + dados.seguro_internacional) * dados.cotacao_usd;
console.log("CIF Calculado: R$", cif.toFixed(2));
console.log("CIF Planilha:  R$ 428.265,89");
console.log("Diferença: R$", (cif - 428265.89).toFixed(2));
console.log("Status:", Math.abs(cif - 428265.89) < 0.1 ? "✅ CORRETO" : "❌ ERRO");

console.log("\n--- IMPOSTOS ---");

// 2. II
const ii = cif * (dados.aliq_ii / 100);
console.log("\nII Calculado: R$", ii.toFixed(2));
console.log("II Planilha:  R$ 149.893,06");
console.log("Diferença: R$", (ii - 149893.06).toFixed(2));
console.log("Status:", Math.abs(ii - 149893.06) < 0.1 ? "✅ CORRETO" : "❌ ERRO");

// 3. IPI
const ipi = (cif + ii) * (dados.aliq_ipi / 100);
console.log("\nIPI Calculado: R$", ipi.toFixed(2));
console.log("IPI Planilha:  R$ 0,00");
console.log("Status:", ipi === 0 ? "✅ CORRETO" : "❌ ERRO");

// 4. PIS
const pis = cif * (dados.aliq_pis / 100);
console.log("\nPIS Calculado: R$", pis.toFixed(2));
console.log("PIS Planilha:  R$ 11.220,57");
console.log("Diferença: R$", (pis - 11220.57).toFixed(2));
console.log("Status:", Math.abs(pis - 11220.57) < 0.1 ? "✅ CORRETO" : "❌ ERRO");

// 5. COFINS
const cofins = cif * (dados.aliq_cofins / 100);
console.log("\nCOFINS Calculado: R$", cofins.toFixed(2));
console.log("COFINS Planilha:  R$ 53.833,02");
console.log("Diferença: R$", (cofins - 53833.02).toFixed(2));
console.log("Status:", Math.abs(cofins - 53833.02) < 0.1 ? "✅ CORRETO" : "❌ ERRO");

// 6. Base ICMS
const base_icms = (cif + ii + ipi + pis + cofins + dados.capatazias + dados.taxa_siscomex + dados.adicional_marinha) / (1 - dados.aliq_icms/100);
console.log("\nBase ICMS Calculado: R$", base_icms.toFixed(2));
console.log("Base ICMS Planilha:  R$ 788.057,47");
console.log("Diferença: R$", (base_icms - 788057.47).toFixed(2));
console.log("Status:", Math.abs(base_icms - 788057.47) < 0.5 ? "✅ CORRETO" : "❌ ERRO");

// 7. ICMS
const icms = base_icms * (dados.aliq_icms / 100);
console.log("\nICMS Calculado: R$", icms.toFixed(2));
console.log("ICMS Planilha:  R$ 141.850,34");
console.log("Diferença: R$", (icms - 141850.34).toFixed(2));
console.log("Status:", Math.abs(icms - 141850.34) < 0.5 ? "✅ CORRETO" : "❌ ERRO");

// 8. TOTAL IMPOSTOS
const total_impostos = ii + ipi + pis + cofins + icms + dados.taxa_siscomex + dados.adicional_marinha;
console.log("\n--- TOTAIS ---");
console.log("\nTotal Impostos Calculado: R$", total_impostos.toFixed(2));
console.log("Total Impostos Planilha:  R$ 359.791,58");
console.log("Diferença: R$", (total_impostos - 359791.58).toFixed(2));
console.log("Status:", Math.abs(total_impostos - 359791.58) < 1 ? "✅ CORRETO" : "❌ ERRO");

// Despesas
const despesas = {
  armazenagem: 31072.59,
  agenciamento: 3250.44,
  taxas_usd: 1335.30 * dados.cotacao_usd,
  taxas_brl: 2095.00
};

const total_despesas = despesas.armazenagem + despesas.agenciamento + despesas.taxas_usd + despesas.taxas_brl;
console.log("\nTotal Despesas Calculado: R$", total_despesas.toFixed(2));
console.log("Total Despesas Planilha:  R$ 44.001,88");
console.log("Diferença: R$", (total_despesas - 44001.88).toFixed(2));

// Serviços
const total_servicos = 800 + 400 + 120 + 0;
console.log("\nTotal Serviços Calculado: R$", total_servicos.toFixed(2));
console.log("Total Serviços Planilha:  R$ 1.320,00");
console.log("Status:", Math.abs(total_servicos - 1320) < 0.1 ? "✅ CORRETO" : "❌ ERRO");

// Total Custo + Impostos
const total_custo_impostos = total_impostos + total_despesas + total_servicos;
console.log("\nTotal Custo + Impostos Calculado: R$", total_custo_impostos.toFixed(2));
console.log("Total Custo + Impostos Planilha:  R$ 405.113,46");
console.log("Diferença: R$", (total_custo_impostos - 405113.46).toFixed(2));

// Custo Final
const custo_final = cif + total_custo_impostos;
console.log("\n=== CUSTO FINAL ===");
console.log("Custo Final Calculado: R$", custo_final.toFixed(2));
console.log("Custo Final Planilha:  R$ 833.379,36");
console.log("Diferença: R$", (custo_final - 833379.36).toFixed(2));
console.log("Status:", Math.abs(custo_final - 833379.36) < 1 ? "✅ CORRETO" : "❌ ERRO");