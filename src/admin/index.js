import { Admin, Resource } from 'react-admin';
import { blueGrey, lightBlue } from "@material-ui/core/colors";
import { PagesList, PagesEdit, PagesAdd } from 'admin/resources/pages/pages-resource';
import { SectionsList, SectionsEdit, SectionsAdd } from 'admin/resources/sections/sections-resource';
import { EmployeesList, EmployeesEdit, EmployeesAdd } from 'admin/resources/employees/employees-resource';
import { SettingsList, SettingsEdit, SettingsAdd } from 'admin/resources/settings/settings-resource';
import { TranslationsList, TranslationsEdit, TranslationsAdd } from 'admin/resources/translations/translations-resource';
import { UsersList, UsersEdit, UsersAdd } from 'admin/resources/users/users-resource';
import { CompaniesList, CompaniesEdit, CompaniesAdd } from 'admin/resources/companies/companies-resource';
import { getFirebaseConfig } from 'libs/config';
import { Layout } from 'admin/components/AdminLayout/AdminLayout';
import SettingsSharpIcon from '@material-ui/icons/SettingsSharp';
import { CriteriaOptionsList, CriteriaOptionsEdit, CriteriaOptionsAdd } from 'admin/resources/criteria-options/criteria-options-resource';
import { PartnersList, PartnersEdit, PartnersAdd } from 'admin/resources/partners/partners-resource';

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
   },
   persistence: 'local'
});
const authProvider = CustomAuthProvider(firebaseConfig, {
   persistence: 'local'
});

const AdminApp = () => {
    return <Admin  layout={Layout} theme={theme} authProvider={authProvider} dataProvider={dataProvider}>
        <Resource name="users" options={{domain: "platform", label: 'Users'}} list={UsersList} edit={UsersEdit} create={UsersAdd} />
        <Resource name="criteriaOptions" options={{domain: "platform", label: 'Criterias'}} list={CriteriaOptionsList} edit={CriteriaOptionsEdit} create={CriteriaOptionsAdd} />
        <Resource name="pages" options={{domain: "landing", label: 'Pages'}} list={PagesList} edit={PagesEdit} create={PagesAdd} />
        <Resource name="sections" options={{domain: "landing", label: 'Sections'}} list={SectionsList} edit={SectionsEdit} create={SectionsAdd} />
        <Resource name="employees" options={{domain: "landing", label: 'Employees'}} list={EmployeesList} edit={EmployeesEdit} create={EmployeesAdd} />
        <Resource name="companies" options={{domain: "platform", label: 'Companies'}} list={CompaniesList} edit={CompaniesEdit} create={CompaniesAdd} />
        <Resource name="translations" options={{domain: "platform", label: 'Translations'}} list={TranslationsList} edit={TranslationsEdit} create={TranslationsAdd} />
        <Resource name="settings" options={{domain: 0, label: 'Settings', Icon: SettingsSharpIcon }} list={SettingsList} edit={SettingsEdit} create={SettingsAdd} />
        <Resource name="partners" options={{domain: "landing", label: 'Partners'}} list={PartnersList} edit={PartnersEdit} create={PartnersAdd} />
    </Admin>
}

export default AdminApp;
