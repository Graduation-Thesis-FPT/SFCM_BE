INSERT INTO SA_ROLE (ROLE_CODE, ROLE_NAME,CREATE_BY,UPDATE_BY)
VALUES ('admin',N'Quản trị viên','sql','sql'),
('procedure-staff',N'Thủ tục','sql','sql'),
('gate-operator',N'Điều hành cổng','sql','sql'),
('tally-operator',N'Điều hành kiểm đếm','sql','sql'),
('warehouse-operator',N'Điều hành kho','sql','sql')

INSERT INTO SA_MENU (PARENT_CODE,MENU_CODE,MENU_NAME,MENU_ICON,IS_VISIBLE,ORDER_BY,VIEW_PAGE,CREATE_BY,UPDATE_BY)
VALUES 
(NULL,'user-management',N'Quản lý người dùng','UserRound',1,100,NULL,'sql','sql'),
('user-management','user',N'Người dùng',NULL,1,101,'User','sql','sql'),
('user-management','permission',N'Phân quyền',NULL,1,102,'Permission','sql','sql'),
(NULL,'generic-list',N'Danh mục dùng chung','Layers',1,200,NULL,'sql','sql'),
('generic-list','warehouse-list',N'Danh mục kho',NULL,1,201,'WarehouseList','sql','sql'),
('generic-list','warehouse-design',N'Thiết kế kho',NULL,1,203,'WarehouseDesign','sql','sql'),
('generic-list','gate-list',N'Danh mục cổng',NULL,1,204,'GateList','sql','sql'),
('generic-list','equipment-list',N'Danh mục thiết bị',NULL,1,205,'EquipmentList','sql','sql'),
('generic-list','method-list',N'Danh mục phương án',NULL,1,206,'MethodList','sql','sql'),
('generic-list','item-type',N'Danh mục loại hàng hóa',NULL,1,207,'ItemType','sql','sql'),
('generic-list','unit-list',N'Danh mục đơn vị tính',NULL,1,208,'UnitList','sql','sql'),
('generic-list','customer-type',N'Danh mục loại khách hàng',NULL,1,209,'CustomerType','sql','sql'),
('generic-list','customer-list',N'Danh mục khách hàng',NULL,1,210,'CustomerList','sql','sql'),
(NULL,'input-data',N'Dữ liệu đầu vào','FolderInput',1,300,NULL,'sql','sql'),
('input-data','vessel-info',N'Thông tin tàu chuyến',NULL,1,301,'VesselInfo','sql','sql'),
('input-data','manifest-loading-list',N'Kê khai hàng hóa',NULL,1,302,'ManifestLoadingList','sql','sql'),
('input-data','goods-manifest',N'Bảng kê danh mục hàng hóa',NULL,1,303,'GoodsManifest','sql','sql'),
(NULL,'tariff',N'Biểu cước','Calculator',1,400,NULL,'sql','sql'),
('tariff','tariff-code',N'Mã biểu cước',NULL,1,401,'TariffCode','sql','sql'),
('tariff','standard-tariff',N'Biểu cước chuẩn',NULL,1,402,'StandardTariff','sql','sql'),
('tariff','discount-tariff',N'Biểu cước giảm giá',NULL,1,403,'DiscountTariff','sql','sql'),
('tariff','config-attach-srv',N'Cấu hình dịch vụ đính kèm',NULL,1,404,'ConfigAttachSrv','sql','sql'),
(NULL,'procedure',N'Thủ tục','Combine',1,500,NULL,'sql','sql'),
('procedure','import-order',N'Lệnh nhập kho',NULL,1,501,'ImportOrder','sql','sql'),
('procedure','export-order',N'Lệnh xuất kho',NULL,1,502,'ExportOrder','sql','sql')

INSERT INTO SA_PERMISSION (ROLE_CODE,MENU_CODE,IS_VIEW,IS_ADD_NEW,IS_MODIFY,IS_DELETE,CREATE_BY,UPDATE_BY)
VALUES 
('admin','user',1,1,1,1,'sql','sql'),
('admin','permission',1,1,1,1,'sql','sql'),
('admin','warehouse-list',1,1,1,1,'sql','sql'),
('admin','warehouse-design',1,1,1,1,'sql','sql'),
('admin','gate-list',1,1,1,1,'sql','sql'),
('admin','method-list',1,1,1,1,'sql','sql'),
('admin','item-type',1,1,1,1,'sql','sql'),
('admin','unit-list',1,1,1,1,'sql','sql'),
('admin','customer-type',1,1,1,1,'sql','sql'),
('admin','customer-list',1,1,1,1,'sql','sql'),
('admin','vessel-info',1,1,1,1,'sql','sql'),
('admin','manifest-loading-list',1,1,1,1,'sql','sql'),
('admin','goods-manifest',1,1,1,1,'sql','sql'),
('admin','tariff-code',1,1,1,1,'sql','sql'),
('admin','standard-tariff',1,1,1,1,'sql','sql'),
('admin','discount-tariff',1,1,1,1,'sql','sql'),
('admin','config-attach-srv',1,1,1,1,'sql','sql'),
('admin','import-order',1,1,1,1,'sql','sql'),
('admin','export-order',1,1,1,1,'sql','sql'),
('procedure-staff','user',1,0,0,0,'sql','sql'),
('procedure-staff','permission',1,0,0,0,'sql','sql'),
('procedure-staff','warehouse-list',1,1,1,1,'sql','sql'),
('procedure-staff','warehouse-design',1,1,1,1,'sql','sql'),
('procedure-staff','gate-list',1,1,1,1,'sql','sql'),
('procedure-staff','method-list',1,1,1,1,'sql','sql'),
('procedure-staff','item-type',1,1,1,1,'sql','sql'),
('procedure-staff','unit-list',1,1,1,1,'sql','sql'),
('procedure-staff','customer-type',1,1,1,1,'sql','sql'),
('procedure-staff','customer-list',1,1,1,1,'sql','sql')

INSERT INTO SA_USER (ROLE_CODE, USER_NAME,CREATE_BY,UPDATE_BY)
VALUES ('admin','superadmin','sql','sql'),
('procedure-staff','vusiphu','sql','sql')

