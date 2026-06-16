import { Quiz } from '../models/quiz.model.js';

// Submit or update your quiz
export const submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndUpdate(
      { user: req.user.userId },
      { ...req.body, user: req.user.userId },
      { upsert: true, new: true }
    );
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get compatible roommates — the algorithm
export const getMatches = async (req, res) => {
  try {
    // Get current user's quiz
    const myQuiz = await Quiz.findOne({ user: req.user.userId });
    if (!myQuiz) {
      return res.status(404).json({ message: 'Please complete your quiz first' });
    }

    // Get all other users' quizzes
    const allQuizzes = await Quiz.find({ user: { $ne: req.user.userId } })
      .populate('user', 'name email avatar college');

    // Score each person against current user
    const scored = allQuizzes.map(other => {
      let score = 0;

      if (other.sleepSchedule === myQuiz.sleepSchedule) score += 25;
      else if (other.sleepSchedule === 'flexible' || myQuiz.sleepSchedule === 'flexible') score += 10;

      if (other.cleanliness === myQuiz.cleanliness) score += 20;

      if (other.noiseLevel === myQuiz.noiseLevel) score += 20;

      if (other.smoking === myQuiz.smoking) score += 15;

      if (other.pets === myQuiz.pets) score += 10;

      if (other.studyHabits === myQuiz.studyHabits) score += 10;

      // Budget compatibility — within 2000 rupees range
      const budgetDiff = Math.abs(other.budget - myQuiz.budget);
      if (budgetDiff <= 2000) score += 10;
      else if (budgetDiff <= 5000) score += 5;

      return {
        user: other.user,
        score,
        compatibility: `${score}%`
      };
    });

    // Sort by highest score, return top 10
    const matches = scored
      .filter(m => m.score >= 40) // minimum 40% compatible
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};