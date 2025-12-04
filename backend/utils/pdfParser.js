/**
 * ============================================
 * 📄 PDF PARSER UTILITY
 * ============================================
 *
 * Utilitário para extração de texto de arquivos PDF
 * Usa a biblioteca pdf-parse para processar PDFs e extrair conteúdo textual
 *
 * Laravel Equivalent: Similar a usar uma lib como Smalot\PdfParser
 */

// ==========================================
// 📦 IMPORTS
// ==========================================
import fs from 'fs/promises'; // File system nativo do Node.js com Promises
import { createRequire } from 'module'; // Para importar módulos CommonJS

/**
 * pdf-parse é um módulo CommonJS (não ES6)
 * Precisamos usar createRequire para importá-lo em projetos ES6
 * O módulo principal exporta a classe PDFParse que é usada diretamente
 */
const require = createRequire(import.meta.url);
const PDFParse = require('pdf-parse').PDFParse;

/**
 * Extrai texto de arquivo PDF
 *
 * @param {string} filePath - Caminho completo do arquivo PDF no servidor
 * @returns {Promise<{text: string, numPages: number, info: Object}>} Dados extraídos do PDF
 *
 * @example
 * const result = await extractTextFromPDF('uploads/document.pdf');
 * console.log(result.text); // Texto completo do PDF
 * console.log(result.numPages); // 10
 * console.log(result.info.Title); // "Título do PDF"
 *
 * Laravel: Similar a $pdf->getText()
 */
export const extractTextFromPDF = async filePath => {
  try {
    /**
     * API do pdf-parse v2:
     * 1. Criar instância de PDFParse passando { data: buffer } nas opções
     * 2. Chamar getText() para extrair o texto
     *
     * A API v2 funciona com opções no construtor
     */
    const dataBuffer = await fs.readFile(filePath);

    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();

    /**
     * Resultado contém:
     * - text: texto completo extraído
     * - total: número de páginas
     */
    return {
      text: result.text,
      numPages: result.total,
      info: {}, // pdf-parse v2 não retorna info diretamente no getText
    };
  } catch (error) {
    /**
     * Tratamento de erros
     * Erros comuns:
     * - Arquivo não existe (ENOENT)
     * - PDF corrompido/inválido
     * - PDF protegido com senha
     * - Sem permissão para ler arquivo
     */
    console.error('PDF parsing error:', error);
    throw new Error('Failed to extract text from PDF');
  }
};
