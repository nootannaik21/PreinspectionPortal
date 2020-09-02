import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
  accessrole?: string
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'users',
    title: 'Users',
    type: 'item',
    url: '/users',
    classes: 'nav-item',
    icon: 'feather icon-users',
    accessrole:'Admin'
  },
  {
    id: 'inspection',
    title: 'Inspection',
    type: 'item',
    url: '/inspection',
    classes: 'nav-item',
    icon: 'feather icon-eye',
    accessrole:'Admin|ABS|IMD|Branch|Claims'
  },
  {
    id: 'enquiry',
    title: 'Enquiry',
    type: 'item',
    url: '/enquiry',
    classes: 'nav-item',
    icon: 'feather icon-repeat',
    accessrole:'Admin|ABS|Branch|IMD|Claims'
  },
  {
    id: 'vendor',
    title: 'Vendor',
    type: 'item',
    url: '/vendor',
    classes: 'nav-item',
    icon: 'feather icon-sidebar',
    accessrole:'Admin|Vendor'
  },
  {
    id: 'branch',
    title: 'Branch',
    type: 'item',
    url: '/branch',
    classes: 'nav-item',
    icon: 'feather icon-menu',
    accessrole:'Admin'
  },
  {
    id: 'report',
    title: 'Report',
    type: 'item',
    url: '/report',
    classes: 'nav-item',
    icon: 'feather icon-book',
    accessrole:'Admin|Claims|Vendor|Claims\Branch'
  }
];

@Injectable()
export class NavigationItem {
  public get() {
    return NavigationItems;
  }
}
