const Prompt = require('../models/Prompt');

exports.addPrompt = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Contenu du prompt requis' });
    }

    const prompt = await Prompt.create({
      content,
      timestamp: new Date()
    });

    res.status(201).json(prompt);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout du prompt', error: error.message });
  }
};

exports.getAllPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find().sort({ timestamp: -1 });
    res.status(200).json(prompts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des prompts', error: error.message });
  }
};
