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
    name: 'required'
  })

  return dot2obj(errors)
}

const partnerFilters = [
    <TextInput label="Name" source="name" alwaysOn />
];

export const PartnersList = props => {
    const locale = useLocale();

    return <List filters={partnerFilters} sort={{ field: 'createdAt', order: 'desc' }} {...props} perPage={25}>
        <Datagrid rowClick="edit">
            <TextField source="name" label="Name"  />
            <ImageField alwaysSingle={true} source="images" src="src" title="title" />
        </Datagrid>
    </List>
};

export const PartnersEdit = props => {
     const classes = useStyles();

    return <Edit {...props}>
        <SimpleForm validate={validateForm}>
            <TextInput source="name" label="Name" />
            <ImageInput source="images" multiple={true}>
              <ImageField source="src" title="title" />
            </ImageInput>
            <TextInput source="url" label="URL" />
        </SimpleForm>
    </Edit>
}

export const PartnersAdd = props => {
     const classes = useStyles();

    return <Create {...props}>
        <SimpleForm redirect='list' validate={validateForm}>
          <TextInput source="name" label="Name" />
          <ImageInput source="images" label="Logo" multiple={true}>
            <ImageField source="src" title="title" />
          </ImageInput>
          <TextInput source="url" label="URL" />
        </SimpleForm>
    </Create>
}
