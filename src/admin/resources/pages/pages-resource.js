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
    BooleanField,
    BooleanInput,
    NumberInput,
    NumberField
} from 'react-admin';
import RichTextInput from 'ra-input-rich-text';
import { validate } from 'libs/validator';
import { makeStyles } from '@material-ui/core/styles';
import { dot2obj, localize } from 'libs/helper';
import TranslatableSlugField from 'admin/fields/translatable-slug/translatable-slug-field';
import { i18n } from 'libs/config';

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

export const PagesList = props => {
    const locale = useLocale();

    return <List {...props} perPage={25}>
        <Datagrid rowClick="edit">
            <TextField source={`name.${locale}`} label="Name" />
            <TextField source={`title.${locale}`} label="Title" />
            <TextField source={`template`} label="Template" />
            <BooleanField source="menu.header" label="Menu" />
            <NumberField source="sort" />
        </Datagrid>
    </List>
};

export const PagesEdit = props => {
     const classes = useStyles();

    return <Edit {...props}>
        <SimpleForm validate={validateForm}>
            <TranslatableInputs locales={i18n.locales}>
                <TextInput source="title" label="Title" />
                <TranslatableSlugField follow="title" source="name" label="Name" />
                <RichTextInput multiline={true} source="content" />
            </TranslatableInputs>
            <BooleanInput source="menu.header" label="Heder menu" />
            <TextInput source="template" label="Template" />
            <NumberInput initialValue="10" source="sort" min="0" />
        </SimpleForm>
    </Edit>
}

export const PagesAdd = props => {
     const classes = useStyles();

    return <Create {...props}>
        <SimpleForm redirect='list' validate={validateForm}>
            <TranslatableInputs locales={i18n.locales}>
                <TextInput source="title" label="Title" />
                <TranslatableSlugField follow="title" source="name" label="Name" />
                <RichTextInput multiline={true} source="content" />
            </TranslatableInputs>
            <BooleanInput source="menu.header" label="Heder menu" />
            <TextInput source="template" label="Template" />
            <NumberInput initialValue="10" source="sort" min="0" />
        </SimpleForm>
    </Create>
}
