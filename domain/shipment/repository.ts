import { Shipment } from "./entity";

export abstract class ShipmentRepository {
  public abstract save(shipment: Shipment): Promise<Shipment>;
  public abstract getById(shipmentId: string): Promise<Shipment | null>;
  public abstract getAll(): Promise<Shipment[]>;
}
