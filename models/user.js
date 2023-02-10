const mongoose = require('mongoose');
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required!"]
    },
    password: {
        type: String,
        required: [true, "Password cannot be blank!!"]
    }
})

//Added User Validation on User Model:
userSchema.statics.findAndValidate = async function (username, password) {
    const foundUser = await this.findOne({ username }); // we await this cuz it takes time to find a particular user. //then we need to validate and compare using bcrypt
    const isValid = await bcrypt.compare(password, foundUser.password);
    return isValid ? foundUser : false; // ternary operator.  "if isValid = true then return foundUser Object OTHERWISE return false"
}

module.exports = mongoose.model("User", userSchema);

//we have access to .statics => where we can define multiple methods that will be added to user model.
//this refers to the particular model (User Schema)