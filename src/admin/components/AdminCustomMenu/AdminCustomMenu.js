// in src/Menu.js
import * as React from 'react';
import { DashboardMenuItem, Menu as RAMenu, MenuItemLink,
getResources } from 'react-admin';
import BookIcon from '@material-ui/icons/Book';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import PeopleIcon from '@material-ui/icons/People';
import LabelIcon from '@material-ui/icons/Label';
import SubMenu from './SubMenu';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import MenuIcon from '@material-ui/icons/Menu';
import LabelImportant from '@material-ui/icons/LabelImportant';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ArrowRightSharpIcon from '@material-ui/icons/ArrowRightSharp';
import ShortTextSharpIcon from '@material-ui/icons/ShortTextSharp';

import styles from './AdminCustomMenu.module.scss'

export const Menu = (props) => {
    const [state, setState] = useState({
      landing: false,
      platform: true
    })
     const resources = useSelector(getResources);

    const handleToggle = (target) => {
      setState({
        ...state,
        [target]: !state[target]
      })
    }

    return <RAMenu {...props} className={styles['menu']}>
        {props.children}
        <DashboardMenuItem />
        <SubMenu
                    handleToggle={() => handleToggle('platform')}
                    isOpen={state.platform}
                    sidebarIsOpen={props.open}
                    name="Platform"
                >
          {resources.filter(res => res.options && res.options.domain == 'platform').map(res => (
            <MenuItemLink
            key={res.name}
              to={`/${res.name}`}
              primaryText={(res.options && res.options.label) || res.name}
              leftIcon={<ShortTextSharpIcon />}/>
          ))}
        </SubMenu>
        <SubMenu
                    handleToggle={() => handleToggle('landing')}
                    isOpen={state.landing}
                    sidebarIsOpen={props.open}
                    name="Landing page"
                >
                {resources.filter(res => res.options && res.options.domain == 'landing').map(res => (
                  <MenuItemLink
                    key={res.name}
                    to={`/${res.name}`}
                    primaryText={(res.options && res.options.label) || res.name}
                    leftIcon={<ShortTextSharpIcon />}/>
                ))}
        </SubMenu>

        {resources.filter(res => !res.options || !res.options.domain).map(res => (
          <MenuItemLink
            key={res.name}
            to={`/${res.name}`}
            primaryText={(res.options && res.options.label) || res.name}
            leftIcon={
              res.options && res.options.Icon ?
              <res.options.Icon /> :
              <ShortTextSharpIcon />}/>
        ))}
    </RAMenu>
};
