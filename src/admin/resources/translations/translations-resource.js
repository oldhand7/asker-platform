import {
    List,
    Datagrid,
    TextField,
    ReferenceField,
    EditButton,
    Edit,
    SimpleForm,
    ReferenceInput,
    SelectInput,
    TextInput,
    TabbedShowLayout,
    Tab,
    RichTextField,
    TranslatableInputs,
    TranslatableFields,
    Create,
    required,
    useLocale,
    ImageInput
} from 'react-admin';
import RichTextInput from 'ra-input-rich-text';
import { validate } from 'libs/validator';
import { makeStyles } from '@material-ui/core/styles';
import { dot2obj, localize } from 'libs/helper';
import TranslatableSlugField from 'admin/fields/translatable-slug/translatable-slug-field';
import { i18n } from 'libs/config';
import ImageField from 'admin/fields/image/image-field';

const useStyles = makeStyles({
    textInput: {
        width: '900px'
    }
  })

const validateForm = values => {
  const errors = validate(values, {
    title: localize('required'),
    name: localize('required')
  })

  return dot2obj(errors)
}

export const TranslationsList = props => {
    const locale = useLocale();

    return <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source={`text`} label="Text" />
        </Datagrid>
    </List>
};

export const TranslationsEdit = props => {
     const classes = useStyles();

    return <Edit {...props}>
        <SimpleForm validate={validateForm}>
          <TextInput fullWidth={true} source="text" label="Text" />
          <TranslatableInputs locales={i18n.locales}>
              <TextInput fullWidth={true} multiline={true} source="translation" label="Translation" />
          </TranslatableInputs>
        </SimpleForm>
    </Edit>
}

export const TranslationsAdd = props => {
     const classes = useStyles();

    return <Create {...props}>
        <SimpleForm redirect='list' validate={validateForm}>
            <TextInput fullWidth={true} source="text" label="Text" />
            <TranslatableInputs fullWidth={true}  locales={i18n.locales}>
                <TextInput fullWidth={true} multiline={true} source="translation" label="Translation" />
            </TranslatableInputs>
        </SimpleForm>
    </Create>
}
