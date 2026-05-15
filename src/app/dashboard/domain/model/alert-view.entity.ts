export class AlertView {
  private _id: string;
  private _createdAt: string;
  private _equipmentId: string;
  private _siteId: string;
  private _severity: string;
  private _status: string;
  private _equipmentName: string;
  private _siteName: string;

  constructor(props: {
    id: string;
    createdAt: string;
    equipmentId: string;
    siteId: string;
    severity: string;
    status: string;
    equipmentName?: string;
    siteName?: string;
  }) {
    this._id = props.id;
    this._createdAt = props.createdAt;
    this._equipmentId = props.equipmentId;
    this._siteId = props.siteId;
    this._severity = props.severity;
    this._status = props.status;
    this._equipmentName = props.equipmentName || props.equipmentId || '-';
    this._siteName = props.siteName || props.siteId || '-';
  }

  get id(): string { return this._id; }
  get createdAt(): string { return this._createdAt; }
  get equipmentId(): string { return this._equipmentId; }
  get siteId(): string { return this._siteId; }
  get severity(): string { return this._severity; }
  get status(): string { return this._status; }
  get equipmentName(): string { return this._equipmentName; }
  get siteName(): string { return this._siteName; }

}
