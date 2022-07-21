import {
    List,
    Datagrid,
    TextField,
    Edit,
    SimpleForm,
    TextInput,
    Create,
    PasswordInput,
    SelectField,
    BooleanInput,
    useTranslate
} from 'react-admin';
import { dot2obj } from 'libs/helper';
import { validate } from 'libs/validator';
import { useUser } from 'libs/user';
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

export const CompanyUsersList = props => {
    const translate = useTranslate();

    return <List actions={<ProfileUserActions />} {...props} sort={{ field: 'createdAt', order: 'desc' }} perPage={25} bulkActionButtons={<ProfileUserBulkActions />}>
        <Datagrid rowClick="edit">
            <TextField source="name" label={translate("Name")} />
            <TextField source="email" label={translate("Email")} />
            <TextField source="phone" label={translate("Phone")} />
            <SelectField source="type" label={translate("Type")} choices={[
               { id: 'admin', name: 'Admin' },
               { id: 'hr', name: 'HR' },
            ]} sortable={false} />
        </Datagrid>
    </List>
};

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
