export class EquipmentsEntity {
  constructor(
    public id: string,
    public equipmentId: string,
    public name: string,
    public model: string,
    public type: string,
    public serial: string,
    public status: string,
    public manufacturer: string,
    public installed: string,
    public lastSeen: string,
    public setPoint: number,
    public online: boolean,
    public currentTemperature: number | null,
    public created: string,
    public updated: string
  ) {}
}
