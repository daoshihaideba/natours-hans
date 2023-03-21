const mogoose = require('mongoose');
const crypto = require('crypto');
//name,email,photo,password,passwordConfirm
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mogoose.Schema({
  name: {
    type: String,
    reuqired: [true, 'Please tell us your name']
  },

  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: { type: String, default: 'default.jpg' },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'please provide password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    reuqired: [true, 'Please confirm your password'],
    validate: {
      //This only works on created and SAVE!!
      validator: function(el) {
        return el === this.password; //
      },
      message: 'password are not the same'
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpire: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

userSchema.pre('save', async function(next) {
  //Only run this function if password is avtually modified

  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  //Delete pass word Confirm
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.pre(/^find/, function(next) {
  //This points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  console.log(candidatePassword, userPassword);

  return bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changePasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(JWTTimestamp, changedTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mogoose.model('User', userSchema);
module.exports = User;
