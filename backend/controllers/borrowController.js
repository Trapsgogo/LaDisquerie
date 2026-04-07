const Borrow = require('../models/Borrow');

exports.borrowCD = async (req, res) => {
  try {
    const { cdId, borrowerName, expectedReturnDate } = req.body;

    const borrow = await Borrow.create({
      cdId,
      userId: req.userId,
      borrowerName,
      expectedReturnDate,
      status: 'Emprunté'
    });

    res.status(201).json(borrow);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'emprunt', error: error.message });
  }
};

exports.returnCD = async (req, res) => {
  try {
    const { borrowId } = req.params;

    const borrow = await Borrow.findOne({ _id: borrowId, userId: req.userId });
    if (!borrow) {
      return res.status(404).json({ message: 'Emprunt non trouvé' });
    }

    borrow.returnDate = new Date();
    borrow.status = 'Retourné';
    await borrow.save();

    res.status(200).json(borrow);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du retour du CD', error: error.message });
  }
};

exports.getBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find({ userId: req.userId }).populate('cdId');
    res.status(200).json(borrows);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des emprunts', error: error.message });
  }
};
