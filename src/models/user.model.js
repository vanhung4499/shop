const mongoose = require('mongoose');
const validator = require('validator');
const RoleEnum = require('../common/enums/role.enum');
const { toJSON, paginate } = require('./plugins');

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid');
        }
      },
    },
    password: {
      type: String,
      select: false,
      required: true,
      trim: true,
      minLength: 6,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            'Password must contain at least one letter and one number',
          );
        }
      },
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(RoleEnum),
      default: RoleEnum.CUSTOMER,
    },
    accountId: {
      type: String,
    },
    phone: { type: String },
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
      },
    ],
  },
  { timestamps: true },
);

// add plugin that converts mongoose to json
UserSchema.plugin(toJSON);
UserSchema.plugin(paginate);

// Check email existed
UserSchema.statics.existsByEmail = async function (email) {
  const user = await this.findOne({ email });
  return !!user;
};

// Check username existed
UserSchema.statics.existsByEmail = async function (username) {
  const user = await this.findOne({ username });
  return !!user;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
