export interface Package {
    ROWGUID?: string;
    HOUSE_BILL : string,
    LOT_NO : string,
    ITEM_TYPE_CODE : string,
    UNIT_CODE : string,
    CARGO_PIECE : number,
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