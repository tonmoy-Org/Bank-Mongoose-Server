// routes/userRoutes.js
const express = require('express');
const { getAllUsers, createUser, updateUser, deleteUser, enableUser, disableUser } = require('../Controllers/userControllers');
const router = express.Router();
const {
    verifyJWT,
    verifyAdmin,
} = require("../middleware/verifyToken");

router.get('/', getAllUsers);
router.post('/create', createUser, verifyJWT);
router.put('/:id', updateUser, verifyJWT);
router.patch('/enable/:id', enableUser, verifyJWT);
router.patch('/disable/:id', disableUser, verifyJWT);
router.delete('/:id', deleteUser, verifyJWT);

module.exports = router;
