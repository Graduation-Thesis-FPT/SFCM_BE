export const ERROR_MESSAGE = {
  INVALID_REQUEST_MISSING_TOKEN: 'INVALID_REQUEST_MISSING_TOKEN',
  INVALID_REQUEST: 'INVALID_REQUEST',
  MISSING_MENU_CODE: 'MISSING_MENU_CODE',
  YOU_DO_NOT_HAVE_PERMISSION_TO_ACCESS_THIS_PAGE: 'YOU_DO_NOT_HAVE_PERMISSION_TO_ACCESS_THIS_PAGE',
  YOU_DO_NOT_HAVE_THIS_PERMISSION: 'YOU_DO_NOT_HAVE_THIS_PERMISSION',
  INVALID_USER_ID: 'INVALID_USER_ID',
  INVALID_ID: 'INVALID_ID',
  USER_NAME_NOT_EXIST: 'USER_NAME_NOT_EXIST',
  USER_IS_NOT_ACTIVE: 'USER_IS_NOT_ACTIVE',
  PASSWORD_IS_INCORRECT: 'PASSWORD_IS_INCORRECT',
  PASSWORD_IS_ALREADY: 'PASSWORD_IS_ALREADY',
  PASSWORD_IS_DEFAULT: 'PASSWORD_IS_DEFAULT',
  UPDATE_PASSWORD_FAILED: 'UPDATE_PASSWORD_FAILED',
  USER_ALREADY_EXIST: 'USER_ALREADY_EXIST',
  USER_NOT_EXIST: 'USER_NOT_EXIST',
  USER_NAME_IS_DUPLICATED: 'USER_NAME_IS_DUPLICATED',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  INVALID_TOKEN_PLEASE_LOGIN_AGAIN: 'INVALID_TOKEN_PLEASE_LOGIN_AGAIN',

  // warehouse error
  WAREHOUSE_NOT_EXIST: 'WAREHOUSE_NOT_EXIST',
  WAREHOUSE_EXIST: 'WAREHOUSE_EXIST',
  INVALID_WAREHOUSE_CODE: 'INVALID_WAREHOUSE_CODE',
  // warehouse - block
  BLOCK_DUPLICATED: 'BLOCK_DUPLICATED',
  BLOCK_NOT_EXIST: 'BLOCK_NOT_EXIST',

  // gate
  GATE_NOT_EXIST: 'GATE_NOT_EXIST', // check cổng này tồn tại hay không

  // equip type
  EQUIPTYPE_NOT_EXIST: 'EQUIPTYPE_NOT_EXIST',
  EQUIPTYPE_NOT_EXIST_UPDATE: 'EQUIPTYPE_NOT_EXIST_UPDATE',
  EQUIPTYPE_IS_EXISTED: 'EQUIPTYPE_IS_EXISTED',

  // method
  METHOD_CODE_NOT_EXIST: 'METHOD_CODE_NOT_EXIST',

  //Itemtype
  ITEM_TYPE_EXIST: 'ITEM_TYPE_EXIST',
};

export const SUCCESS_MESSAGE = {
  SUCCESS: 'SUCCESS',
  UPDATE_SUCCESS: 'UPDATE_SUCCESS',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  CHANGE_DEFAULT_PASSWORD_SUCCESS: 'CHANGE_DEFAULT_PASSWORD_SUCCESS',
  CHANGE_PASSWORD_SUCCESS: 'CHANGE_PASSWORD_SUCCESS',
  GET_TOKEN_SUCCESS: 'GET_TOKEN_SUCCESS',
  GET_MENU_SUCCESS: 'GET_MENU_SUCCESS',
  GRANT_PERMISSION_SUCCESS: 'GRANT_PERMISSION_SUCCESS',
  GET_PERMISSION_SUCCESS: 'GET_PERMISSION_SUCCESS',
  GET_GRANT_PERMISSION_SUCCESS: 'GET_GRANT_PERMISSION_SUCCESS',
  CREATE_USER_SUCCESS: 'CREATE_USER_SUCCESS',
  DELETE_USER_SUCCESS: 'DELETE_USER_SUCCESS',
  DEACTIVE_USER_SUCCESS: 'DEACTIVE_USER_SUCCESS',
  ACTIVE_USER_SUCCESS: 'ACTIVE_USER_SUCCESS',
  UPDATE_USER_SUCCESS: 'UPDATE_USER_SUCCESS',
  RESET_PASSWORD_SUCCESS: 'RESET_PASSWORD_SUCCESS',

  //common
  GET_DATA_SUCCESS: 'GET_DATA_SUCCESS',
  // BLOCK
  SAVE_BLOCK_SUCCESS: 'SAVE_BLOCK_SUCCESS',
  DELETE_BLOCK_SUCCESS: 'DELETE_BLOCK_SUCCESS',
  GET_BLOCK_SUCCESS: 'GET_BLOCK_SUCCESS',

  // Cell
  SAVE_CELL_SUCCESS: 'SAVE_CELL_SUCCESS',
  DELETE_CELL_SUCCESS: 'DELETE_CELL_SUCCESS',
  GET_CELL_SUCCESS: 'GET_CELL_SUCCESS',

  // warehouse - block
  DELETE_WAREHOUSE_SUCCESS: 'DELETE_WAREHOUSE_SUCCESS',
  GET_WAREHOUSE_SUCCESS: 'GET_WAREHOUSE_SUCCESS',
  SAVE_WAREHOUSE_SUCCESS: 'SAVE_WAREHOUSE_SUCCESS',

  // gate
  CREATE_GATE_SUCCESS: 'CREATE_GATE_SUCCESS',
  DELETE_GATE_SUCCESS: 'DELETE_GATE_SUCCESS',
  GET_GATE_SUCCESS: 'GET_GATE_SUCCESS',

  // equipment
  CREATE_EQUIPTYPE_SUCCESS: 'CREATE_EQUIPTYPE_SUCCESS',
  DELETE_EQUIPTYPE_SUCCESS: 'DELETE_EQUIPTYPE_SUCCESS',
  GET_EQUIPTYPE_SUCCESS: 'GET_EQUIPTYPE_SUCCESS',
  SAVE_EQUIPMENT_SUCCESS: 'CREATE_EQUIPMENT_SUCCESS',
  DELETE_EQUIPMENT_SUCCESS: 'DELETE_EQUIPMENT_SUCCESS',
  GET_EQUIPMENT_SUCCESS: 'GET_EQUIPMENT_SUCCESS',

  // method
  SAVE_METHOD_SUCCESS: 'SAVE_METHOD_SUCCESS',
  DELETE_METHOD_SUCCESS: 'DELETE_METHOD_SUCCESS',
  GET_METHOD_SUCCESS: 'GET_METHOD_SUCCESS',

  //item-type
  DELETE_ITEMTYPE_SUCCESS: 'DELETE_ITEMTYPE_SUCCESS',
  GET_ITEMTYPE_SUCCESS: 'GET_ITEMTYPE_SUCCESS',
  SAVE_ITEMTYPE_SUCCESS: 'SAVE_ITEMTYPE_SUCCESS',

  //Package-Unit
  DELETE_PACKAGE_UNIT_SUCCESS: 'DELETE_PACKAGE_UNIT_SUCCESS',
  GET_PACKAGE_UNIT_SUCCESS: 'GET_PACKAGE_UNIT_SUCCESS',
  SAVE_PACKAGE_UNIT_SUCCESS: 'SAVE_PACKAGE_UNIT_SUCCESS',

  // BLOCK
  SAVE_CUSTOMERTYPE_SUCCESS: 'SAVE_CUSTOMERTYPE_SUCCESS',
  DELETE_CUSTOMERTYPE_SUCCESS: 'DELETE_BLOCKCUSTOMERTYPE_SUCCESS',
  GET_CUSTOMERTYPE_SUCCESS: 'GET_CUSTOMERTYPE_SUCCESS',

  // VESSEL
  SAVE_VESSEL_SUCCESS: 'SAVE_VESSEL_SUCCESS',
  DELETE_VESSEL_SUCCESS: 'DELETE_VESSEL_SUCCESS',
  GET_VESSEL_SUCCESS: 'GET_VESSEL_SUCCESS',

  // CONTAINER
  SAVE_CONTAINER_SUCCESS: 'SAVE_CONTAINER_SUCCESS',
  DELETE_CONTAINER_SUCCESS: 'DELETE_CONTAINER_SUCCESS',
  GET_CONTAINER_SUCCESS: 'GET_CONTAINER_SUCCESS',

  // PACKAGE
  SAVE_PACKAGE_SUCCESS: 'SAVE_PACKAGE_SUCCESS',
  DELETE_PACKAGE_SUCCESS: 'DELETE_PACKAGE_SUCCESS',
  GET_PACKAGE_SUCCESS: 'GET_PACKAGE_SUCCESS',

  // TARIFFCODE
  DELETE_TARIFFCODE_SUCCESS: 'DELETE_TARIFFCODE_SUCCESS',
  GET_TARIFFCODE_SUCCESS: 'GET_TARIFFCODE_SUCCESS',
  SAVE_TARIFFCODE_SUCCESS: 'SAVE_TARIFFCODE_SUCCESS',

  // TARIFF
  DELETE_TARIFF_SUCCESS: 'DELETE_TARIFF_SUCCESS',
  GET_TARIFF_SUCCESS: 'GET_TARIFF_SUCCESS',
  SAVE_TARIFF_SUCCESS: 'SAVE_TARIFF_SUCCESS',

  // TARIFF Discount
  DELETE_TARIFF_DISCOUNT_SUCCESS: 'DELETE_TARIFF_DISCOUNT_SUCCESS',
  GET_TARIFF_DISCOUNT_SUCCESS: 'GET_TARIFF_DISCOUNT_SUCCESS',
  SAVE_TARIFF_DISCOUNT_SUCCESS: 'SAVE_TARIFF_DISCOUNT_SUCCESS',

  //config-attach-srv
  UPDATE_CONFIG_ATTACH_SRV_SUCCESS: 'UPDATE_CONFIG_ATTACH_SRV_SUCCESS',

  //job-quantity-check
  SAVE_JOB_QUANTITY_CHECK_SUCCESS: 'SAVE_JOB_QUANTITY_CHECK_SUCCESS',
  COMPLETE_JOB_QUANTITY_CHECK_SUCCESS: 'COMPLETE_JOB_QUANTITY_CHECK_SUCCESS',
};

export const REASON_PHRASES = {
  ACCEPTED: 'ACCEPTED',
  BAD_GATEWAY: 'BAD_GATEWAY',
  BAD_REQUEST: 'BAD_REQUEST',
  CONFLICT: 'CONFLICT',
  CONTINUE: 'CONTINUE',
  CREATED: 'CREATED',
  EXPECTATION_FAILED: 'EXPECTATION_FAILED',
  FAILED_DEPENDENCY: 'FAILED_DEPENDENCY',
  FORBIDDEN: 'FORBIDDEN',
  GATEWAY_TIMEOUT: 'GATEWAY_TIMEOUT',
  GONE: 'GONE',
  HTTP_VERSION_NOT_SUPPORTED: 'HTTP_VERSION_NOT_SUPPORTED',
  IM_A_TEAPOT: 'IM_A_TEAPOT',
  INSUFFICIENT_SPACE_ON_RESOURCE: 'INSUFFICIENT_SPACE_ON_RESOURCE',
  INSUFFICIENT_STORAGE: 'INSUFFICIENT_STORAGE',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  LENGTH_REQUIRED: 'LENGTH_REQUIRED',
  LOCKED: 'LOCKED',
  METHOD_FAILURE: 'METHOD_FAILURE',
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  MOVED_PERMANENTLY: 'MOVED_PERMANENTLY',
  MOVED_TEMPORARILY: 'MOVED_TEMPORARILY',
  MULTI_STATUS: 'MULTI_STATUS',
  MULTIPLE_CHOICES: 'MULTIPLE_CHOICES',
  NETWORK_AUTHENTICATION_REQUIRED: 'NETWORK_AUTHENTICATION_REQUIRED',
  NO_CONTENT: 'NO_CONTENT',
  NON_AUTHORITATIVE_INFORMATION: 'NON_AUTHORITATIVE_INFORMATION',
  NOT_ACCEPTABLE: 'NOT_ACCEPTABLE',
  NOT_FOUND: 'NOT_FOUND',
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
  NOT_MODIFIED: 'NOT_MODIFIED',
  OK: 'OK',
  PAYMENT_REQUIRED: 'PAYMENT_REQUIRED',
  PERMANENT_REDIRECT: 'PERMANENT_REDIRECT',
  PRECONDITION_FAILED: 'PRECONDITION_FAILED',
  PRECONDITION_REQUIRED: 'PRECONDITION_REQUIRED',
  PROCESSING: 'PROCESSING',
  PROXY_AUTHENTICATION_REQUIRED: 'PROXY_AUTHENTICATION_REQUIRED',
  REQUEST_HEADER_FIELDS_TOO_LARGE: 'REQUEST_HEADER_FIELDS_TOO_LARGE',
  REQUEST_TIMEOUT: 'REQUEST_TIMEOUT',
  REQUEST_TOO_LONG: 'REQUEST_TOO_LONG',
  REQUEST_URI_TOO_LONG: 'REQUEST_URI_TOO_LONG',
  REQUESTED_RANGE_NOT_SATISFIABLE: 'REQUESTED_RANGE_NOT_SATISFIABLE',
  RESET_CONTENT: 'RESET_CONTENT',
  SEE_OTHER: 'SEE_OTHER',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  SWITCHING_PROTOCOLS: 'SWITCHING_PROTOCOLS',
  TEMPORARY_REDIRECT: 'TEMPORARY_REDIRECT',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  UNAUTHORIZED: 'UNAUTHORIZED',
  UNAVAILABLE_FOR_LEGAL_REASONS: 'UNAVAILABLE_FOR_LEGAL_REASONS',
  UNPROCESSABLE_ENTITY: 'UNPROCESSABLE_ENTITY',
  UNSUPPORTED_MEDIA_TYPE: 'UNSUPPORTED_MEDIA_TYPE',
  USE_PROXY: 'USE_PROXY',
  MISDIRECTED_REQUEST: 'MISDIRECTED_REQUEST',
};

export const dbColumns: any = {
  //warehouse
  WAREHOUSE_CODE: 'Mã kho',
  BLOCK_CODE: 'Mã dãy',
  BLOCK_NAME: 'Tên dãy',
  TIER_COUNT: 'Số tầng',
  SLOT_COUNT: 'Số ô',
  BLOCK_WIDTH: 'Chiều rộng (m)',
  BLOCK_HEIGHT: 'Chiều cao (m)',
  BLOCK_LENGTH: 'Chiều dài (m)',
  //equidment
  EQU_TYPE: 'Mã thiết bị',
  EQU_TYPE_NAME: 'Tên thiết bị',
  EQU_CODE: 'Mã thiết bị',
  EQU_CODE_NAME: 'Tên thiết bị',
  //method
  METHOD_CODE: 'mã phương án',
  METHOD_NAME: 'tên phương án',
  IS_IN_OUT: 'trạng thái',
  IS_SERVICE: 'dịch vụ',
  //gate
  GATE_CODE: 'mã cổng',
  GATE_NAME: 'tên cổng',
  //package-unit
  PACKAGE_UNIT_CODE: 'mã đơn vị',

  // customer type
  CUSTOMER_TYPE_CODE: 'mã loại khách hàng',
  CUSTOMER_TYPE_NAME: 'tên loại khách hàng',

  // customer
  CUSTOMER_CODE: 'mã khách hàng',

  // vessel
  VOYAGEKEY: 'mã tàu',

  //
  ITEM_TYPE_CODE: 'mã loại hàng hóa',
  ITEM_TYPE_NAME: 'tên loại hàng hóa',
};
