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
    Create,
    UrlInput,
    EmailField,
    EmailInput,
    ImageInput,
    NumberInput
} from 'react-admin';
import RichTextInput from 'ra-input-rich-text';

import ImageField from 'admin/fields/image/image-field';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    textInput: {
        width: '900px'
    }
  })

export const EmployeesList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <ImageField alwaysSingle={true} source="images" src="src" title="title" />
            <TextField source="name.en" label="Name" />
            <TextField source="position.en" label="Position" />
        </Datagrid>
    </List>
);

const languages = [
  { locale: 'en', title: 'English' }
]

export const EmployeesEdit = props => {
     const classes = useStyles();

    return <Edit {...props}>
        <SimpleForm>
          <ImageInput source="images" multiple={true}>
            <ImageField source="src" title="title" />
          </ImageInput>
          <TranslatableInputs locales={['en']}>
            <TextInput source="name" label="Name" validation={{ required: true }}  />
            <TextInput source="position" label="Position" validation={{ required: true }}  />
          </TranslatableInputs>
          <TextInput source="email" alidation={{ required: true }} />
          <TextInput source="links.linkedin" label="Linkedin URL" />
          <TextInput source="links.homepage" label="Homepage URL" />
          <NumberInput initialValue="10" source="sort" min="0" />
        </SimpleForm>
    </Edit>
}

export const EmployeesAdd = props => {
     const classes = useStyles();

    return <Create {...props}>
        <SimpleForm redirect="list">
            <ImageInput source="images" multiple={true}>
              <ImageField source="src" title="title" />
            </ImageInput>
            <TranslatableInputs locales={['en']}>
                <TextInput source="name" label="Name" validation={{ required: true }} />
                <TextInput source="position" label="Position" balidation={{ required: true }} />
            </TranslatableInputs>
            <TextInput source="email" alidation={{ required: true }} />
            <TextInput source="links.linkedin" label="Linkedin URL" />
            <TextInput source="links.homepage" label="Homepage URL" />
            <NumberInput initialValue="10" source="sort" min="0" />
        </SimpleForm>
    </Create>
}
