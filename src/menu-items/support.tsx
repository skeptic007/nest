// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconKey, IconShieldLock, IconFile, IconClipboardList } from '@tabler/icons-react';
import { NavItemType } from 'types';

// constant
const icons = {
  IconFile,
  IconKey,
  IconShieldLock,
  IconClipboardList
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const support: NavItemType = {
  id: 'help-and-support',
  title: <FormattedMessage id="help-and-support" />,
  type: 'group',
  children: [
    {
      id: 'terms-of-usage',
      title: <FormattedMessage id="terms-of-usage" />,
      type: 'item',
      icon: icons.IconFile,
      url: '/pages/landing',
      target: true
    },
    {
      id: 'privacy-policy',
      title: <FormattedMessage id="privacy-policy" />,
      type: 'item',
      icon: icons.IconShieldLock,
      url: '/pages/privacy-policy',
      target: true
    },
    {
      id: 'guidelines',
      title: <FormattedMessage id="guidelines" />,
      type: 'item',
      icon: icons.IconClipboardList,
      url: '/pages/contact-us',
      target: true
    }
  ]
};

export default support;
