/**
 * ============================================
 * 📄 TEXT CHUNKER UTILITY
 * ============================================
 *
 * Divide texto grande em pedaços menores (chunks) para processar com IA.
 *
 * Por que chunks?
 * - APIs de IA têm limite de tokens (palavras)
 * - Textos grandes perdem contexto
 * - Melhor performance e custo
 *
 * Estratégia:
 * 1. Tenta manter parágrafos inteiros juntos (melhor contexto)
 * 2. Se parágrafo é muito grande, divide por palavras
 * 3. Adiciona overlap (sobreposição) entre chunks para não perder contexto
 *
 * Laravel Equivalent: Paginar resultados, mas para texto
 */

/**
 * Divide texto em chunks para processar com IA
 *
 * @param {string} text - Texto completo extraído do PDF
 * @param {number} chunkSize - Tamanho alvo de cada chunk (em palavras). Default: 500
 * @param {number} overlap - Palavras que se repetem entre chunks (mantém contexto). Default: 50
 * @returns {Array<{content: string, chunkIndex: number, pageNumber: number}>}
 *
 * @example
 * const chunks = chunkText(pdfText, 500, 50);
 * // Retorna: [{content: "...", chunkIndex: 0}, {content: "...", chunkIndex: 1}, ...]
 */
export const chunkText = (text, chunkSize = 500, overlap = 50) => {
  /**
   * VALIDAÇÃO INICIAL
   * Retorna array vazio se texto for null, undefined ou vazio
   */
  if (!text || text.trim().length === 0) {
    return [];
  }

  /**
   * LIMPEZA DO TEXTO
   * Objetivo: Normalizar espaços e quebras de linha
   */
  const cleanedText = text
    .replace(/\r\n/g, '\n') // Windows (\r\n) → Unix (\n)
    .replace(/[^\S\n]+/g, ' ') // ✅ Substitui espaços/tabs (mas NÃO \n)
    .replace(/\n /g, '\n') // Remove espaço após \n
    .replace(/ \n/g, '\n') // Remove espaço antes de \n
    .trim(); // Remove espaços início/fim

  /**
   * DIVIDIR EM PARÁGRAFOS
   * ⚠️ PROBLEMA: Como linha 16 removeu todos \n, isso não funciona como esperado
   * Deveria dividir por \n+, mas texto não tem mais \n
   */
  const paragraphs = cleanedText.split(/\n+/).filter(p => p.trim().length > 0);

  /**
   * VARIÁVEIS DE CONTROLE
   * chunks: Array final com todos os pedaços
   * currentChunk: Parágrafos sendo acumulados no chunk atual
   * currentWordCount: Contador de palavras do chunk atual
   * chunkIndex: Índice do chunk (0, 1, 2...)
   */
  const chunks = [];
  let currentChunk = [];
  let currentWordCount = 0;
  let chunkIndex = 0;

  /**
   * LOOP PRINCIPAL: Processa cada parágrafo
   */
  for (const paragraph of paragraphs) {
    // Dividir parágrafo em palavras
    const paragraphWords = paragraph.trim().split(/\s+/);
    const paragraphWordCount = paragraphWords.length;

    /**
     * CASO 1: Parágrafo MAIOR que chunk size
     * Se um único parágrafo tem mais palavras que o limite,
     * precisa dividir esse parágrafo em vários chunks
     */
    if (paragraphWordCount > chunkSize) {
      // Salvar chunk atual antes de processar parágrafo grande
      if (currentChunk.length > 0) {
        chunks.push({
          content: currentChunk.join('\n\n'), // Junta parágrafos com dupla quebra
          chunkIndex: chunkIndex++, // Incrementa índice
          pageNumber: 0, // Placeholder (não temos info de página)
        });
        currentChunk = [];
        currentWordCount = 0;
      }

      /**
       * Dividir parágrafo grande em múltiplos chunks baseados em palavras
       *
       * Exemplo: Parágrafo com 1500 palavras, chunkSize=500, overlap=50
       * - Chunk 1: palavras 0-500
       * - Chunk 2: palavras 450-950 (overlap de 50 com anterior)
       * - Chunk 3: palavras 900-1400
       * - Chunk 4: palavras 1350-1500
       */
      for (let i = 0; i < paragraphWords.length; i += chunkSize - overlap) {
        const chunkWords = paragraphWords.slice(i, i + chunkSize);
        chunks.push({
          content: chunkWords.join(' '),
          chunkIndex: chunkIndex++,
          pageNumber: 0,
        });

        // Break se chegou no final
        if (i + chunkSize >= paragraphWords.length) break;
      }
      continue; // Pula para próximo parágrafo
    }

    /**
     * CASO 2: Adicionar parágrafo normal ao chunk atual
     * Verifica se adicionar esse parágrafo ultrapassa o limite
     */
    if (currentWordCount + paragraphWordCount > chunkSize && currentChunk.length > 0) {
      // Salvar chunk atual (está cheio)
      chunks.push({
        content: currentChunk.join('\n\n'),
        chunkIndex: chunkIndex++,
        pageNumber: 0,
      });

      /**
       * CRIAR OVERLAP (Sobreposição)
       * Pega últimas N palavras do chunk anterior e coloca no início do novo
       * Isso mantém contexto entre chunks
       *
       * Laravel: Como paginar mas repetir alguns registros entre páginas
       */
      const prevChunkText = currentChunk.join(' ');
      const prevWords = prevChunkText.split(/\s+/);

      // Pega no máximo 'overlap' palavras do final
      const overlapText = prevWords.slice(-Math.min(overlap, prevWords.length)).join(' ');

      // Novo chunk começa com overlap + parágrafo atual
      currentChunk = [overlapText, paragraph.trim()];
      currentWordCount = overlapText.split(/\s+/).length + paragraphWordCount;
    } else {
      /**
       * Chunk ainda tem espaço, adicionar parágrafo
       */
      currentChunk.push(paragraph.trim());
      currentWordCount += paragraphWordCount;
    }
  }

  /**
   * ADICIONAR ÚLTIMO CHUNK
   * Após loop terminar, pode sobrar um chunk não salvo
   */
  if (currentChunk.length > 0) {
    chunks.push({
      content: currentChunk.join('\n\n'),
      chunkIndex: chunkIndex,
      pageNumber: 0,
    });
  }

  /**
   * FALLBACK (Plano B)
   * Se por algum motivo não criou chunks, divide texto bruto por palavras
   * Isso acontece se:
   * - Texto tem algum formato estranho
   * - Limpeza falhou
   * - Não conseguiu dividir em parágrafos
   */
  if (chunks.length === 0 && cleanedText.length > 0) {
    const allWords = cleanedText.split(/\s+/);

    // Divide em chunks de palavras com overlap
    for (let i = 0; i < allWords.length; i += chunkSize - overlap) {
      const chunkWords = allWords.slice(i, i + chunkSize);
      chunks.push({
        content: chunkWords.join(' '),
        chunkIndex: chunkIndex++,
        pageNumber: 0,
      });
      if (i + chunkSize >= allWords.length) break;
    }
  }

  /**
   * RETORNAR CHUNKS
   * Array de objetos: [{content: "...", chunkIndex: 0, pageNumber: 0}, ...]
   */
  return chunks;
};

/**
 * ============================================
 * 🔍 FIND RELEVANT CHUNKS
 * ============================================
 *
 * Busca os chunks mais relevantes para uma pergunta do usuário.
 * Usa técnica de keyword matching com pontuação.
 *
 * Exemplo de uso:
 * - Usuário pergunta: "O que é machine learning?"
 * - Função encontra chunks que mencionam "machine" e "learning"
 * - Retorna os 3 melhores chunks para enviar à IA
 *
 * Laravel Equivalent: Similar a search/filter com scoring
 */

/**
 * Encontra chunks relevantes baseado em correspondência de palavras-chave
 *
 * @param {Array<Object>} chunks - Array com todos os chunks do documento
 * @param {string} query - Pergunta do usuário
 * @param {number} maxChunks - Máximo de chunks a retornar (default: 3)
 * @returns {Array<Object>} Chunks ordenados por relevância
 *
 * @example
 * const relevant = findRelevantChunks(allChunks, "machine learning", 3);
 * // Retorna: [
 * //   {content: "...", score: 8.5, chunkIndex: 5},
 * //   {content: "...", score: 6.2, chunkIndex: 12},
 * //   {content: "...", score: 4.1, chunkIndex: 3}
 * // ]
 */
export const findRelevantChunks = (chunks, query, maxChunks = 3) => {
  /**
   * VALIDAÇÃO INICIAL
   * Retorna vazio se não há chunks ou pergunta
   */
  if (!chunks || chunks.length === 0 || !query) {
    return [];
  }

  /**
   * STOP WORDS (Palavras Irrelevantes)
   *
   * Palavras muito comuns que não ajudam na busca.
   * Exemplo: "o", "de", "que", "the", "is"
   *
   * Set() = estrutura de dados SEM duplicatas
   * - .has() é O(1) - acesso instantâneo (hash)
   * - Array.includes() é O(n) - precisa varrer tudo
   *
   * Por isso usamos Set para performance!
   * Laravel: Similar a usar array_flip() para acesso rápido
   */
  const stopWords = new Set([
    // Stop words em inglês
    'the',
    'is',
    'at',
    'which',
    'on',
    'a',
    'an',
    'and',
    'or',
    'but',
    'in',
    'with',
    'to',
    'for',
    'of',
    'as',
    'by',
    'this',
    'that',
    'it',
    'are',
    'was',
    'were',
    'been',
    'be',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'could',
    'should',
    'may',
    'might',

    // Stop words em português
    'o',
    'a',
    'os',
    'as',
    'um',
    'uma',
    'uns',
    'umas',
    'de',
    'da',
    'do',
    'das',
    'dos',
    'em',
    'no',
    'na',
    'nos',
    'nas',
    'por',
    'para',
    'com',
    'sem',
    'sob',
    'sobre',
    'e',
    'ou',
    'mas',
    'pois',
    'que',
    'como',
    'quando',
    'onde',
    'é',
    'são',
    'foi',
    'era',
    'ser',
    'estar',
    'ter',
    'haver',
    'isso',
    'este',
    'esse',
    'aquele',
    'esta',
    'essa',
    'aquela',
    'seu',
    'sua',
    'seus',
    'suas',
    'meu',
    'minha',
    'meus',
    'minhas',
  ]);

  /**
   * EXTRAIR PALAVRAS-CHAVE DA PERGUNTA
   *
   * Processo:
   * 1. Converte para minúsculas (case-insensitive)
   * 2. Divide por espaços em branco (\s+)
   * 3. Remove palavras muito curtas (< 3 chars)
   * 4. Remove stop words (palavras irrelevantes)
   *
   * Exemplo:
   * "O que é machine learning?" → ["machine", "learning"]
   * (removeu: "o", "que", "é" - são stop words)
   */
  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  /**
   * FALLBACK: Se nenhuma palavra relevante
   *
   * Pode acontecer se pergunta só tem stop words:
   * Exemplo: "O que é isso?" → [] (todas são stop words)
   *
   * Nesse caso, retorna primeiros N chunks sem scoring
   */
  if (queryWords.length === 0) {
    return chunks.slice(0, maxChunks).map(chunk => ({
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber,
      _id: chunk._id,
    }));
  }

  /**
   * CALCULAR SCORE DE CADA CHUNK
   *
   * Para cada chunk, calcula pontuação baseada em:
   * 1. Quantas vezes cada palavra aparece (exactMatches)
   * 2. Quantas palavras diferentes foram encontradas (uniqueWordsFound)
   * 3. Tamanho do chunk (normalização)
   * 4. Posição no documento (chunks iniciais ganham bônus)
   */
  const scoredChunks = chunks.map((chunk, index) => {
    const content = chunk.content.toLowerCase();
    const contentWords = content.split(/\s+/).length;
    let score = 0;

    /**
     * PONTUAR CADA PALAVRA DA PERGUNTA
     *
     * Para cada palavra-chave, conta quantas vezes aparece no chunk
     * Usa regex \b${word}\b para match EXATO (palavra inteira)
     *
     * Exemplo:
     * - Busca "learn" no texto "learning machine"
     * - \blearn\b NÃO encontra em "learning" (precisa ser palavra completa)
     * - Evita falsos positivos
     *
     * Pontuação: cada match vale 3 pontos
     */
    for (const word of queryWords) {
      const exactMatches = (content.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
      score += exactMatches * 3;
    }

    /**
     * BÔNUS: Múltiplas palavras encontradas
     *
     * Se chunk tem várias palavras da pergunta, ganha bônus extra
     * Indica maior relevância para a pergunta completa
     *
     * Exemplo:
     * Pergunta: "machine learning algorithms"
     * - Chunk A: menciona "machine" e "learning" = 2 palavras = +4 pontos
     * - Chunk B: menciona só "machine" = 1 palavra = 0 bônus
     */
    const uniqueWordsFound = queryWords.filter(word => content.includes(word)).length;
    if (uniqueWordsFound > 1) {
      score += uniqueWordsFound * 2;
    }

    /**
     * NORMALIZAÇÃO POR TAMANHO
     *
     * Divide score pela raiz quadrada do tamanho
     * Evita que chunks gigantes sempre ganhem só por serem maiores
     *
     * Exemplo:
     * - Chunk pequeno (100 palavras): 3 matches = score 3 / √100 = 0.3
     * - Chunk grande (1000 palavras): 3 matches = score 3 / √1000 = 0.095
     *
     * Math.sqrt = raiz quadrada
     */
    const normalizedScore = score / Math.sqrt(contentWords);

    /**
     * BÔNUS DE POSIÇÃO
     *
     * Chunks no início do documento ganham pequeno bônus
     * Assume que informações importantes tendem a vir primeiro
     *
     * Fórmula: 1 - (posição / total) * 0.1
     * - Primeiro chunk: 1 - (0 / 100) * 0.1 = 1.0 (sem penalidade)
     * - Último chunk: 1 - (99 / 100) * 0.1 = 0.901 (pequena penalidade)
     *
     * Bônus é pequeno (max 10%) para não sobrepor relevância real
     */
    const positionBonus = 1 - (index / chunks.length) * 0.1;

    /**
     * RETORNAR CHUNK COM METADATA
     *
     * Remove propriedades Mongoose (se vier do banco)
     * Adiciona informações de scoring para debug
     */
    return {
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber,
      _id: chunk._id,
      score: normalizedScore * positionBonus, // Score final
      rawScore: score, // Score antes de normalizar (debug)
      matchedWords: uniqueWordsFound, // Quantas palavras foram encontradas
    };
  });

  /**
   * FILTRAR, ORDENAR E RETORNAR TOP N
   *
   * 1. Filtra: Remove chunks com score = 0 (nenhuma palavra encontrada)
   * 2. Ordena por:
   *    - Score (maior primeiro)
   *    - Se empate: mais palavras encontradas
   *    - Se ainda empatar: menor índice (mais cedo no documento)
   * 3. Slice: Retorna apenas os N melhores (maxChunks)
   *
   * Laravel: Similar a ->filter()->sortByDesc()->take()
   */
  return scoredChunks
    .filter(chunk => chunk.score > 0)
    .sort((a, b) => {
      // Ordenação primária: maior score
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // Desempate 1: mais palavras encontradas
      if (b.matchedWords !== a.matchedWords) {
        return b.matchedWords - a.matchedWords;
      }
      // Desempate 2: chunk mais cedo no documento
      return a.chunkIndex - b.chunkIndex;
    })
    .slice(0, maxChunks);
};

/**
 * ============================================
 * FLUXO DE EXECUÇÃO - EXEMPLO
 * ============================================
 *
 * Input:
 * "Primeiro parágrafo com 300 palavras...\n\nSegundo parágrafo com 400 palavras..."
 *
 * Processo:
 * 1. Limpa texto (normaliza espaços)
 * 2. Divide em parágrafos: ["Primeiro...", "Segundo..."]
 * 3. Acumula parágrafos até atingir 500 palavras
 * 4. Quando ultrapassar, salva chunk e começa novo com overlap
 *
 * Output:
 * [
 *   { content: "Primeiro parágrafo...", chunkIndex: 0, pageNumber: 0 },
 *   { content: "...overlap + Segundo parágrafo...", chunkIndex: 1, pageNumber: 0 }
 * ]
 */
