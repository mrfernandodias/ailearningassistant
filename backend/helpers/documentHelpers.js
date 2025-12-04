/**
 * ============================================
 * 📄 DOCUMENT HELPERS
 * ============================================
 *
 * Funções auxiliares para processamento de documentos
 * Separadas do controller para manter organização e reusabilidade
 *
 * Laravel Equivalent: Similar a criar uma classe Helper ou Service
 */

import Document from '../models/Document.js';
import { extractTextFromPDF } from '../utils/pdfParser.js';
import { chunkText } from '../utils/textChunker.js';

/**
 * Processa PDF extraindo texto e criando chunks
 *
 * Executa em background após upload do arquivo
 * Atualiza status do documento no banco (processing → ready/failed)
 *
 * @param {string} documentId - ID do documento no MongoDB
 * @param {string} filePath - Caminho do arquivo PDF no servidor
 * @returns {Promise<void>}
 *
 * Laravel: Similar a um Job/Queue (ProcessPdfJob)
 */
export const processPDF = async (documentId, filePath) => {
  try {
    // 1. Extrair texto do PDF
    const { text, numPages, info } = await extractTextFromPDF(filePath);

    // 2. Dividir texto em chunks (pedaços menores para IA processar)
    const chunks = chunkText(text, 500, 50);

    // 3. Atualizar documento no banco com resultado
    await Document.findByIdAndUpdate(documentId, {
      extractedText: text,
      chunks: chunks,
      totalPages: numPages,
      metadata: {
        title: info?.Title || '',
        author: info?.Author || '',
        subject: info?.Subject || '',
      },
      status: 'ready', // Documento pronto para uso
    });

    console.log(
      `✅ Document ${documentId} processed successfully (${numPages} pages, ${chunks.length} chunks)`
    );
  } catch (error) {
    // Em caso de erro, marcar documento como falho
    console.error(`❌ Error processing document ${documentId}:`, error.message);

    await Document.findByIdAndUpdate(documentId, {
      status: 'failed',
    });
  }
};
