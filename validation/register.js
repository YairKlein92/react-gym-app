/* eslint-disable @typescript-eslint/naming-convention */
const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  const errors = {};

  if (!Validator.isLength(data.name, { min: 4, max: 15 })) {
    errors.name = 'Name must be between 4 and 15 characters';
  }
  return {
    errors,
    isValid: isEmpty(errors), // empty, there is no error
  };
};
