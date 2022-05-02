import React, { Fragment } from 'react';

import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';

import styles from './SubMenu.module.scss';

const SubMenu = ({
    handleToggle,
    sidebarIsOpen,
    isOpen = false,
    name,
    icon,
    children,
}) => {
    return <Fragment>
        <ListItem
            button
            onClick={handleToggle}
            className={styles['listItem']}
        >
            <ListItemIcon className={styles['icon']}>
              {isOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemIcon>
            <ListItemText
                primary={isOpen ? name : ''}
                secondary={isOpen ? '' : name}
                classes={{
                  root: styles['listItemText'],
                  primary: styles['listItemText-primary'],
                  secondary: styles['listItemText-secondary']
                }}
            />
        </ListItem>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List
                dense
                component="div"
                disablePadding
                className={
                    sidebarIsOpen
                        ? styles['sidebarIsOpen']
                        : styles['sidebarIsClosed']
                }
            >
                {children}
            </List>
            <Divider />
        </Collapse>
    </Fragment>
};

export default SubMenu;
