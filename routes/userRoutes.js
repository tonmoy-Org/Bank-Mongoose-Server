const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    enableUser,
    disableUser,
    getAdminProfile,
    removeDevice,
    adminLogout,
    updateAdminProfile
} = require('../Controllers/userControllers');
const { verifyJWTToken, verifyTokenAndAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyJWTToken, getAllUsers);
router.post('/create', verifyJWTToken, verifyTokenAndAdmin, createUser); // Only admins can create users
router.put('/:id', verifyJWTToken, verifyTokenAndAdmin, updateUser); // Only admins can update users
router.patch('/enable/:id', verifyJWTToken, verifyTokenAndAdmin, enableUser); // Only admins can enable users
router.patch('/disable/:id', verifyJWTToken, verifyTokenAndAdmin, disableUser); // Only admins can disable users
router.delete('/:id', verifyJWTToken, verifyTokenAndAdmin, deleteUser); // Only admins can delete users
router.get('/profile', verifyJWTToken, getAdminProfile);
router.delete('/admin/remove-device/:email/:deviceId', verifyJWTToken, verifyTokenAndAdmin, removeDevice); // Only admins can remove devices
router.put('/admin/update-profile/:id', verifyJWTToken, verifyTokenAndAdmin, updateAdminProfile);
router.post('/admin/logout', verifyJWTToken, verifyTokenAndAdmin, adminLogout); // Only admins can log out admin

module.exports = router;
