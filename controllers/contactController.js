// whenever we create api methods we need to give them labels
// labels can be given as
// @desc for get all contacts
// @route GET /api/contacts
// @access public

const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

const getContacts = asyncHandler(async (req, res) => {
  const conatcts = await Contact.find({user_id: req.user.id});
  res.status(200).json(conatcts);
});

const createContact = asyncHandler(async (req, res) => {
  console.log("The request body is ", req.body);
  const { name, email, college } = req.body;
  if (!name || !email || !college) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const contact = await Contact.create({
    user_id: req.user.id,
    name,
    email,
    college,
  });

  res.status(201).json(contact);
});

const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact Not Found");
  }
  res.status(200).json(contact);
});

const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact Not Found");
  }

  if(contact.user_id.toString() != req.user.id) {
    res.status(403)
    throw new Error("User Dont have permission to update contact of other user");
  }
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedContact);
});

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact Not Found");
  }
  if(contact.user_id.toString() != req.user.id) {
    res.status(403)
    throw new Error("User Dont have permission to update contact of other user");
  }
  await Contact.findByIdAndDelete(contact);
  res.status(200).json(contact);
});

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};