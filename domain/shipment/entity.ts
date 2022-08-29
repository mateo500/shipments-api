export interface TransportPacks {
  nodes: { totalWeight: { weight: string; unit: string } }[];
}

export class Shipment {
  referenceId: string;
  organizations: string[];
  estimatedTimeArrival: string | null;
  transportPacks: TransportPacks;

  constructor(
    referenceId: string,
    organizations: string[],
    estimatedTimeArrival: string | null,
    transportPacks: TransportPacks
  ) {
    this.referenceId = referenceId;
    this.organizations = organizations;
    this.estimatedTimeArrival = estimatedTimeArrival;
    this.transportPacks = transportPacks;
  }
}
