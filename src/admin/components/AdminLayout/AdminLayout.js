import { Layout as RALayout } from 'react-admin';
import { Menu } from 'admin/components/AdminCustomMenu/AdminCustomMenu';

export const Layout = (props) => <RALayout {...props} menu={Menu} />;
