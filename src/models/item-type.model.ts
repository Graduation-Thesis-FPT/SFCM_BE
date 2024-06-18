import { Base } from './base.model';

export interface ItemType extends Base {
  ITEM_TYPE_CODE: string;
  ITEM_TYPE_NAME: string;
}
export interface ItemTypeInfo {
  insert: ItemType[];
  update: ItemType[];
}
