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
    FileInput,
    FileField,
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

export const SectionsList = props => {
    const locale = useLocale();

    return <List {...props} perPage={25}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source={`name.${locale}`} label="Name" />
            <TextField source={`title.${locale}`} label="Title" />
        </Datagrid>
    </List>
};

export const SectionsEdit = props => {
     const classes = useStyles();

    return <Edit {...props}>
        <SimpleForm validate={validateForm}>
            <TranslatableInputs locales={i18n.locales}>
                <TextInput fullWidth={true} source="title" label="Title" />
                <TranslatableSlugField follow="title" source="name" label="Name" />
                <RichTextInput  multiline={true} source="content" />
                <TextInput source="cta.text" label="CTA (Text)" />
            </TranslatableInputs>

            <TextInput fullWidth={true} source="cta.link" label="CTA (Url)" />

            <ImageInput source="images" multiple={true}>
              <ImageField source="src" title="title" />
            </ImageInput>

            <FileInput source="files" label="Related files" multiple={true}>
              <FileField source="src" title="title" />
            </FileInput>
        </SimpleForm>
    </Edit>
}

export const SectionsAdd = props => {
     const classes = useStyles();

    return <Create {...props}>
        <SimpleForm redirect='list' validate={validateForm}>
            <TranslatableInputs locales={i18n.locales}>
                <TextInput fullWidth={true} source="title" label="Title" />
                <TranslatableSlugField follow="title" source="name" label="Name" />
                <RichTextInput  multiline={true} source="content" />
                <TextInput source="cta.text" label="CTA (Text)" />
            </TranslatableInputs>

            <TextInput fullWidth={true} source="cta.link" label="CTA (Url)" />

            <ImageInput source="images" multiple={true}>
              <ImageField source="src" title="title" />
            </ImageInput>

            <FileInput source="files" label="Related files" multiple={true}>
              <FileField source="src" title="title" />
            </FileInput>
        </SimpleForm>
    </Create>
}
