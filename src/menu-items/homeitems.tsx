// third-party
import { FormattedMessage } from 'react-intl';
import { IconCalendarEvent, IconHeart, IconHome } from '@tabler/icons-react';
import { NavItemType } from 'types';

const icons = {
  IconHome: IconHome,
  IconCalendarEvent: IconCalendarEvent,
  IconHeart: IconHeart
};

const homeitems: NavItemType = {
  id: 'home',
  icon: icons.IconHome,
  type: 'group',
  children: [
    {
      id: 'home',
      title: <FormattedMessage id="home" />,
      type: 'item',
      icon: icons.IconHome,
      url: '/home'
    },
    {
      id: 'events',
      title: <FormattedMessage id="events" />,
      icon: icons.IconCalendarEvent,
      url: '/events',
      type: 'item'
    },
    {
      id: 'favourites',
      title: <FormattedMessage id="favourites" />,
      icon: icons.IconHeart,
      url: '/favourites',
      type: 'item'
    }
  ]
};

export default homeitems;
