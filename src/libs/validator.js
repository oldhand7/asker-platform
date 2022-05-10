import Validator from 'validatorjs';

Validator.register('phone_e164', function(value, requirement, attribute) { // requirement parameter defaults to null
  return value.match(/^\+[1-9]\d{10,14}$/);
}, 'The phone number is not valid E164 standard.');

const parse = (errors) => {
  const keys = Object.keys(errors);

  if (!keys.length) {
    return null;
  }

  for (let i = 0; i < keys.length; i++) {
    errors[keys[i]] = errors[keys[i]][0]
  }

  return errors
}

export const validate = (form = {}, rules = {}, messages = {}) => {
  const validation = new Validator(form, rules, messages);

  validation.passes();

  return parse(validation.errors.all());

  return false;
}

export default Validator;
