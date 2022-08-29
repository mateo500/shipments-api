import { Shipment } from "../../../domain/shipment/entity";
import { ShipmentRepository } from "../../../domain/shipment/repository";

export class ShipmentInMemoryRepository implements ShipmentRepository {
  data: Shipment[] = [];

  public async save(shipment: Shipment): Promise<Shipment> {
    const shipmentIndex = this.data.findIndex(
      (ship) => ship.referenceId === shipment.referenceId
    );

    if (shipmentIndex === -1) {
      this.data.push(shipment);
    } else {
      this.data[shipmentIndex] = shipment;
    }

    return shipment;
  }

  public async getById(shipmentId: string): Promise<Shipment | null> {
    const shipment = this.data.find(
      (shipment) => shipment.referenceId === shipmentId
    );

    return shipment || null;
  }

  public async getAll(): Promise<Shipment[]> {
    return this.data;
  }

  public async update(shipmentId: string, data: Shipment): Promise<Shipment> {
    const shipmentIndex = this.data.findIndex(
      (ship) => ship.referenceId === shipmentId
    );

    this.data[shipmentIndex] = data;

    return this.data[shipmentIndex];
  }
}
