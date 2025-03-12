const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

// @desc Get all contacts
// @route Get /api/contacts
// @access public
// we need to wrap the async function inside asyncHandler and now we dont have to write try-catch block in all functions
// So now when ever an exception occurs it is going to pass to error handler.
const getContact = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id });
    res.status(200).json(contacts);
});

// @desc Create contacts
// @route Get /api/contacts
// @access public
// When any fied is not sent then we will get the error in HTML formal, but we need to get in JSON format for that
// we need to create a custom middleware.
const createContact = asyncHandler(async (req, res) => {
    console.log("Body: ", req.body);
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are mandatory !");
    }
    const contact = await Contact.create({
        user_id: req.user.id,
        name,
        email,
        phone
    })
    res.status(201).json(contact);
});

// @desc Get contact by id
// @route Get /api/contacts/:id
// @access public
const getContactById = asyncHandler(async (req, res) => {
    console.log("Id: ", req.params.id);
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).json(contact);
});

// @desc update contact by id
// @route Get /api/contacts/:id
// @access public
const updateContactById = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    // If other user doesn't have permission to update the contacts
    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User does not have permission to update othet user contacts");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )
    res.status(200).json(updatedContact);
});

// @desc delete contact by id
// @route Get /api/contacts/:id
// @access public
const deleteContactById = asyncHandler(async (req, res) => {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found to delete!");
    }
    // If other user doesn't have permission to delete the contacts
    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User does not have permission to delete othet user contacts");
    }
    // await Contact.findByIdAndDelete()
    res.status(200).json(contact);
});

module.exports = { getContact, createContact, getContactById, updateContactById, deleteContactById };