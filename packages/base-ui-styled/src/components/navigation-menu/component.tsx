import { CommonNavigationMenu } from './common.js';
import { main } from './variants/main.js';
import { nestedInlineSubmenus } from './variants/nested-inline-submenus.js';
import { nestedSubmenus } from './variants/nested-submenus.js';

export const variants = {
  main,
  nestedSubmenus,
  nestedInlineSubmenus,
};

export const NavigationMenu = {
  ...CommonNavigationMenu,
  variants,
};

export {
  navigationMenuArrowStyles,
  CommonNavigationMenu,
  navigationMenuLinkCardStyles,
  navigationMenuPopupStyles,
  navigationMenuTriggerStyles,
} from './common.js';
