import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DadosImportacao, ResultadosCalculados } from '@/pages/Index';

export const generatePDF = (dados: DadosImportacao, resultados: ResultadosCalculados) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Configurações de margem e página (reduzidas para caber mais conteúdo)
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 15;
  const marginRight = 15;
  const marginTop = 15;
  const marginBottom = 15;
  const contentWidth = pageWidth - marginLeft - marginRight;
  
  // Cores personalizadas
  const primaryColor = [33, 90, 154]; // Azul marítimo
  const secondaryColor = [52, 152, 219]; // Azul claro
  const successColor = [46, 125, 50]; // Verde
  const headerBg = [245, 247, 250]; // Cinza claro
  
  // Cabeçalho do documento (reduzido)
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 20, 'F');
  
  // Título
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Pré-Custo Importação Marítima', pageWidth / 2, 10, { align: 'center' });
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Cálculo detalhado de impostos e custos de importação', pageWidth / 2, 15, { align: 'center' });
  
  // Data e câmbio
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(6);
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, marginLeft, 18);
  doc.text(`Câmbio USD: R$ ${dados.cotacao_usd.toFixed(4)}`, pageWidth - marginRight - 30, 18);
  
  let yPos = 26;
  
  // Função auxiliar para formatar moeda
  const formatCurrency = (value: number, currency: 'BRL' | 'USD' = 'BRL') => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  // Função para converter para USD
  const toUSD = (brl: number) => brl / dados.cotacao_usd;
  
  // Função para verificar se precisa nova página
  const checkNewPage = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - marginBottom) {
      doc.addPage();
      yPos = marginTop;
      return true;
    }
    return false;
  };
  
  // 1. VALORES BASE - CIF
  doc.setTextColor(...primaryColor);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('1. VALORES BASE', marginLeft, yPos);
  yPos += 3;
  
  autoTable(doc, {
    startY: yPos,
    head: [['Descrição', 'Valor USD', 'Valor R$']],
    body: [
      ['Valor FOB', formatCurrency(dados.valor_fob, 'USD'), formatCurrency(dados.valor_fob * dados.cotacao_usd)],
      ['Frete Internacional', formatCurrency(dados.frete_internacional, 'USD'), formatCurrency(dados.frete_internacional * dados.cotacao_usd)],
      ['Seguro Internacional', formatCurrency(dados.seguro_internacional, 'USD'), formatCurrency(dados.seguro_internacional * dados.cotacao_usd)],
    ],
    foot: [['CIF TOTAL', formatCurrency(resultados.cif_usd, 'USD'), formatCurrency(resultados.cif)]],
    headStyles: { fillColor: primaryColor, fontSize: 6 },
    footStyles: { fillColor: secondaryColor, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 6 },
    bodyStyles: { fontSize: 6 },
    theme: 'striped',
    margin: { left: marginLeft, right: marginRight },
    tableWidth: contentWidth,
    styles: { overflow: 'linebreak', cellPadding: 1 },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 35, halign: 'right' },
      2: { cellWidth: 35, halign: 'right' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 3;
  
  // 2. IMPOSTOS
  doc.setTextColor(...primaryColor);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('2. IMPOSTOS', marginLeft, yPos);
  yPos += 3;
  
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
    headStyles: { fillColor: primaryColor, fontSize: 6 },
    bodyStyles: { fontSize: 6 },
    theme: 'striped',
    margin: { left: marginLeft, right: marginRight },
    tableWidth: contentWidth,
    styles: { overflow: 'linebreak', cellPadding: 1 },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 15, halign: 'center' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 25, halign: 'right' },
      4: { cellWidth: 25, halign: 'right' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 1;
  
  // Total Impostos em tabela separada
  autoTable(doc, {
    startY: yPos,
    body: [['TOTAL IMPOSTOS', '', '', formatCurrency(resultados.total_impostos), formatCurrency(toUSD(resultados.total_impostos), 'USD')]],
    bodyStyles: { 
      fillColor: secondaryColor, 
      textColor: [255, 255, 255], 
      fontStyle: 'bold', 
      fontSize: 6 
    },
    theme: 'plain',
    margin: { left: marginLeft, right: marginRight },
    tableWidth: contentWidth,
    styles: { overflow: 'linebreak', cellPadding: 1 },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 15, halign: 'center' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 25, halign: 'right' },
      4: { cellWidth: 25, halign: 'right' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 3;
  
  // 3. DESPESAS LOCAIS
  if (dados.despesas_locais.length > 0) {
    doc.setTextColor(...primaryColor);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('3. DESPESAS LOCAIS', marginLeft, yPos);
    yPos += 3;
    
    const despesasBody = dados.despesas_locais.map(despesa => {
      const valorBRL = despesa.moeda === 'USD' ? despesa.valor * dados.cotacao_usd : despesa.valor;
      const valorUSD = despesa.moeda === 'USD' ? despesa.valor : despesa.valor / dados.cotacao_usd;
      return [
        despesa.descricao.length > 30 ? despesa.descricao.substring(0, 30) + '...' : despesa.descricao,
        despesa.moeda,
        formatCurrency(valorBRL),
        formatCurrency(valorUSD, 'USD')
      ];
    });
    
    autoTable(doc, {
      startY: yPos,
      head: [['Descrição', 'Moeda', 'Valor R$', 'Valor USD']],
      body: despesasBody,
      foot: [['TOTAL DESPESAS', '', formatCurrency(resultados.total_despesas), formatCurrency(toUSD(resultados.total_despesas), 'USD')]],
      headStyles: { fillColor: primaryColor, fontSize: 6 },
      footStyles: { fillColor: secondaryColor, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 6 },
      bodyStyles: { fontSize: 6 },
      theme: 'striped',
      margin: { left: marginLeft, right: marginRight },
      tableWidth: contentWidth,
      styles: { overflow: 'linebreak', cellPadding: 1 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 15, halign: 'center' },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 30, halign: 'right' }
      }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 3;
  }
  
  // 4. SERVIÇOS
  doc.setTextColor(...primaryColor);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('4. SERVIÇOS FIXOS', marginLeft, yPos);
  yPos += 3;
  
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
    headStyles: { fillColor: primaryColor, fontSize: 6 },
    footStyles: { fillColor: secondaryColor, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 6 },
    bodyStyles: { fontSize: 6 },
    theme: 'striped',
    margin: { left: marginLeft, right: marginRight },
    tableWidth: contentWidth,
    styles: { overflow: 'linebreak', cellPadding: 1 },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 35, halign: 'right' },
      2: { cellWidth: 35, halign: 'right' }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 4;
  
  // RESUMO FINAL (compacto)
  const resumoStartY = yPos;
  const tituloHeight = 4;
  const tabelaHeight = 16;
  const totalBoxHeight = tituloHeight + tabelaHeight + 2;
  
  doc.setFillColor(...headerBg);
  doc.roundedRect(marginLeft, resumoStartY - 1, contentWidth, totalBoxHeight, 2, 2, 'F');
  
  doc.setTextColor(...primaryColor);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('RESUMO FINAL', pageWidth / 2, resumoStartY + 2, { align: 'center' });
  
  yPos = resumoStartY + tituloHeight;
  
  autoTable(doc, {
    startY: yPos,
    body: [
      ['CIF (FOB + Frete + Seguro)', formatCurrency(resultados.cif), formatCurrency(resultados.cif_usd, 'USD')],
      ['Total de Impostos', formatCurrency(resultados.total_impostos), formatCurrency(toUSD(resultados.total_impostos), 'USD')],
      ['Total de Despesas', formatCurrency(resultados.total_despesas), formatCurrency(toUSD(resultados.total_despesas), 'USD')],
      ['Total de Serviços', formatCurrency(resultados.total_servicos), formatCurrency(toUSD(resultados.total_servicos), 'USD')],
    ],
    theme: 'plain',
    margin: { left: marginLeft + 5, right: marginRight + 5 },
    tableWidth: contentWidth - 10,
    bodyStyles: { fontSize: 5, cellPadding: 0.5 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 65 },
      1: { halign: 'right', cellWidth: 30 },
      2: { halign: 'right', cellWidth: 30 }
    }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 3;
  
  // CUSTO TOTAL FINAL - Destaque (compacto)
  doc.setFillColor(...successColor);
  doc.roundedRect(marginLeft, yPos - 1, contentWidth, 9, 2, 2, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  
  // Título na primeira linha
  doc.text('CUSTO TOTAL + VALOR DE AQUISIÇÃO DO PRODUTO', pageWidth / 2, yPos + 1.5, { align: 'center' });
  
  // Valores na segunda linha
  doc.setFontSize(7);
  const totalBRL = formatCurrency(resultados.custo_final);
  const totalUSD = formatCurrency(toUSD(resultados.custo_final), 'USD');
  
  // Posiciona os valores lado a lado com espaçamento adequado
  const centerX = pageWidth / 2;
  doc.text(totalBRL, centerX - 15, yPos + 5.5, { align: 'right' });
  doc.text(' | ', centerX, yPos + 5.5, { align: 'center' });
  doc.text(totalUSD, centerX + 15, yPos + 5.5, { align: 'left' });
  
  // Percentuais
  yPos += 12;
  doc.setTextColor(...primaryColor);
  doc.setFontSize(5);
  doc.setFont('helvetica', 'normal');
  const cifPercent = ((resultados.cif / resultados.custo_final) * 100).toFixed(1);
  const impostosPercent = ((resultados.total_custo_impostos / resultados.custo_final) * 100).toFixed(1);
  doc.text(`Composição: CIF ${cifPercent}% | Impostos + Despesas ${impostosPercent}%`, pageWidth / 2, yPos, { align: 'center' });
  
  // Rodapé
  doc.setFontSize(6);
  doc.setTextColor(128, 128, 128);
  doc.text('Documento gerado automaticamente', marginLeft, pageHeight - 8);
  doc.text(`Página 1 de ${doc.getNumberOfPages()}`, pageWidth - marginRight, pageHeight - 8, { align: 'right' });
  
  // Salvar o PDF
  const fileName = `precusto_importacao_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};