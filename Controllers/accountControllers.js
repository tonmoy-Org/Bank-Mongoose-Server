const mongoose = require('mongoose');
const BankUser = require('../Models/accountSchema');

// Get all users
const getAllBankUsers = async (req, res) => {
    try {
        const users = await BankUser.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Create a new user
const createBankUser = async (req, res) => {
    const newUser = new BankUser(req.body);
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ message: 'Email already exists' });
        } else {
            res.status(500).json({ message: err.message });
        }
    }
};


// Update user
const updateBankUser = async (req, res) => {
    try {
        const updatedUser = await BankUser.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete user
const deleteBankUser = async (req, res) => {
    try {
        const deletedUser = await BankUser.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllBankUsers, createBankUser, updateBankUser, deleteBankUser };
