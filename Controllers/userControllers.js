const admin = require('firebase-admin');
const mongoose = require('mongoose');

const serviceAccount = require('../serviceAccount.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const User = require('../Models/userSchema');

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createUser = async (req, res) => {
    const { email, password, displayName, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use." });
        }

        const firebaseUser = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: displayName,
        });

        const newUser = new User({
            email: email,
            displayName: displayName,
            password: password,
            firebaseUid: firebaseUser.uid,
            role: role
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, password, displayName } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const updateParams = {};
        if (email) updateParams.email = email;
        if (password) updateParams.password = password;
        if (displayName) updateParams.displayName = displayName;

        await admin.auth().updateUser(user.firebaseUid, updateParams);

        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await admin.auth().deleteUser(user.firebaseUid);

        await User.findByIdAndDelete(id);

        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Enable user account
const enableUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        await admin.auth().updateUser(user.firebaseUid, { disabled: false });

        // Update user status in the database
        user.disabled = false; // Assuming 'disabled' is the field to track the status
        await user.save();

        res.status(200).json({ message: "User account enabled." });
    } catch (error) {
        console.error('Error enabling user:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Disable user account
const disableUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        await admin.auth().updateUser(user.firebaseUid, { disabled: true });

        // Update user status in the database
        user.disabled = true; // Assuming 'disabled' is the field to track the status
        await user.save();

        res.status(200).json({ message: "User account disabled." });
    } catch (error) {
        console.error('Error disabling user:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


module.exports = { getAllUsers, createUser, updateUser, deleteUser, enableUser, disableUser };
