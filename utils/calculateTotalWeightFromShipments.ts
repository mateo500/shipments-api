import { Shipment } from "../domain/shipment/entity";

const ALLOWED_CONVERSION_UNITS = ["KILOGRAMS", "POUNDS", "OUNCES"];

const conversionFunctions: Record<
  string,
  Record<string, (unit: number) => number>
> = {
  POUNDS: {
    KILOGRAMS: (pounds: number) => pounds / 2.2046,
    OUNCES: (pounds: number) => pounds * 16,
  },
  KILOGRAMS: {
    POUNDS: (kg: number) => kg * 2.2046,
    OUNCES: (kg: number) => kg * 35.274,
  },
  OUNCES: {
    KILOGRAMS: (ounces: number) => ounces / 35.274,
    POUNDS: (ounces: number) => ounces * 0.0625,
  },
};

export const calculateTotalWeightFromShipments = (
  shipments: Shipment[],
  desiredUnit: string
) => {
  if (!ALLOWED_CONVERSION_UNITS.includes(desiredUnit)) {
    throw new Error(
      `forbidden conversion unit, allowed units are ${ALLOWED_CONVERSION_UNITS.toString()}`
    );
  }

  let totalSum = 0;

  shipments.forEach((shipment) => {
    if (shipment.transportPacks.nodes.length > 0) {
      const weight = shipment.transportPacks.nodes.find(
        (node) => node.totalWeight
      );

      if (weight) {
        const unit = weight?.totalWeight.unit;
        const weightValue = weight?.totalWeight.weight;

        if (desiredUnit === unit) {
          totalSum = totalSum + parseInt(weightValue);
          return;
        }

        const conversionFunction = conversionFunctions[unit][desiredUnit];

        totalSum = totalSum + conversionFunction(parseInt(weightValue));
      }
    }
  });

  return totalSum.toFixed(2);
};
