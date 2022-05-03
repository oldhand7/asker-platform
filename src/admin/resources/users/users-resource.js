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
    NumberInput,
    PasswordInput,
    SelectField,
    BooleanField,
    ChipField,
    BooleanInput
} from 'react-admin';
import RichTextInput from 'ra-input-rich-text';
import { dot2obj, localize } from 'libs/helper';
import { validate } from 'libs/validator';
import ImageField from 'admin/fields/image/image-field';

import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import AlarmOffIcon from '@material-ui/icons/AlarmOff';

import { makeStyles } from '@material-ui/core/styles';

const validateForm = values => {
  const rules = {
    name: 'required',
    email: 'required|email',
    type: 'in:admin,hr',
    phone: 'phone_e164',
    password: values.id ? 'min:6' : 'required|min:6',
  }

  const errors = validate(values, rules)

  if (errors) {
    return dot2obj(errors);
  }
}

const useStyles = makeStyles({
    textInput: {
        width: '900px'
    }
  })

const userFilters = [
    <TextInput label="Name" source="name" alwaysOn />,
    <TextInput label="Email" source="email" alwaysOn />,
    <ReferenceInput label="Company" source="companyId" reference="companies" alwaysOn>
      <SelectInput optionText="name" />
     </ReferenceInput>,
     <SelectInput source="type" choices={[
        { id: 'admin', name: 'Admin' },
        { id: 'hr', name: 'HR' },
     ]} alwaysOn />
];


export const UsersList = props => (
    <List {...props} filters={userFilters} sort={{ field: 'createdAt', order: 'desc' }} perPage={25}>
        <Datagrid rowClick="edit">
            <ImageField alwaysSingle={true} source="images" src="src" title="title" />

            <TextField source="name" label="Name" />
            <TextField source="email" label="Email" />
            <ReferenceField label="Company" source="companyId" reference="companies">
              <TextField source="name" />
            </ReferenceField>
            <SelectField source="type" title="Type" choices={[
               { id: 'admin', name: 'Admin' },
               { id: 'hr', name: 'HR' },
            ]} />
            <BooleanField source="verified" label="Verified" />
            <BooleanField source="superadmin" label="Superadmin" />
        </Datagrid>
    </List>
);

const languages = [
  { locale: 'en', title: 'English' }
]

export const UsersEdit = props => {
     const classes = useStyles();

    return <Edit {...props}>
        <SimpleForm validate={validateForm}>
          <ImageInput source="images" multiple={true}>
            <ImageField source="src" title="title" />
          </ImageInput>

          <TextInput source="name" label="Name"  />
          <TextInput source="email" label="Email"  />
          <TextInput source="phone" label="Phone"  />

          <ReferenceInput label="Company" source="companyId" reference="companies">
            <SelectInput optionText="name" />
           </ReferenceInput>

          <BooleanInput source="verified" label="Verified"  />
          <BooleanInput source="disabled" label="Disabled"  />
          <BooleanInput source="superadmin" label="Superadmin"  />

          <SelectInput source="type" choices={[
             { id: 'admin', name: 'Admin' },
             { id: 'hr', name: 'HR' },
          ]} />

          <PasswordInput source='password' label="Password" />
        </SimpleForm>
    </Edit>
}

export const UsersAdd = props => {
     const classes = useStyles();

    return <Create {...props}>
        <SimpleForm redirect="list" validate={validateForm}>
          <ImageInput source="images" label="Images" multiple={true}>
            <ImageField source="src" title="title" />
          </ImageInput>

          <TextInput source="name" label="Name"  />
          <TextInput source="email" label="Email"  />
          <TextInput source="phone" label="Phone"  />

          <ReferenceInput label="Company" source="companyId" reference="companies">
            <SelectInput optionText="name" />
           </ReferenceInput>

          <BooleanInput source="verified" label="Verified"  />

          <SelectInput defaultValue='admin' source="type" choices={[
             { id: 'admin', name: 'Admin' },
             { id: 'hr', name: 'HR' },
          ]} />

          <PasswordInput source='password' label="Password" />
        </SimpleForm>
    </Create>
}
