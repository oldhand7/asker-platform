import * as Validator from 'validatorjs';

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
}

export default Validator;
