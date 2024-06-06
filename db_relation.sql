USE MASTER
GO
-- Kiểm tra xem cơ sở dữ liệu 'SFCM' đã tồn tại chưa
IF EXISTS (SELECT 1 FROM sys.databases WHERE name = 'SFCM')
BEGIN
    -- Nếu tồn tại, thì xóa cơ sở dữ liệu 'SFCM'
    DROP DATABASE SFCM
END
-- Tạo mới cơ sở dữ liệu 'SFCM'
GO
CREATE DATABASE SFCM

-- Sử dụng cơ sở dữ liệu 'SFCM' để tạo các bảng
GO
USE SFCM
GO

CREATE TABLE [dbo].[BS_CELL](
	[ROWGUID] [uniqueidentifier] PRIMARY KEY default (newid()),
	[WAREHOUSE_CODE] [nvarchar](50) NOT NULL,
	[BLOCK] [nvarchar](10) NOT NULL,
	[TIER_COUNT] [int] NULL,
	[SLOT_COUNT] [int] NULL,
	[STATUS] [int] NULL,
	[CREATE_BY] [nvarchar](100) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](100) NOT NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
)

CREATE TABLE [dbo].[BS_CUSTOMER](
	[CUSTOMER_TYPE_CODE] [nvarchar](50) NOT NULL,
	[CUSTOMER_CODE] [nvarchar](50) NOT NULL PRIMARY KEY,
	[CUSTOMER_NAME] [nvarchar](500) NOT NULL,
	[ACC_TYPE] [nvarchar](3) NOT NULL,
	[ADDRESS] [nvarchar](max) NULL,
	[TAX_CODE] [nvarchar](50) NOT NULL,
	[EMAIL] [nvarchar](200) NULL,
	[IS_ACTIVE] [bit] NOT NULL,
	[CREATE_BY] [nvarchar](100) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](100) NOT NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
)

CREATE TABLE [dbo].[BS_CUSTOMER_TYPE](
	[CUSTOMER_TYPE_CODE] [nvarchar](50) PRIMARY KEY,
	[CUSTOMER_TYPE_NAME] [nvarchar](500) NOT NULL,
	[CREATE_BY] [nvarchar](100) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](100) NOT NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
)

CREATE TABLE [dbo].[BS_EQUIPMENTS](
	[EQU_TYPE] [nvarchar](10) NOT NULL,
	[EQU_CODE] [nvarchar](10) NOT NULL PRIMARY KEY,
	[EQU_CODE_NAME] [nvarchar](50) NOT NULL,
	REF_ROWGUID uniqueidentifier null,
	[BLOCK] [nvarchar](max) NULL,
	[CREATE_BY] [nvarchar](100) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](100) NOT NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
)

CREATE TABLE [dbo].[BS_EQUIPMENTS_TYPE](
	[EQU_TYPE] [nvarchar](10) NOT NULL PRIMARY KEY,
	[EQU_TYPE_NAME] [nvarchar](50) NOT NULL,
	[CREATE_BY] [nvarchar](100) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](100) NOT NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
)

CREATE TABLE [dbo].[BS_GATE](
	[GATE_CODE] [nvarchar](50) NOT NULL PRIMARY KEY,
	[GATE_NAME] [nvarchar](500) NOT NULL,
	[IS_IN_OUT] [char](1) NOT NULL,
	[CREATE_BY] [nvarchar](100) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](100) NOT NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
)

CREATE TABLE [dbo].[BS_ITEM_TYPE](
	[ITEM_TYPE_CODE] [nvarchar](50) NOT NULL PRIMARY KEY,
	[ITEM_TYPE_NAME] [nvarchar](500) NOT NULL,
	[CREATE_BY] [nvarchar](100) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](100) NOT NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
)

CREATE TABLE [dbo].[BS_METHOD](
	[METHOD_CODE] [nvarchar](50) NOT NULL PRIMARY KEY,
	[METHOD_NAME] [nvarchar](500) NOT NULL,
	[IS_IN_OUT] [char](1) NOT NULL,
	[IS_SERVICE] [int] NULL,
	[CREATE_BY] [nvarchar](100) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](100) NOT NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
)

CREATE TABLE [dbo].[BS_TRUCK](
	[TRUCK_NO] [nvarchar](50) PRIMARY KEY,
	[WEIGHT_REGIS] [numeric](18, 2) NULL,
	[WEIGHT_REGIS_ALLOW] [numeric](18, 2) NULL,
	[TRUCK_DATE_EXP] [datetime] NULL,
	[CREATE_BY] [nvarchar](100) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](100) NOT NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
)

CREATE TABLE [dbo].[BS_UNIT](
	[UNIT_CODE] [nvarchar](50) NOT NULL PRIMARY KEY,
	[UNIT_NAME] [nvarchar](500) NOT NULL,
	[CREATE_BY] [nvarchar](100) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](100) NOT NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
)

CREATE TABLE [dbo].[BS_WAREHOUSE](
	[WAREHOUSE_CODE] [nvarchar](50) NOT NULL PRIMARY KEY,
	[WAREHOUSE_NAME] [nvarchar](500) NOT NULL,
	[ACREAGE] [numeric](18, 3) NOT NULL,
	[STATUS] [bit] NULL DEFAULT (0),
	[CREATE_BY] [nvarchar](100) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](100) NOT NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
)

CREATE TABLE [dbo].[DT_CNTR_MNF_LD](
	[ROWGUID] [uniqueidentifier] primary key default (newid()),
	[VOYAGEKEY] [nvarchar](50) NOT NULL,
	[BILLOFLADING] [varchar](50) NULL,
	[SEALNO] [nvarchar](35) NULL,
	[CNTRNO] [varchar](11) NOT NULL,
	[CNTRSZTP] [varchar](5) NOT NULL,
	[STATUSOFGOOD] [bit] NOT NULL,
	[ITEM_TYPE_CODE] [nvarchar](50) NOT NULL,
	[COMMODITYDESCRIPTION] [nvarchar](max) NULL,
	[CONSIGNEE] [nvarchar](500) NOT NULL,
	[CREATE_BY] [nvarchar](100) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](100) NOT NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
 )

 CREATE TABLE [dbo].[DT_PACKAGE_MNF_LD](
	[ROWGUID] [uniqueidentifier] primary key default (newid()),
	[VOYAGEKEY] [nvarchar](50) NOT NULL,
	[BILLOFLADING] [varchar](50) NULL,
	[CNTRNO] [varchar](11) NULL,
	[HOUSE_BILL] [nvarchar](200) NULL,
	[LOT_NO] [nvarchar](10) NULL,
	[ITEM_TYPE_CODE] [nvarchar](50) NULL,
	[COMMODITYDESCRIPTION] [nvarchar](max) NULL,
	[UNIT_CODE] [nvarchar](50) NOT NULL,
	[CARGO_PIECE] [int] NULL,
	[CBM] [decimal](10, 3) NOT NULL,
	[DECLARE_NO] [varchar](max) NULL,
	[NOTE] [nvarchar](200) NULL,
	[REF_CONTAINER] uniqueidentifier null ,
	[CREATE_BY] [nvarchar](100) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](100) NOT NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
)

CREATE TABLE [dbo].[DT_ORDER](
	[ORDER_NO] [nvarchar](50) primary key,
	[CUSTOMER_CODE] [nvarchar](50) NULL,
	[ACC_TYPE] [nvarchar](3) NULL,
	[DELIVERY_ORDER] [nvarchar](100) NULL,
	[BILLOFLADING] [varchar](50) NULL,
	[REF_CONTAINER] uniqueidentifier null,
	[ITEM_TYPE_CODE] [nvarchar](50) NOT NULL,
	[ITEM_TYPE_CODE_CNTR] [nvarchar](50) NULL,
	[METHOD_CODE] [nvarchar](50) NOT NULL,
	[ISSUE_DATE] [datetime] NOT NULL,
	[EXP_DATE] [datetime] NOT NULL,
	[HOUSE_BILL] [nvarchar](200) NULL,
	[TOTAL_CBM] [decimal](10, 3) NULL,
	[NOTE] [nvarchar](max) NULL,
	[DRAFT_NO] [nvarchar](20) NULL,
	[INV_NO] [nvarchar](20) NULL,
	[GATE_CHK] [bit] NOT NULL,
	[COMMODITYDESCRIPTION] [nvarchar](max) NULL,
	[CREATE_BY] [nvarchar](100) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](100) NOT NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
)

CREATE TABLE DT_ORDER_DTLS(
	[ROWGUID] [uniqueidentifier] primary key default (newid()),
	[ORDER_NO] [nvarchar](50) NOT NULL,
	[HOUSE_BILL] [nvarchar](200) NULL,
	[CBM] [decimal](10, 3) NULL,
	[LOT_NO] [int] NULL,
	[QUANTITY_CHK] [bit] NOT NULL,
	[REF_PAKAGE] uniqueidentifier null,
)

CREATE TABLE [dbo].[DT_PACKAGE_STOCK](-- CHƯA HOÀN THIỆN
	[ROWGUID] [uniqueidentifier] PRIMARY KEY DEFAULT (newid()),
	[VOYAGEKEY] [nvarchar](50) NULL,
	[WAREHOUSE_CODE] [nvarchar](50) NULL,
	[ORDER_NO] [nvarchar](50) NULL,
	[CUSTOMER_CODE] [nvarchar](50) NULL,
	[HOUSE_BILL] [nvarchar](200) NULL,
	[CNTRNO] [varchar](11) NULL,
	[STATUS] [char](1) NULL,
	[TIME_IN] [datetime] NULL,
	[TIME_OUT] [datetime] NULL,
	[CARGO_PIECE] [int] NULL,
	[UNIT_CODE] [nvarchar](50) NULL,
	[ITEM_TYPE_CODE] [nvarchar](50) NULL,
	[CBM] [decimal](10, 3) NULL,
	[TLHQ] [bit] NULL,
	[METHOD_IN] [nvarchar](50) NULL,
	[METHOD_OUT] [nvarchar](50) NULL,
	[NOTE] [nvarchar](max) NULL,
	[CREATE_BY] [nvarchar](100) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](100) NOT NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[COMMODITYDESCRIPTION] [nvarchar](max) NULL,
)

CREATE TABLE [dbo].[DT_PALLET_STOCK](
	[ROWGUID] [uniqueidentifier] PRIMARY KEY DEFAULT (newid()),
	[REF_STOCK] uniqueidentifier null,
	[HOUSE_BILL] [varchar](50) NULL,
	[PALLET_NO] [nvarchar](100) NULL,
	[CARGO_PIECE] [int] NULL,
	[UNIT_CODE] [nvarchar](50) NULL,
	[WAREHOUSE_CODE] [varchar](50) NULL,
	[BLOCK] [nvarchar](5) NULL,
	[SLOT] [int] NULL,
	[TIER] [int] NULL,
	[STATUS] [char](1) NULL,
	[NOTE] [nvarchar](max) NULL,
	[CREATE_BY] [nvarchar](100) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](100) NOT NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
)

CREATE TABLE [dbo].[DT_VESSEL_VISIT](
	[VOYAGEKEY] [nvarchar](50) NOT NULL PRIMARY KEY,
	[VESSEL_NAME] [nvarchar](200) NOT NULL,
	[INBOUND_VOYAGE] [varchar](20) NULL,
	[OUTBOUND_VOYAGE] [varchar](20) NULL,
	[ETA] [datetime] NULL,
	[ETD] [datetime] NULL,
	[CallSign] [varchar](50) NULL,
	[IMO] [varchar](30) NULL,
	[CREATE_BY] [nvarchar](100) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](100) NOT NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
)

CREATE TABLE [dbo].[INV_DFT](
	[DRAFT_INV_NO] [nvarchar](20) PRIMARY KEY,
	[INV_NO] [nvarchar](20) NULL,
	[DRAFT_INV_DATE] [datetime] NULL,
	[PAYER_TYPE] [nvarchar](3) NULL,
	[PAYER] [nvarchar](20) NULL,
	[AMOUNT] [numeric](12, 2) NULL,
	[VAT] [numeric](12, 2) NULL,
	[REMARK] [nvarchar](100) NULL,
	[PAYMENT_STATUS] [nvarchar](1) NULL,
	[CURRENCYID] [nvarchar](3) NULL,
	[RATE] [numeric](14, 2) NULL,
	[INV_TYPE] [nvarchar](3) NULL,
	[TAMOUNT] [numeric](12, 2) NULL,
	[CREATE_BY] [nvarchar](50) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](50) NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
)

CREATE TABLE [dbo].[INV_DFT_DTL](
	[ROWGUID] [uniqueidentifier] PRIMARY KEY DEFAULT (newid()),
	[DRAFT_INV_NO] [nvarchar](20) NOT NULL,
	[SEQ] [int] NOT NULL,
	[TRF_CODE] [nvarchar](12) NULL,
	[CARGO_TYPE] [nvarchar](2) NULL,
	[QTY] [numeric](12, 2) NULL,
	[UNIT_RATE] [numeric](15, 5) NULL,
	[AMOUNT] [numeric](12, 2) NULL,
	[VAT_RATE] [numeric](5, 2) NULL,
	[VAT] [numeric](12, 2) NULL,
	[TAMOUNT] [numeric](12, 2) NULL,
	[TRF_DESC] [nvarchar](500) NULL,
	[INV_UNIT] [nvarchar](3) NULL,
	[VAT_CHK] [bit] NULL,
	[REMARK] [nvarchar](max) NULL,
	[CREATE_BY] [nvarchar](50) NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](50) NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
)

CREATE TABLE [dbo].[INV_VAT](
	[INV_NO] [nvarchar](20) PRIMARY KEY,
	[ORDER_NO] [nvarchar](50) not null,
	[INV_DATE] [datetime] NULL,
	[PAYER_TYPE] [nvarchar](3) NULL,
	[PAYER] [nvarchar](20) NULL,
	[AMOUNT] [numeric](12, 2) NULL,
	[VAT] [numeric](12, 2) NULL,
	[REMARK] [nvarchar](100) NULL,
	[PAYMENT_STATUS] [nvarchar](1) NULL,
	[CURRENCYID] [nvarchar](3) NULL,
	[RATE] [numeric](14, 2) NULL,
	[INV_TYPE] [nvarchar](3) NULL,
	[TAMOUNT] [numeric](12, 2) NULL,
	[ACC_CD] [nvarchar](10) NULL,
	[CANCEL_DATE] [datetime] NULL,
	[CANCLE_REMARK] [nvarchar](200) NULL,
	[CANCLE_BY] [nvarchar](25) NULL,
	[CREATE_BY] [nvarchar](100) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](100) NOT NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
)

CREATE TABLE [dbo].[JOB_GATE](
	[ROWGUID] [uniqueidentifier] PRIMARY KEY DEFAULT (newid()),
	[ORDER_NO] [nvarchar](50) NOT NULL,
	[WAREHOUSE_CODE] [nvarchar](50) NOT NULL,
	[GATE_CODE] [nvarchar](50) NOT NULL,
	[IS_IN_OUT] [char](1) NOT NULL,
	[DRIVER] [nvarchar](500) NULL,
	[TEL] [nvarchar](20) NULL,
	[TRUCK_NO] [nvarchar](50) NULL,
	[WEIGHT_REGIS] [numeric](18, 2) NULL,
	[WEIGHT_REGIS_ALLOW] [numeric](18, 2) NULL,
	[HOUSE_BILL] [nvarchar](200) NULL,
	[CARGO_PIECE] [int] NULL,
	[UNIT_CODE] [nvarchar](50) NULL,
	[NOTE] [nvarchar](max) NULL,
	[TIME_IN] [datetime] NULL,
	[TIME_OUT] [datetime] NULL,
	[IS_SUCCESS_IN] [bit] NULL,
	[IS_SUCCESS_OUT] [bit] NULL,
	[CREATE_BY] [nvarchar](100) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](100) NOT NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
)

CREATE TABLE [dbo].[JOB_QUANTITY_CHECK](
	[PALLET_NO] [nvarchar](100) primary key ,
	[VOYAGEKEY] [nvarchar](50) NULL,
	[HOUSE_BILL] [nvarchar](200) NULL,
	[ESTIMATED_CARGO_PIECE] [int] NULL,
	[ACTUAL_CARGO_PIECE] [int] NULL,
	[ACTUAL_UNIT] [nvarchar](50) NULL,
	[SEQ] [int] NULL,
	[START_DATE] [datetime] NULL,
	[FINISH_DATE] [datetime] NULL,
	[IS_FINAL] [bit] NULL,
	[JOB_STATUS] [char](1) NULL,
	[NOTE] [nvarchar](max) NULL,
	[REF_GATE] uniqueidentifier null,
	[CREATE_BY] [nvarchar](100) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](100) NOT NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
)

CREATE TABLE [dbo].[JOB_STOCK](
	[ROWGUID] [uniqueidentifier] PRIMARY KEY DEFAULT (newid()),
	[JOB_TYPE] [nvarchar](10) NULL,
	[HOUSE_BILL] [nvarchar](200) NULL,
	[ORDER_NO] [nvarchar](50) NULL,
	[PALLET_NO] [nvarchar](100) NULL,
	[SEQ] [int] NULL,
	[ACTUAL_CARGO_PIECE] [int] NULL,
	[ACTUAL_UNIT] [nvarchar](50) NULL,
	[BLOCK] [nvarchar](5) NULL,
	[SLOT] [int] NULL,
	[TIER] [int] NULL,
	[JOB_STATUS] [char](1) NULL,
	REF_CELL uniqueidentifier null,
	[CREATE_BY] [nvarchar](100) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](500) NOT NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
)

CREATE TABLE [dbo].[TRF_CODES](
	[TRF_CODE] [nvarchar](12) PRIMARY KEY,
	[TRF_DESC] [nvarchar](150) NOT NULL,
	[CREATE_BY] [nvarchar](100) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](500) NOT NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
)

CREATE TABLE [dbo].[TRF_STD](
	[ROWGUID] [uniqueidentifier] PRIMARY KEY DEFAULT (newid()),
	[TRF_CODE] [nvarchar](12) NOT NULL,
	[TRF_DESC] [nvarchar](150) NOT NULL,
	[METHOD_CODE] [nvarchar](50) NOT NULL,
	[ITEM_TYPE_CODE] [nvarchar](50) NOT NULL,
	[CURRENCY_CODE] [nvarchar](3) NOT NULL,
	[AMT_CBM] [numeric](12, 2) NULL,
	[VAT] [numeric](5, 2) NULL,
	[INCLUDE_VAT] [int] NULL,
	[FROM_DATE] [nvarchar](30) NOT NULL,
	[TO_DATE] [nvarchar](30) NOT NULL,
	[TRF_NAME] [nvarchar](100) NOT NULL,
	[TRF_TEMP] [nvarchar](200) NOT NULL,
	[CREATE_BY] [nvarchar](100) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](500) NOT NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
)

CREATE TABLE [dbo].[SA_MENU](
	[ROWGUID] [uniqueidentifier] PRIMARY KEY default (newid()),
	[PARENT_CODE] [nvarchar](255) NULL,
	[MENU_CODE] [nvarchar](100) NOT NULL,
	[MENU_NAME] [nvarchar](max) NOT NULL,
	[MENU_ICON] [nvarchar](255) NULL,
	[IS_VISIBLE] [bit] NOT NULL,
	[ORDER_BY] [int] NOT NULL,
	[VIEW_PAGE] [nvarchar](100) NULL,
	[CREATE_BY] [nvarchar](100) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](500) NOT NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
)


CREATE TABLE [dbo].[SA_PERMISSION](
	[ROWGUID] [uniqueidentifier] PRIMARY KEY DEFAULT (newid()),
	[ROLE_CODE] [nvarchar](100) NOT NULL,
	[MENU_CODE] [nvarchar](500) NOT NULL,
	[IS_VIEW] [bit] NULL,
	[IS_ADD_NEW] [bit] NULL,
	[IS_MODIFY] [bit] NULL,
	[IS_DELETE] [bit] NULL,
	[CREATE_BY] [nvarchar](100) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](500) NOT NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
)

CREATE TABLE [dbo].[SA_ROLE](
	[ROWGUID] [uniqueidentifier] PRIMARY KEY DEFAULT (newid()),
	[ROLE_CODE] [nvarchar](50) NOT NULL,
	[ROLE_NAME] [nvarchar](500) NOT NULL,
	[CREATE_BY] [nvarchar](100) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](500) NOT NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
)


CREATE TABLE [dbo].[SA_USER](
	[ROWGUID] [uniqueidentifier] PRIMARY KEY DEFAULT (newid()),
	[USER_NAME] [nvarchar](max) NOT NULL,
	[PASSWORD] [nvarchar](100) NULL,
	[ROLE_CODE] [nvarchar](100) NOT NULL,
	[FULLNAME] [nvarchar](50) NULL,
	[BIRTHDAY] [datetime] NULL,
	[ADDRESS] [nvarchar](500) NULL,
	[TELEPHONE] [nvarchar](50) NULL,
	[EMAIL] [nvarchar](max) NULL,
	[IS_ACTIVE] [bit] NOT NULL  DEFAULT (1),
	[REMARK] [nvarchar](max) NULL,
	[CREATE_BY] [nvarchar](100) NOT NULL,
	[CREATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
	[UPDATE_BY] [nvarchar](500) NOT NULL,
	[UPDATE_DATE] [datetime] NOT NULL DEFAULT (getdate()),
)

-- Foreign key for BS_CELL
ALTER TABLE [dbo].[BS_CELL]
ADD CONSTRAINT FK_BS_CELL_WAREHOUSE
FOREIGN KEY ([WAREHOUSE_CODE]) REFERENCES [dbo].[BS_WAREHOUSE]([WAREHOUSE_CODE]);

-- Foreign key for BS_CUSTOMER
ALTER TABLE [dbo].[BS_CUSTOMER]
ADD CONSTRAINT FK_BS_CUSTOMER_CUSTOMER_TYPE
FOREIGN KEY ([CUSTOMER_TYPE_CODE]) REFERENCES [dbo].[BS_CUSTOMER_TYPE]([CUSTOMER_TYPE_CODE]);

-- Foreign key for BS_EQUIPMENTS
ALTER TABLE [dbo].[BS_EQUIPMENTS]
ADD CONSTRAINT FK_BS_EQUIPMENTS_CELL
FOREIGN KEY (REF_ROWGUID) REFERENCES [dbo].[BS_CELL]([ROWGUID]);

ALTER TABLE [dbo].[BS_EQUIPMENTS]
ADD CONSTRAINT FK_BS_EQUIPMENTS_TYPE
FOREIGN KEY ([EQU_TYPE]) REFERENCES [dbo].[BS_EQUIPMENTS_TYPE]([EQU_TYPE]);


-- Foreign key for DT_CNTR_MNF_LD
ALTER TABLE [dbo].[DT_CNTR_MNF_LD]
ADD CONSTRAINT FK_DT_CNTR_MNF_LD_VESSEL_VISIT
FOREIGN KEY ([VOYAGEKEY]) REFERENCES [dbo].[DT_VESSEL_VISIT]([VOYAGEKEY]);

ALTER TABLE [dbo].[DT_CNTR_MNF_LD]
ADD CONSTRAINT FK_DT_CNTR_MNF_LD_ITEM_TYPE
FOREIGN KEY ([ITEM_TYPE_CODE]) REFERENCES [dbo].[BS_ITEM_TYPE]([ITEM_TYPE_CODE]);

-- Foreign key for DT_PACKAGE_MNF_LD
ALTER TABLE [dbo].[DT_PACKAGE_MNF_LD]
ADD CONSTRAINT FK_DT_PACKAGE_MNF_LD_CONTAINER
FOREIGN KEY ([REF_CONTAINER]) REFERENCES [dbo].[DT_CNTR_MNF_LD]([ROWGUID]);

ALTER TABLE [dbo].[DT_PACKAGE_MNF_LD]
ADD CONSTRAINT FK_DT_PACKAGE_MNF_LD_ITEM_TYPE
FOREIGN KEY ([ITEM_TYPE_CODE]) REFERENCES [dbo].[BS_ITEM_TYPE]([ITEM_TYPE_CODE]);

ALTER TABLE [dbo].[DT_PACKAGE_MNF_LD]
ADD CONSTRAINT FK_DT_PACKAGE_MNF_LD_UNIT
FOREIGN KEY ([UNIT_CODE]) REFERENCES [dbo].[BS_UNIT]([UNIT_CODE]);

-- Foreign key for DT_ORDER
ALTER TABLE [dbo].[DT_ORDER]
ADD CONSTRAINT FK_DT_ORDER_CONTAINER
FOREIGN KEY ([REF_CONTAINER]) REFERENCES [dbo].[DT_CNTR_MNF_LD]([ROWGUID]);

ALTER TABLE [dbo].[DT_ORDER]
ADD CONSTRAINT FK_DT_ORDER_CUSTOMER
FOREIGN KEY ([CUSTOMER_CODE]) REFERENCES [dbo].[BS_CUSTOMER]([CUSTOMER_CODE]);

ALTER TABLE [dbo].[DT_ORDER]
ADD CONSTRAINT FK_DT_ORDER_METHOD
FOREIGN KEY ([METHOD_CODE]) REFERENCES [dbo].[BS_METHOD]([METHOD_CODE]);

ALTER TABLE [dbo].[DT_ORDER]
ADD CONSTRAINT FK_DT_ORDER_DRAFT_NO
FOREIGN KEY ([DRAFT_NO]) REFERENCES [dbo].[INV_DFT]([DRAFT_INV_NO]);

ALTER TABLE [dbo].[DT_ORDER]
ADD CONSTRAINT FK_DT_ORDER_INV_NO
FOREIGN KEY ([INV_NO]) REFERENCES [dbo].[INV_VAT]([INV_NO]);

-- Foreign key for DT_ORDER_DTLS
ALTER TABLE [dbo].[DT_ORDER_DTLS]
ADD CONSTRAINT FK_DT_ORDER_DTLS_ORDER
FOREIGN KEY ([ORDER_NO]) REFERENCES [dbo].[DT_ORDER]([ORDER_NO]);

ALTER TABLE [dbo].[DT_ORDER_DTLS]
ADD CONSTRAINT FK_DT_ORDER_DTLS_PACKAGE
FOREIGN KEY ([REF_PAKAGE]) REFERENCES [dbo].[DT_PACKAGE_MNF_LD]([ROWGUID]);

-- Foreign key for DT_PACKAGE_STOCK
ALTER TABLE [dbo].[DT_PACKAGE_STOCK]
ADD CONSTRAINT FK_DT_PACKAGE_STOCK_VESSEL_VISIT
FOREIGN KEY ([VOYAGEKEY]) REFERENCES [dbo].[DT_VESSEL_VISIT]([VOYAGEKEY]);

ALTER TABLE [dbo].[DT_PACKAGE_STOCK]
ADD CONSTRAINT FK_DT_PACKAGE_STOCK_WAREHOUSE
FOREIGN KEY ([WAREHOUSE_CODE]) REFERENCES [dbo].[BS_WAREHOUSE]([WAREHOUSE_CODE]);

ALTER TABLE [dbo].[DT_PACKAGE_STOCK]
ADD CONSTRAINT FK_DT_PACKAGE_STOCK_ORDER
FOREIGN KEY ([ORDER_NO]) REFERENCES [dbo].[DT_ORDER]([ORDER_NO]);

-- Foreign key for DT_PALLET_STOCK
ALTER TABLE [dbo].[DT_PALLET_STOCK]
ADD CONSTRAINT FK_DT_PALLET_STOCK_STOCK
FOREIGN KEY ([REF_STOCK]) REFERENCES [dbo].[DT_PACKAGE_STOCK]([ROWGUID]);

ALTER TABLE [dbo].[DT_PALLET_STOCK]
ADD CONSTRAINT FK_DT_PALLET_STOCK_PALLET
FOREIGN KEY ([PALLET_NO]) REFERENCES [dbo].[JOB_QUANTITY_CHECK]([PALLET_NO]);

-- Foreign key for JOB_QUANTITY_CHECK
ALTER TABLE [dbo].[JOB_QUANTITY_CHECK]
ADD CONSTRAINT FK_JOB_QUANTITY_CHECK_GATE
FOREIGN KEY ([REF_GATE]) REFERENCES [dbo].[JOB_GATE]([ROWGUID]);

-- Foreign key for JOB_STOCK
ALTER TABLE [dbo].[JOB_STOCK]
ADD CONSTRAINT FK_JOB_STOCK_ORDER
FOREIGN KEY ([ORDER_NO]) REFERENCES [dbo].[DT_ORDER]([ORDER_NO]);

ALTER TABLE [dbo].[JOB_STOCK]
ADD CONSTRAINT FK_JOB_STOCK_PALLET
FOREIGN KEY ([PALLET_NO]) REFERENCES [dbo].[JOB_QUANTITY_CHECK]([PALLET_NO]);

ALTER TABLE [dbo].[JOB_STOCK]
ADD CONSTRAINT FK_JOB_STOCK_CELL
FOREIGN KEY ([REF_CELL]) REFERENCES [dbo].[BS_CELL]([ROWGUID]);

-- Foreign key for INV_DFT
ALTER TABLE [dbo].[INV_DFT]
ADD CONSTRAINT FK_INV_DFT_INV_VAT
FOREIGN KEY ([INV_NO]) REFERENCES [dbo].[INV_VAT]([INV_NO]);

-- Foreign key for INV_DFT_DTL
ALTER TABLE [dbo].[INV_DFT_DTL]
ADD CONSTRAINT FK_INV_DFT_DTL_DRAFT_INV
FOREIGN KEY ([DRAFT_INV_NO]) REFERENCES [dbo].[INV_DFT]([DRAFT_INV_NO]);

-- Foreign key for INV_VAT
ALTER TABLE [dbo].[INV_VAT]
ADD CONSTRAINT FK_INV_VAT_ORDER
FOREIGN KEY ([ORDER_NO]) REFERENCES [dbo].[DT_ORDER]([ORDER_NO]);

-- Foreign key for JOB_GATE
ALTER TABLE [dbo].[JOB_GATE]
ADD CONSTRAINT FK_JOB_GATE_ORDER
FOREIGN KEY ([ORDER_NO]) REFERENCES [dbo].[DT_ORDER]([ORDER_NO]);

ALTER TABLE [dbo].[JOB_GATE]
ADD CONSTRAINT FK_JOB_GATE_GATE
FOREIGN KEY ([GATE_CODE]) REFERENCES [dbo].[BS_GATE]([GATE_CODE]);

ALTER TABLE [dbo].[JOB_GATE]
ADD CONSTRAINT FK_JOB_GATE_WAREHOUSE
FOREIGN KEY ([WAREHOUSE_CODE]) REFERENCES [dbo].[BS_WAREHOUSE]([WAREHOUSE_CODE]);

-- Foreign key for TRF_STD
ALTER TABLE [dbo].[TRF_STD]
ADD CONSTRAINT FK_TRF_STD_METHOD
FOREIGN KEY ([METHOD_CODE]) REFERENCES [dbo].[BS_METHOD]([METHOD_CODE]);

ALTER TABLE [dbo].[TRF_STD]
ADD CONSTRAINT FK_TRF_STD_ITEM_TYPE
FOREIGN KEY ([ITEM_TYPE_CODE]) REFERENCES [dbo].[BS_ITEM_TYPE]([ITEM_TYPE_CODE]);

GO

INSERT INTO SA_ROLE (ROLE_CODE, ROLE_NAME,CREATE_BY,UPDATE_BY)
VALUES ('admin','Admin','sql','sql'),
('manager','Manager','sql','sql')

INSERT INTO SA_MENU (PARENT_CODE,MENU_CODE,MENU_NAME,MENU_ICON,IS_VISIBLE,ORDER_BY,VIEW_PAGE,CREATE_BY,UPDATE_BY)
VALUES 
(NULL,'user-manager',N'Quản lý người dùng','Users',1,100,NULL,'sql','sql'),
('user-manager','user',N'Người dùng',NULL,1,101,'User','sql','sql'),
('user-manager','permission',N'Phân quyền',NULL,1,102,'Permission','sql','sql'),
(NULL,'generic-list',N'Danh mục dùng chung','List',1,200,NULL,'sql','sql'),
('generic-list','warehouse-list',N'Danh mục kho',NULL,1,201,'WarehouseList','sql','sql'),
('generic-list','warehouse-design',N'Thiết kế kho',NULL,1,203,'WarehouseDesign','sql','sql'),
('generic-list','gate-list',N'Danh mục cổng',NULL,1,204,'GateList','sql','sql'),
('generic-list','equipment-group-list',N'Danh mục loại thiết bị',NULL,1,205,'EquipmentGroupList','sql','sql'),
('generic-list','equipment-list',N'Danh mục thiết bị',NULL,1,206,'EquipmentList','sql','sql'),
('generic-list','method-list',N'Danh mục phương án',NULL,1,207,'MethodList','sql','sql'),
('generic-list','product-group-list',N'Danh mục loại hàng hóa',NULL,1,208,'ProductGroupList','sql','sql'),
('generic-list','unit-list',N'Danh mục đơn vị tính',NULL,1,209,'UnitList','sql','sql'),
('generic-list','customer-group-list',N'Danh mục loại khách hàng',NULL,1,210,'CustomerGroupList','sql','sql'),
('generic-list','customer-list',N'Danh mục khách hàng',NULL,1,211,'CustomerList','sql','sql'),
('generic-list','tractor-list',N'Danh mục đầu kéo',NULL,1,212,'TractorList','sql','sql'),
('generic-list','trailer-list',N'Danh mục rơ-mooc',NULL,1,213,'TrailerList','sql','sql'),
(NULL,'input-data',N'Dữ liệu đầu vào','FolderInput',1,300,NULL,'sql','sql'),
('input-data','vessel-info',N'Thông tin tàu chuyến',NULL,1,301,'VesselInfo','sql','sql'),
('input-data','manifest-loading-list',N'Kê khai hàng hóa',NULL,1,302,'ManifestLoadingList','sql','sql'),
('input-data','good-manifest',N'Bảng kê danh mục hàng hóa',NULL,1,303,'GoodManifest','sql','sql')

INSERT INTO SA_PERMISSION (ROLE_CODE,MENU_CODE,IS_VIEW,IS_ADD_NEW,IS_MODIFY,IS_DELETE,CREATE_BY,UPDATE_BY)
VALUES 
('admin','user',1,1,1,1,'sql','sql'),
('admin','permission',1,1,1,1,'sql','sql'),
('admin','warehouse-list',1,1,1,1,'sql','sql'),
('admin','warehouse-design',1,1,1,1,'sql','sql'),
('admin','gate-list',1,1,1,1,'sql','sql'),
('manager','user',1,1,1,1,'sql','sql'),
('manager','permission',1,1,1,1,'sql','sql'),
('manager','warehouse-list',1,1,1,1,'sql','sql'),
('manager','warehouse-design',1,1,1,1,'sql','sql')

INSERT INTO SA_USER (ROLE_CODE, USER_NAME,CREATE_BY,UPDATE_BY)
VALUES ('admin','superadmin','sql','sql')



