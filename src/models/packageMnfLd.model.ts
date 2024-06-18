export interface Package {
    ROWGUID?: string;
    BILLOFLADING : string,
    HOUSE_BILL : string,
    LOT_NO : string,
    ITEM_TYPE_CODE : string,
    UNIT_CODE : string,
    CARGO_PIECE : string,
    CBM : number,
    DECLARE_NO : string,
    REF_CONTAINER : string,
    NOTE : string,
    CREATE_BY?: string;
    CREATE_DATE?: Date;
    UPDATE_BY?: string;
    UPDATE_DATE?: Date;
}

export interface PackageInfo {
    insert : Package[],
    update : Package[],
}