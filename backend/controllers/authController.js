const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password, passwordConfirm } = req.body;

    if (!username || !email || !password || !passwordConfirm) {
      return res.status(400).render('register', {
        message: 'Veuillez fournir tous les détails requis'
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).render('register', {
        message: 'Les mots de passe ne correspondent pas'
      });
    }

    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).render('register', {
        message: 'Cet e-mail est déjà enregistré'
      });
    }

    const newUser = await User.create({
      username,
      email,
      password
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      user: newUser,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email et mot de passe requis'
      });
    }

    const user = await User.findOne({ email: email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        message: 'Email ou mot de passe incorrect'
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(200).json({
      user,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
  }
};
