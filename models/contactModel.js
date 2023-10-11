const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    name:{
        type: String,
        required: [true, "Please enter a name"],
    },
    email:{
        type: String,
        required: [true, "Please enter an email address"],
    },
    college:{
        type: String,
        required: [true, "Please enter college name"],
    }
},{
    timestamps: true,
});

module.exports = mongoose.model("Contact", contactSchema)