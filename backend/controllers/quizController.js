import Quiz from '../models/Quiz.js';

/**
 * @desc    Get all quizzes for a document
 * @route   GET /api/quizzes/:documentId
 * @access  Private
 */
export const getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({
      userId: req.user._id,
      documentId: req.params.documentId,
    })
      .populate('documentId', 'title fileName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single quiz by Id
 * @route   GET /api/quizzes/quiz/:id
 * @access  Private
 */
export const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
        statusCode: 404,
      });
    }

    res.status(200).json({
      success: true,
      data: quiz,
      message: 'Operation successful',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit quiz answers
 * @route   POST /api/quizzes/:id/submit
 * @access  Private
 */
export const submitQuiz = async (req, res, next) => {
  try {
    // 1. Extrai o array de respostas do corpo da requisição
    const { answers } = req.body;

    // 2. Valida se answers é um array
    // Garante que o formato dos dados está correto antes de processar
    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a answers array',
        statusCode: 400,
      });
    }

    // 3. Busca o quiz no banco de dados
    // Verifica se o quiz existe e pertence ao usuário autenticado
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    // 4. Retorna erro 404 se o quiz não foi encontrado
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
        statusCode: 404,
      });
    }

    // 5. Verifica se o quiz já foi completado anteriormente
    // Previne que o usuário submeta respostas múltiplas vezes
    if (quiz.completedAt) {
      return res.status(400).json({
        success: false,
        message: 'Quiz already completed',
        statusCode: 400,
      });
    }

    // 6. Inicializa variáveis para processar as respostas
    let correctCount = 0; // Contador de respostas corretas
    const userAnswers = []; // Array para armazenar as respostas processadas

    // 7. Itera sobre cada resposta fornecida pelo usuário
    answers.forEach((answer) => {
      const { questionIndex, optionIndex } = answer;

      // 8. Valida se o índice da questão e opção são válidos
      if (
        typeof questionIndex === 'number' &&
        questionIndex >= 0 &&
        questionIndex < quiz.questions.length &&
        typeof optionIndex === 'number' &&
        optionIndex >= 0 &&
        optionIndex < (quiz.questions[questionIndex]?.options?.length ?? 0)
      ) {
        // 9. Obtém a questão correspondente do quiz
        const question = quiz.questions[questionIndex];

        // 10. Converte a resposta correta ordinal ("01".."04") para índice 0-based
        const correctIndex = Number.parseInt(question.correctAnswer, 10) - 1;

        // 11. Compara diretamente por índice: simples e confiável
        const isCorrect = optionIndex === correctIndex;

        // 12. Incrementa o contador se a resposta estiver correta
        if (isCorrect) correctCount++;

        // 13. Resolve o texto da opção selecionada para armazenar
        const selectedAnswerText = question.options?.[optionIndex] ?? '';

        // 14. Adiciona a resposta processada ao array userAnswers (inclui optionIndex para facilitar resultados)
        userAnswers.push({
          questionIndex,
          optionIndex,
          selectedAnswer: selectedAnswerText,
          isCorrect,
          answeredAt: new Date(),
        });
      }
    });

    // 14. Calcula a pontuação como percentual
    // Exemplo: 8 corretas de 10 = 80%
    const total = quiz.totalQuestions ?? quiz.questions.length;
    const score = Math.round((correctCount / total) * 100);

    // 15. Atualiza o documento do quiz com os resultados
    quiz.userAnswers = userAnswers; // Armazena todas as respostas
    quiz.score = score; // Armazena a pontuação
    quiz.completedAt = new Date(); // Marca como completado

    // 16. Salva as alterações no banco de dados
    await quiz.save();

    // 17. Retorna resposta de sucesso com os resultados detalhados
    res.status(200).json({
      success: true,
      data: {
        quizId: quiz._id,
        score,
        correctCount,
        totalQuestions: quiz.totalQuestions,
        percentage: score,
        userAnswers,
      },
      message: 'Quiz submitted successfully',
    });
  } catch (error) {
    // 18. Captura e passa qualquer erro para o middleware de tratamento de erros
    next(error);
  }
};

/**
 * @desc    Get quiz results
 * @route   GET /api/quizzes/:id/results
 * @access  Private
 */
export const getQuizResults = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate('documentId', 'title');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
        statusCode: 404,
      });
    }

    if (!quiz.completedAt) {
      return res.status(400).json({
        success: false,
        message: 'Quiz not completed yet',
        statusCode: 400,
      });
    }

    // Build detailed results
    const detailedResults = quiz.questions.map((question, index) => {
      const userAnswer = quiz.userAnswers.find(
        (a) => a.questionIndex === index,
      );

      // Deriva índices e textos auxiliares
      const correctIndex = Number.parseInt(question.correctAnswer, 10) - 1;
      const selectedIndex =
        typeof userAnswer?.optionIndex === 'number'
          ? userAnswer.optionIndex
          : Array.isArray(question.options)
            ? question.options.findIndex(
                (opt) => opt === userAnswer?.selectedAnswer,
              )
            : -1;
      const correctAnswerText = Array.isArray(question.options)
        ? (question.options[correctIndex] ?? null)
        : null;

      return {
        questionIndex: index,
        question: question.question,
        correctAnswer: question.correctAnswer,
        options: Array.isArray(question.options) ? question.options : [],
        selectedAnswer: userAnswer?.selectedAnswer || null,
        isCorrect: userAnswer?.isCorrect || false,
        explanation: question.explanation,
        // Campos adicionais para o frontend
        correctIndex,
        selectedIndex,
        correctAnswerText,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        quiz: {
          id: quiz._id,
          title: quiz.title,
          document: quiz.documentId,
          score: quiz.score,
          totalQuestions: quiz.totalQuestions,
          completedAt: quiz.completedAt,
        },
        results: detailedResults,
      },
      message: 'Operation successful',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete Quizz
 * @route   DELETE /api/quizzes/:id
 * @access  Private
 */
export const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
        statusCode: 404,
      });
    }

    await quiz.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successful',
    });
  } catch (error) {
    next(error);
  }
};
