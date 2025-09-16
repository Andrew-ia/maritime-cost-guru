import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DadosImportacao, ResultadosCalculados } from '@/pages/Index';

export const generatePDF = (dados: DadosImportacao, resultados: ResultadosCalculados) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Configurações de página
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - (margin * 2);
  
  // Cores do sistema
  const primaryColor: [number, number, number] = [33, 90, 154];
  const secondaryColor: [number, number, number] = [52, 152, 219];
  const successColor: [number, number, number] = [46, 125, 50];
  const lightGray: [number, number, number] = [248, 249, 250];
  
  let yPos = margin;
  
  // Função auxiliar para formatar moeda
  const formatCurrency = (value: number, currency: 'BRL' | 'USD' = 'BRL') => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  const toUSD = (brl: number) => brl / dados.cotacao_usd;
  
  // CABEÇALHO COMPACTO
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PRÉ-CUSTO IMPORTAÇÃO MARÍTIMA', pageWidth / 2, 8, { align: 'center' });
  
  // Dados do Header em formato de tabela
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  
  // Primeira linha do header
  const col1X = margin;
  const col2X = 50;
  const col3X = 110;
  
  doc.text(`Incoterm: ${dados.incoterm || 'FOB'}`, col1X, 16);
  doc.text(`Container: ${dados.container || '-'}`, col2X, 16);
  doc.text(`Produto: ${dados.produto || '-'}`, col3X, 16);
  
  // Segunda linha do header
  doc.text(`Origem: ${dados.origem || '-'}`, col1X, 21);
  doc.text(`Peso Bruto: ${dados.peso_bruto ? dados.peso_bruto.toLocaleString('pt-BR') + ' kg' : '-'}`, col2X, 21);
  doc.text(`NCM: ${dados.ncm || '-'}`, col3X, 21);
  
  // Terceira linha do header
  doc.text(`Destino: ${dados.destino || '-'}`, col1X, 26);
  doc.text(`Preço ${dados.incoterm || 'FOB'}: ${formatCurrency(dados.valor_fob, 'USD')}`, col2X, 26);
  doc.text(`Quantidade: ${dados.quantidade || 1}`, col3X, 26);
  
  // Câmbio e Data
  doc.setFillColor(...secondaryColor);
  doc.rect(0, 30, pageWidth, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`Câmbio (USD): R$ ${dados.cotacao_usd.toFixed(4)}`, margin, 35);
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth - margin - 25, 35);
  
  yPos = 42;
  
  // CONFIGURAÇÃO PADRÃO PARA TODAS AS TABELAS
  const standardTableConfig = {
    margin: { left: margin, right: margin },
    tableWidth: contentWidth,
    styles: { 
      fontSize: 7,
      cellPadding: 1.5,
      lineColor: [220, 220, 220] as [number, number, number],
      lineWidth: 0.1
    },
    headStyles: { 
      fillColor: primaryColor,
      textColor: [255, 255, 255] as [number, number, number],
      fontSize: 7,
      fontStyle: 'bold' as const
    },
    theme: 'striped' as const,
    alternateRowStyles: { fillColor: lightGray }
  };
  
  // 1. VALORES BASE CIF
  doc.setTextColor(...primaryColor);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('1. VALORES BASE', margin, yPos);
  yPos += 4;
  
  // Construir corpo da tabela baseado no Incoterm
  const valoresBody = [];
  
  // Sempre mostrar o valor principal
  valoresBody.push([`Valor ${dados.incoterm || 'FOB'}`, formatCurrency(dados.valor_fob, 'USD'), formatCurrency(dados.valor_fob * dados.cotacao_usd)]);
  
  // Mostrar frete e seguro apenas se aplicável ao Incoterm
  const incotermsSemFrete = ['CIF', 'CIP', 'CPT', 'DAP', 'DPU', 'DDP'];
  const incotermsSemSeguro = ['CIF', 'CIP', 'DAP', 'DPU', 'DDP'];
  
  if (!incotermsSemFrete.includes(dados.incoterm || 'FOB')) {
    valoresBody.push(['Frete Internacional', formatCurrency(dados.frete_internacional, 'USD'), formatCurrency(dados.frete_internacional * dados.cotacao_usd)]);
  }
  
  if (!incotermsSemSeguro.includes(dados.incoterm || 'FOB')) {
    valoresBody.push(['Seguro Internacional', formatCurrency(dados.seguro_internacional, 'USD'), formatCurrency(dados.seguro_internacional * dados.cotacao_usd)]);
  }
  
  autoTable(doc, {
    startY: yPos,
    head: [['Descrição', 'Valor USD', 'Valor R$']],
    body: valoresBody,
    foot: [['CIF TOTAL', formatCurrency(resultados.cif_usd, 'USD'), formatCurrency(resultados.cif)]],
    ...standardTableConfig,
    footStyles: {
      fillColor: secondaryColor,
      textColor: [255, 255, 255],
      fontSize: 7,
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: contentWidth * 0.5, halign: 'left' },
      1: { cellWidth: contentWidth * 0.25, halign: 'right' },
      2: { cellWidth: contentWidth * 0.25, halign: 'right' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 4;
  
  // 2. IMPOSTOS
  doc.setTextColor(...primaryColor);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('2. IMPOSTOS', margin, yPos);
  yPos += 4;
  
  autoTable(doc, {
    startY: yPos,
    head: [['Imposto', 'Alíq.', 'Base Cálculo', 'Valor R$', 'Valor USD']],
    body: [
      ['II - Imp. Importação', '35%', formatCurrency(resultados.cif), formatCurrency(resultados.ii), formatCurrency(toUSD(resultados.ii), 'USD')],
      ['IPI', '0%', formatCurrency(resultados.cif + resultados.ii), formatCurrency(resultados.ipi), formatCurrency(toUSD(resultados.ipi), 'USD')],
      ['PIS', '2,62%', formatCurrency(resultados.cif), formatCurrency(resultados.pis), formatCurrency(toUSD(resultados.pis), 'USD')],
      ['COFINS', '12,57%', formatCurrency(resultados.cif), formatCurrency(resultados.cofins), formatCurrency(toUSD(resultados.cofins), 'USD')],
      ['Base ICMS', '-', '-', formatCurrency(resultados.base_icms), formatCurrency(toUSD(resultados.base_icms), 'USD')],
      ['ICMS', '18%', formatCurrency(resultados.base_icms), formatCurrency(resultados.icms), formatCurrency(toUSD(resultados.icms), 'USD')],
      ['Taxa SISCOMEX', '-', '-', formatCurrency(dados.taxa_siscomex), formatCurrency(toUSD(dados.taxa_siscomex), 'USD')],
      ['Marinha Mercante', '-', '-', formatCurrency(dados.adicional_marinha), formatCurrency(toUSD(dados.adicional_marinha), 'USD')],
    ],
    foot: [['TOTAL IMPOSTOS', '', '', formatCurrency(resultados.total_impostos), formatCurrency(toUSD(resultados.total_impostos), 'USD')]],
    ...standardTableConfig,
    footStyles: {
      fillColor: secondaryColor,
      textColor: [255, 255, 255],
      fontSize: 7,
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: contentWidth * 0.35, halign: 'left' },
      1: { cellWidth: contentWidth * 0.10, halign: 'center' },
      2: { cellWidth: contentWidth * 0.25, halign: 'right' },
      3: { cellWidth: contentWidth * 0.15, halign: 'right' },
      4: { cellWidth: contentWidth * 0.15, halign: 'right' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 4;
  
  // 3. DESPESAS LOCAIS
  const despesasData = [
    { label: 'Armazenagem', value: dados.armazenagem || 0 },
    { label: 'Desova', value: dados.desova || 0 },
    { label: 'Lacre', value: dados.lacre || 0 },
    { label: 'Scanner', value: dados.scanner || 0 },
    { label: 'Movimentação de Carga', value: dados.mov_carga || 0 },
    { label: 'Gerenciamento de Risco', value: dados.gerenciamento_risco || 0 },
    { label: 'Desconsolidação', value: dados.desconsolidacao || 0 },
    { label: 'Outras Despesas', value: dados.outras_despesas || 0 }
  ].filter(item => item.value > 0);

  if (despesasData.length > 0) {
    doc.setTextColor(...primaryColor);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('3. DESPESAS LOCAIS', margin, yPos);
    yPos += 4;
    
    const despesasBody = despesasData.map(despesa => [
      despesa.label,
      formatCurrency(despesa.value),
      formatCurrency(toUSD(despesa.value), 'USD')
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [['Descrição', 'Valor R$', 'Valor USD']],
      body: despesasBody,
      foot: [['TOTAL DESPESAS', formatCurrency(resultados.total_despesas), formatCurrency(toUSD(resultados.total_despesas), 'USD')]],
      ...standardTableConfig,
      footStyles: {
        fillColor: secondaryColor,
        textColor: [255, 255, 255],
        fontSize: 7,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: contentWidth * 0.5, halign: 'left' },
        1: { cellWidth: contentWidth * 0.25, halign: 'right' },
        2: { cellWidth: contentWidth * 0.25, halign: 'right' }
      }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 4;
  }
  
  // 4. SERVIÇOS
  doc.setTextColor(...primaryColor);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('4. SERVIÇOS', margin, yPos);
  yPos += 4;
  
  autoTable(doc, {
    startY: yPos,
    head: [['Descrição', 'Valor R$', 'Valor USD']],
    body: [
      ['Honorários', formatCurrency(dados.honorarios), formatCurrency(toUSD(dados.honorarios), 'USD')],
      ['SDAs', formatCurrency(dados.sdas), formatCurrency(toUSD(dados.sdas), 'USD')],
      ['Emissão LI', formatCurrency(dados.emissao_li), formatCurrency(toUSD(dados.emissao_li), 'USD')],
      ['Taxa Expediente', formatCurrency(dados.taxa_expediente), formatCurrency(toUSD(dados.taxa_expediente), 'USD')],
    ],
    foot: [['TOTAL SERVIÇOS', formatCurrency(resultados.total_servicos), formatCurrency(toUSD(resultados.total_servicos), 'USD')]],
    ...standardTableConfig,
    footStyles: {
      fillColor: secondaryColor,
      textColor: [255, 255, 255],
      fontSize: 7,
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: contentWidth * 0.5, halign: 'left' },
      1: { cellWidth: contentWidth * 0.25, halign: 'right' },
      2: { cellWidth: contentWidth * 0.25, halign: 'right' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 6;
  
  // 5. RESUMO FINAL COMPACTO
  const resumoStartY = yPos;
  
  doc.setTextColor(...primaryColor);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('RESUMO FINAL', pageWidth / 2, yPos + 3, { align: 'center' });
  
  yPos += 6;
  
  autoTable(doc, {
    startY: yPos,
    body: [
      ['CIF (FOB + Frete + Seguro)', formatCurrency(resultados.cif), formatCurrency(resultados.cif_usd, 'USD')],
      ['Total de Impostos', formatCurrency(resultados.total_impostos), formatCurrency(toUSD(resultados.total_impostos), 'USD')],
      ['Total de Despesas', formatCurrency(resultados.total_despesas), formatCurrency(toUSD(resultados.total_despesas), 'USD')],
      ['Total de Serviços', formatCurrency(resultados.total_servicos), formatCurrency(toUSD(resultados.total_servicos), 'USD')],
    ],
    theme: 'plain',
    margin: { left: margin + 5, right: margin + 5 },
    tableWidth: contentWidth - 10,
    styles: { fontSize: 7, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: (contentWidth - 10) * 0.5, halign: 'left' },
      1: { halign: 'right', cellWidth: (contentWidth - 10) * 0.25 },
      2: { halign: 'right', cellWidth: (contentWidth - 10) * 0.25 }
    }
  });
  
  const resumoEndY = (doc as any).lastAutoTable.finalY;
  
  // Desenhar o background DEPOIS da tabela, com altura correta
  doc.setFillColor(...lightGray);
  doc.roundedRect(margin, resumoStartY, contentWidth, resumoEndY - resumoStartY + 2, 2, 2, 'F');
  
  // Redesenhar o título por cima do background
  doc.setTextColor(...primaryColor);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('RESUMO FINAL', pageWidth / 2, resumoStartY + 3, { align: 'center' });
  
  // Redesenhar a tabela por cima do background
  autoTable(doc, {
    startY: resumoStartY + 6,
    body: [
      ['CIF (FOB + Frete + Seguro)', formatCurrency(resultados.cif), formatCurrency(resultados.cif_usd, 'USD')],
      ['Total de Impostos', formatCurrency(resultados.total_impostos), formatCurrency(toUSD(resultados.total_impostos), 'USD')],
      ['Total de Despesas', formatCurrency(resultados.total_despesas), formatCurrency(toUSD(resultados.total_despesas), 'USD')],
      ['Total de Serviços', formatCurrency(resultados.total_servicos), formatCurrency(toUSD(resultados.total_servicos), 'USD')],
    ],
    theme: 'plain',
    margin: { left: margin + 5, right: margin + 5 },
    tableWidth: contentWidth - 10,
    styles: { fontSize: 7, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: (contentWidth - 10) * 0.5, halign: 'left' },
      1: { halign: 'right', cellWidth: (contentWidth - 10) * 0.25 },
      2: { halign: 'right', cellWidth: (contentWidth - 10) * 0.25 }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 4;
  
  // 6. CUSTO TOTAL FINAL
  doc.setFillColor(...successColor);
  doc.roundedRect(margin, yPos - 1, contentWidth, 12, 2, 2, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('CUSTO TOTAL + VALOR DE AQUISIÇÃO', pageWidth / 2, yPos + 2, { align: 'center' });
  
  doc.setFontSize(10);
  const totalBRL = formatCurrency(resultados.custo_final);
  const totalUSD = formatCurrency(toUSD(resultados.custo_final), 'USD');
  
  const centerX = pageWidth / 2;
  doc.text(totalBRL, centerX - 20, yPos + 7, { align: 'right' });
  doc.text(' | ', centerX, yPos + 7, { align: 'center' });
  doc.text(totalUSD, centerX + 20, yPos + 7, { align: 'left' });
  
  // Composição percentual
  yPos += 14;
  doc.setTextColor(...primaryColor);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  const cifPercent = ((resultados.cif / resultados.custo_final) * 100).toFixed(1);
  const impostosPercent = ((resultados.total_custo_impostos / resultados.custo_final) * 100).toFixed(1);
  doc.text(`Composição: CIF ${cifPercent}% | Impostos + Despesas ${impostosPercent}%`, pageWidth / 2, yPos, { align: 'center' });
  
  // Rodapé
  doc.setFontSize(7);
  doc.setTextColor(128, 128, 128);
  doc.text('Documento gerado automaticamente', margin, pageHeight - 8);
  doc.text('Página 1 de 1', pageWidth - margin, pageHeight - 8, { align: 'right' });
  
  // Salvar
  const fileName = `precusto_importacao_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};