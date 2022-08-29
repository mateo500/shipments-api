import { Shipment, TransportPacks } from "./entity";
import { ShipmentRepository } from "./repository";

export class ShipmentService {
  shipmentRepository: ShipmentRepository;

  constructor(shipmentRepository: ShipmentRepository) {
    this.shipmentRepository = shipmentRepository;
  }

  async create(
    referenceId: string,
    organizations: string[],
    estimatedTimeArrival: string | null,
    transportPacks: TransportPacks
  ): Promise<Shipment> {
    const organization = new Shipment(
      referenceId,
      organizations,
      estimatedTimeArrival,
      transportPacks
    );

    return this.shipmentRepository.save(organization);
  }

  async getShipmentById(shipmentReferenceId: string): Promise<Shipment | null> {
    return this.shipmentRepository.getById(shipmentReferenceId);
  }

  async getAllShipments(): Promise<Shipment[]> {
    return this.shipmentRepository.getAll();
  }
}
