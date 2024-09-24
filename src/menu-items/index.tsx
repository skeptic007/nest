// menu import
// import dashboard from './dashboard';
// import application from './application';
// import forms from './forms';
// import elements from './elements';
// import samplePage from './sample-page';
// import pages from './pages';
// import utilities from './utilities';
// import other from './other';

import { NavItemType } from 'types';
import support from './support';
import homeitems from './homeitems';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [homeitems, support]
  // items: [homeitems, dashboard, application, forms, elements, samplePage, pages, utilities, support, other]
};

export default menuItems;
