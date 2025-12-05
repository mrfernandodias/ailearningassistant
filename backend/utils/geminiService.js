import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

if (!process.env.GEMINI_API_KEY) {
  console.error('FATAL ERROR: GEMINI_API_KEY is not set in the environment variables');
  process.exit(1);
}

/**
 * Generate flashcards from text
 * @param {string} text - Document text
 * @param {number} count - Number of flashcards to generate
 * @returns {Promise<Array<{question: string, answer: string, difficulty: string}>>}
 */
export const generateFlashcards = async (text, count = 10) => {
  const prompt = `You are an educational content creator. Generate exactly ${count} high-quality flashcards from the following text.

  Instructions:
  1. Create questions that test comprehension, not just memorization
  2. Ensure answers are concise but complete (1-3 sentences)
  3. Distribute difficulty levels evenly:
     - easy: Basic definitions and concepts
     - medium: Application and relationships
     - hard: Analysis and deep understanding
  4. Avoid yes/no questions
  5. Each flashcard should be self-contained

  Format (strictly follow):
  Q: [Clear, specific question]
  A: [Concise, accurate answer]
  D: [easy, medium, or hard]

  Separate each flashcard with "---"

  Text:
  ${text.substring(0, 15000)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });

    const generatedText = response.text;

    // Parse the response
    const flashcards = [];
    const cards = generatedText.split('---').filter(c => c.trim());

    for (const card of cards) {
      const lines = card.trim().split('\n');
      let question = '',
        answer = '',
        difficulty = 'medium';

      for (const line of lines) {
        if (line.startsWith('Q:')) {
          question = line.substring(2).trim();
        } else if (line.startsWith('A:')) {
          answer = line.substring(2).trim();
        } else if (line.startsWith('D:')) {
          const diff = line.substring(2).trim().toLowerCase();
          if (['easy', 'medium', 'hard'].includes(diff)) {
            difficulty = diff;
          }
        }
      }

      if (question && answer) {
        flashcards.push({ question, answer, difficulty });
      }
    }
    return flashcards.slice(0, count);
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate flashcards');
  }
};

/**
 * Generate quiz questions
 * @param {string} text - Document text
 * @param {number} numQuestions - Number of questions
 * @returns {Promise<Array<{question: string, options: Array, correctAnswer: string, explanation: string, difficulty: string}>>}
 */
export const generateQuiz = async (text, numQuestions = 5) => {
  const prompt = `You are a quiz creator. Generate exactly ${numQuestions} multiple choice questions from the following text.

  Instructions:
  1. Create realistic, plausible distractors (wrong options)
  2. Ensure only ONE correct answer per question
  3. Avoid "all of the above" or "none of the above"
  4. Distribute difficulty:
     - easy: Direct recall from text
     - medium: Require understanding
     - hard: Application or inference
  5. Explanations should clarify why the answer is correct

  Format (strictly follow):
  Q: [Clear question]
  01: [Option 1]
  02: [Option 2]
  03: [Option 3]
  04: [Option 4]
  C: [Correct option - write EXACTLY as shown above, including number]
  E: [2-3 sentence explanation]
  D: [easy, medium, or hard]

  Separate questions with "---"

  Text:
  ${text.substring(0, 15000)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });

    const generatedText = response.text;

    const questions = [];
    const questionBlocks = generatedText.split('---').filter(q => q.trim());

    for (const block of questionBlocks) {
      const lines = block.trim().split('\n');
      const options = [];
      let question = '',
        correctAnswer = '',
        explanation = '',
        difficulty = 'medium';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('Q:')) {
          question = trimmed.substring(2).trim();
        } else if (trimmed.match(/^0\d:/)) {
          options.push(trimmed.substring(3).trim());
        } else if (trimmed.startsWith('C:')) {
          correctAnswer = trimmed.substring(2).trim();
        } else if (trimmed.startsWith('E:')) {
          explanation = trimmed.substring(2).trim();
        } else if (trimmed.startsWith('D:')) {
          const diff = trimmed.substring(2).trim().toLowerCase();
          if (['easy', 'medium', 'hard'].includes(diff)) {
            difficulty = diff;
          }
        }
      }

      if (question && options.length === 4 && correctAnswer) {
        questions.push({ question, options, correctAnswer, explanation, difficulty });
      }
    }
    return questions.slice(0, numQuestions);
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate quiz');
  }
};

/**
 * Generate document summary
 * @param {string} text - Document text
 * @param {Promise<string>}
 */
export const generateSummary = async text => {
  const prompt = `You are an expert at summarizing technical and educational content.

  Instructions:
  1. Create a comprehensive but concise summary (300-500 words)
  2. Use markdown formatting:
     - # for main title
     - ## for sections
     - **bold** for key terms
     - Bullet points for lists
  3. Structure:
     - Brief overview (2-3 sentences)
     - Main concepts (organized by topic)
     - Key takeaways
  4. Focus on actionable information and core concepts
  5. Maintain academic tone

  Text to summarize:
  ${text.substring(0, 20000)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });

    const generatedText = response.text;
    return generatedText;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate summary');
  }
};

/**
 * Generate with document context (with multi-turn support and citations)
 * @param {string} question - User Question
 * @param {Array<Object>} chunks - Relevant document chunks
 * @param {Array<Object>} conversationHistory - Previous messages (optional)
 * @return {Promise<string>}
 */
export const chatWithContext = async (question, chunks, conversationHistory = []) => {
  const context = chunks.map((c, i) => `[Chunk ${i + 1}]\n${c.content}`).join('\n\n');

  // Build conversation history string
  const historyText =
    conversationHistory.length > 0
      ? `\nPrevious conversation:\n${conversationHistory
          .slice(-5)
          .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
          .join('\n')}\n`
      : '';

  const prompt = `You are an educational AI assistant. Answer based on the provided document context.

${historyText}
Context from document:
${context}

Instructions:
1. Answer the question using ONLY information from the context above
2. Be concise, clear, and educational
3. If the answer is not in the context, say so clearly
4. Use bullet points or numbered lists when appropriate
5. If referencing previous conversation, make it clear

Question: ${question}

Answer:`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });

    const generatedText = response.text;
    return generatedText;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to process chat request');
  }
};

/**
 * Expand user query with related terms and synonyms
 * @param {string} query - Original user query
 * @return {Promise<Array<string>>}
 */
export const expandQuery = async query => {
  const prompt = `Given the following search query, generate 2-3 alternative phrasings or related questions that capture the same intent. Return ONLY the alternatives, one per line, without numbering or explanation.

Original query: ${query}

Alternatives:`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });

    const generatedText = response.text;
    const alternatives = generatedText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.match(/^\d+[.)]/));

    return [query, ...alternatives.slice(0, 2)];
  } catch (error) {
    console.error('Gemini API error:', error);
    return [query]; // Fallback to original query
  }
};

/**
 * Explain a specific concept
 * @param {string} concept - Concept to explain
 * @param {string} context - Relevant context
 * @return {Promise<string>}
 */
export const explainConcept = async (concept, context) => {
  const prompt = `You are an educational tutor. Explain the concept of "${concept}" based on the provided context.

  Instructions:
  1. Start with a simple, one-sentence definition
  2. Break down the concept into digestible parts
  3. Use analogies or real-world examples when helpful
  4. Address common misconceptions if any
  5. Keep language clear and accessible
  6. Use markdown formatting:
     - **bold** for the concept name
     - Bullet points for key aspects
     - Code blocks for technical terms
  7. End with a practical application or use case

  Context from document:
  ${context.substring(0, 10000)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });

    const generatedText = response.text;
    return generatedText;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to explain concept');
  }
};
