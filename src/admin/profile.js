import { Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import ProfileDataProvider from 'admin/data-providers/profile/profile-data-provider';
import { getFirebaseConfig } from 'libs/config';
import { CompanyUsersList, CompanyUsersEdit, CompanyUsersAdd } from 'admin/resources/company-users/company-users-resource';
import ProfileLayout from 'admin/components/ProfileLayout/ProfileLayout';
import { useUser } from 'libs/user';
import { createTheme } from '@material-ui/core/styles';
import { blueGrey } from "@material-ui/core/colors";

const firebaseConfig = getFirebaseConfig();

const dataProvider = ProfileDataProvider(firebaseConfig, {
  lazyLoading: {
   enabled: true,
 },
 renameMetaFields: {
    created_at: 'createdAt',
    created_by: 'createdBy',
    updated_at: 'updatedAt',
    updated_by: 'updatedBy'
  }
});

const theme = createTheme({
    palette: {
        primary: {
          main: '#1E453E',
          light: '#1E453E',
          dark: '#1E453E'
        },
        secondary: {
            main: blueGrey[700],
            light: blueGrey[500],
        },
        background: {
         default: '#FFFFFF',
         paper: '#fcf7f4'
        }
    }
})

const ProfileAdminApp = () => {
    const { user } = useUser()

    return <Admin layout={ProfileLayout} theme={theme} layout={ProfileLayout} dataProvider={dataProvider}>
        <Resource name={`users`} list={CompanyUsersList} edit={CompanyUsersEdit} create={CompanyUsersAdd} />
    </Admin>
}

export default ProfileAdminApp;
