export interface Vessel {
  VOYAGEKEY: string;
  VESSEL_NAME: string;
  INBOUND_VOYAGE: string;
  OUTBOUND_VOYAGE: string;
  ETA: Date;
  ETD: Date | string;
  CallSign: string;
  IMO: string;
  CREATE_BY?: string;
  CREATE_DATE?: Date;
  UPDATE_BY?: string;
  UPDATE_DATE?: Date;
}

export interface VesselList {
  insert: Vessel[];
  update: Vessel[];
}
