import TextField from '@material-ui/core/TextField';
import { useField } from 'react-final-form';
import slugify from 'slugify';
import { useInput, useTranslatableContext } from 'react-admin';
import { useEffect } from 'react';
import { useFormState, useForm } from 'react-final-form';
import { makeStyles } from '@material-ui/core/styles';
import { defaultTheme } from 'react-admin';


const useStyles = makeStyles({
    root: {
        fontWeight: 'bold',
        // This is JSS syntax to target a deeper element using css selector, here the svg icon for this button
        '& svg': { color: 'orange' }
    },
});

const TranslatableSlugField = (props) => {
  const { follow } = props;
  const { values } = useFormState();
  const form = useForm();
  const { selectedLocale } = useTranslatableContext();


  const {
      input: { name, onChange, value, ...rest },
      meta: { touched, error }
  } = useInput(props);


    const targetInput = useInput(props);


  useEffect(() => {
    if (values.id) {
      return;
    }

    if (name.indexOf(selectedLocale) !== name.length - selectedLocale.length) {
      return;
    }

    if (values[follow] && values[follow][selectedLocale]) {
      form.change(`${name}`, slugify(values[follow][selectedLocale]).toLowerCase())
    }
  }, [follow, values[follow], name, selectedLocale])

    return (
        <TextField
            name={name}
            value={value}
            label={props.label}
            className={props.className}
            variant="filled"
            margin="dense"
            onChange={onChange}
            error={!!(touched && error)}
            helperText={touched && error}
            {...rest}
        />
    );
};

export default TranslatableSlugField;
