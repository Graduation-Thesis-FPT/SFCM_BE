export interface ItemType {
    ITEM_TYPE_CODE: string;
    ITEM_TYPE_NAME: string;
    CREATE_BY?: string;
    CREATE_DATE?: Date;
    UPDATE_BY?: string;
    UPDATE_DATE?: Date;
  }
  export interface ItemTypeInfo {
    insert: ItemType[];
    update: ItemType[];
  }
  