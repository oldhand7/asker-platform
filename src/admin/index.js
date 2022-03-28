import { Admin, Resource, ListGuesser } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import { blueGrey, lightBlue } from "@material-ui/core/colors";
import { PagesList, PagesEdit, PagesAdd } from 'admin/resources/pages/pages-resource';
import { SectionsList, SectionsEdit, SectionsAdd } from 'admin/resources/sections/sections-resource';
import { EmployeesList, EmployeesEdit, EmployeesAdd } from 'admin/resources/employees/employees-resource';
import { SettingsList, SettingsEdit, SettingsAdd } from 'admin/resources/settings/settings-resource';
import { TranslationsList, TranslationsEdit, TranslationsAdd } from 'admin/resources/translations/translations-resource';

import {
  FirebaseDataProvider
} from 'react-admin-firebase';

import CustomAuthProvider from 'admin/auth-providers/custom/custom-auth-provider';

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

const config = {
  apiKey: "AIzaSyBxG11gKwZ0W4UxZlAtHU8UuLzV-oVnrcw",
  authDomain: "asker-3e929.firebaseapp.com",
  projectId: "asker-3e929",
  storageBucket: "asker-3e929.appspot.com",
  messagingSenderId: "546816163571",
  appId: "1:546816163571:web:db81863338c2ab526d4186"
}

const options = {}

const dataProvider = FirebaseDataProvider(config, options);
const authProvider = CustomAuthProvider(config, options);

const AdminApp = () => {
    return <Admin theme={theme} authProvider={authProvider} dataProvider={dataProvider}>
        <Resource name="pages" list={PagesList} edit={PagesEdit} create={PagesAdd} />
        <Resource name="sections" list={SectionsList} edit={SectionsEdit} create={SectionsAdd} />
        <Resource name="employees" list={EmployeesList} edit={EmployeesEdit} create={EmployeesAdd} />
        <Resource name="translations" list={TranslationsList} edit={TranslationsEdit} create={TranslationsAdd} />
        <Resource name="settings" list={SettingsList} edit={SettingsEdit} create={SettingsAdd} />
    </Admin>
}

export default AdminApp;
