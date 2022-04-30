import { Admin, Resource, ListGuesser } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import { blueGrey, lightBlue } from "@material-ui/core/colors";
import { PagesList, PagesEdit, PagesAdd } from 'admin/resources/pages/pages-resource';
import { SectionsList, SectionsEdit, SectionsAdd } from 'admin/resources/sections/sections-resource';
import { EmployeesList, EmployeesEdit, EmployeesAdd } from 'admin/resources/employees/employees-resource';
import { SettingsList, SettingsEdit, SettingsAdd } from 'admin/resources/settings/settings-resource';
import { TranslationsList, TranslationsEdit, TranslationsAdd } from 'admin/resources/translations/translations-resource';
import { UsersList, UsersEdit, UsersAdd } from 'admin/resources/users/users-resource';
import { CompaniesList, CompaniesEdit, CompaniesAdd } from 'admin/resources/companies/companies-resource';
import { getFirebaseConfig } from 'libs/config';

import CustomAuthProvider from 'admin/auth-providers/custom/custom-auth-provider';
import CustomDataProvider from 'admin/data-providers/custom/custom-data-provider';

import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: lightBlue[500],
            light: lightBlue[300],
            dark: lightBlue[700],
        },
        secondary: {
            main: blueGrey[700],
            light: blueGrey[500],
        },
    }
})

const firebaseConfig = getFirebaseConfig();

const dataProvider = CustomDataProvider(firebaseConfig, {
  renameMetaFields: {
     created_at: 'createdAt',
     created_by: 'createdBy',
     updated_at: 'updatedAt',
     updated_by: 'updatedBy'
   }
});
const authProvider = CustomAuthProvider(firebaseConfig);

const AdminApp = () => {
    return <Admin theme={theme} authProvider={authProvider} dataProvider={dataProvider}>
        <Resource name="pages" list={PagesList} edit={PagesEdit} create={PagesAdd} />
        <Resource name="sections" list={SectionsList} edit={SectionsEdit} create={SectionsAdd} />
        <Resource name="employees" list={EmployeesList} edit={EmployeesEdit} create={EmployeesAdd} />
        <Resource name="companies" list={CompaniesList} edit={CompaniesEdit} create={CompaniesAdd} />
        <Resource name="users" list={UsersList} edit={UsersEdit} create={UsersAdd} />
        <Resource name="translations" list={TranslationsList} edit={TranslationsEdit} create={TranslationsAdd} />
        <Resource name="settings" list={SettingsList} edit={SettingsEdit} create={SettingsAdd} />
    </Admin>
}

export default AdminApp;
