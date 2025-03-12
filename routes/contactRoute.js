const express = require("express");
const router = express.Router();
const { getContact, createContact, getContactById, updateContactById, deleteContactById } = require("../controllers/contactController");
const { validateToken } = require("../middleware/validateTokenHandler");

router.use(validateToken);
// router.route('/').get(getContact).post(createContact);
router.get('/', getContact);
router.post('/', createContact);
// router.route('/');

router.route('/:id').get(getContactById).put(updateContactById).delete(deleteContactById);

// router.route('/:id');

// router.route('/:id');

module.exports = router;