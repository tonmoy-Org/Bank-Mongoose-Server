const express = require('express');
const { getAllBankUsers, createBankUser, updateBankUser, deleteBankUser } = require('../Controllers/accountControllers');
const router = express.Router();



router.get('/', getAllBankUsers);
router.post('/create/account-registration', createBankUser);
router.put('/bank-users/:id', updateBankUser);
router.delete('/delete-bank-users/:id', deleteBankUser);

module.exports = router;