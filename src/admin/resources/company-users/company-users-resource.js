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
import { useUser } from 'libs/user';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import AlarmOffIcon from '@material-ui/icons/AlarmOff';
import ProfileUserToolbar from 'admin/components/ProfileUserToolbar/ProfileUserToolbar'
import ProfileUserBulkActions from 'admin/components/ProfileUserBulkActions/ProfileUserBulkActions';
import ProfileUserActions from 'admin/components/ProfileUserActions/ProfileUserActions';

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

export const CompanyUsersList = props => (
    <List actions={<ProfileUserActions />} {...props} sort={{ field: 'createdAt', order: 'desc' }} perPage={25} bulkActionButtons={<ProfileUserBulkActions />}>
        <Datagrid rowClick="edit">
            <TextField source="name" label="Name" />
            <TextField source="email" label="Email" />
            <TextField source="phone" label="Phone" />
            <SelectField source="type" title="Type" choices={[
               { id: 'admin', name: 'Admin' },
               { id: 'hr', name: 'HR' },
            ]} />
        </Datagrid>
    </List>
);

const languages = [
  { locale: 'en', title: 'English' }
]

export const CompanyUsersEdit = props => {
     const classes = useStyles();
     const { user } = useUser();

    return <Edit {...props}>
        <SimpleForm validate={validateForm} toolbar={<ProfileUserToolbar />}>
          <TextInput source="name" label="Name"  />
          <TextInput source="email" label="Email"  />
          <TextInput source="phone" label="Phone"  />
          <div style={{ display: 'none' }}>
            <TextInput source="companyId" defaultValue={user.companyId} />
            <TextInput source="type" defaultValue={'hr'} />
            <BooleanInput source="superadmin" defaultValue={false}  />
          </div>
          <PasswordInput source='password' label="Password" />
        </SimpleForm>
    </Edit>
}

export const CompanyUsersAdd = props => {
     const classes = useStyles();
     const { user } = useUser();

    return <Create {...props}>
        <SimpleForm redirect="list" validate={validateForm} toolbar={<ProfileUserToolbar showDelete={false} />}>
          <TextInput source="name" label="Name"  />
          <TextInput source="email" label="Email"  />
          <TextInput source="phone" label="Phone"  />
          <div style={{ display: 'none' }}>
            <TextInput source="companyId" defaultValue={user.companyId} />
            <TextInput source="type" defaultValue={'hr'} />
            <BooleanInput source="superadmin" defaultValue={false}  />
          </div>
          <PasswordInput source='password' label="Password" />
        </SimpleForm>
    </Create>
}
