const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: [true, 'Please enter a username.'],
        unique: true,
        lowercase: false,
        minlength: [2, 'Minimum username length is 2 characters.'],
        maxlength: [16, 'Maximum username length is 16 characters.']

    },

    email: {
        type: String,
        required: [true, 'Please enter an email address.'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email address.']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password.'],
        minlength: [4, 'Minimum password length is 4 characters.'],

    }
});

// Fire a function after doc saved to db.
userSchema.post('save', function (doc, next) {
    console.log('New user was created and saved.', doc);
    next();
});

// Fire a function before doc saved to db.
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);


    next();
});

// Static method to login user.
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            console.log(user)
            return user;

        }
        throw Error('Incorrect password.');
    }
    throw Error('Incorrect email.');
};

const User = mongoose.model('user', userSchema);

module.exports = User;