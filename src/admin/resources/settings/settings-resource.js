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
    ImageInput,
    required,
    useLocale
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
    id: 'required'
  })

  return dot2obj(errors)
}

export const SettingsList = props => {
    const locale = useLocale();

    return <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" label="Name"  />
            <ImageField alwaysSingle={true} source="images" src="src" title="title" />
            <TextField source="value" label="Value" />
        </Datagrid>
    </List>
};

export const SettingsEdit = props => {
     const classes = useStyles();

    return <Edit {...props}>
        <SimpleForm validate={validateForm}>
            <TextField source="id" label="Name" />
            <TextInput source="value" label="Value" />
            <ImageInput source="images" multiple={true}>
              <ImageField source="src" title="title" />
            </ImageInput>
        </SimpleForm>
    </Edit>
}

export const SettingsAdd = props => {
     const classes = useStyles();

    return <Create {...props}>
        <SimpleForm redirect='list' validate={validateForm}>
          <TextInput source="id" label="Name" />
          <TextInput source="value" label="Value" fullWidth={true} />
          <ImageInput source="images" multiple={true}>
            <ImageField source="src" title="title" />
          </ImageInput>
        </SimpleForm>
    </Create>
}
