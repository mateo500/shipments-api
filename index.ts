import { Organization } from "./domain/organization/entity";
import { OrganizationService } from "./domain/organization/service";
import { ShipmentService } from "./domain/shipment/service";
import { OrganizationInMemoryRepository } from "./infrastructure/repositories/organization/organizationInMemory.repository";
import { ShipmentInMemoryRepository } from "./infrastructure/repositories/shipment/shipmentInMemory.repository";
import { Request, Response } from "express";
import { calculateTotalWeightFromShipments } from "./utils/calculateTotalWeightFromShipments";

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
const port = 3000;

const shipmentService = new ShipmentService(new ShipmentInMemoryRepository());
const organizationService = new OrganizationService(
  new OrganizationInMemoryRepository()
);

app.post("/shipment", async (req: Request, res: Response) => {
  await shipmentService.create(
    req.body.referenceId,
    req.body.organizations,
    req.body.estimatedTimeArrival || null,
    req.body.transportPacks
  );

  res.sendStatus(201);
});

app.post("/organization", async (req: Request, res: Response) => {
  const existingOrg = await organizationService.getOrganizationById(
    req.body.id
  );

  //in case that the org already exist, we update the org name on the shipments that contain it.
  if (existingOrg) {
    const newOrgCreated = await organizationService.create(
      req.body.id,
      req.body.code
    );

    const shipments = await shipmentService.getAllShipments();

    const shipmentsToUpdateOrgName = shipments.filter((shipment) => {
      return shipment.organizations.includes(existingOrg.code);
    });

    for (const shipment of shipmentsToUpdateOrgName) {
      const newShipment = {
        ...shipment,
        organizations: shipment.organizations.map((orgName) =>
          orgName.replace(existingOrg.code, newOrgCreated.code)
        ),
      };

      await shipmentService.updateShipment(
        newShipment.referenceId,
        newShipment
      );
    }
  } else {
    await organizationService.create(req.body.id, req.body.code);
  }

  res.sendStatus(201);
});

app.get("/shipments/:referenceId", async (req: Request, res: Response) => {
  const shipment = await shipmentService.getShipmentById(
    req.params.referenceId
  );

  if (shipment === null) {
    return res.sendStatus(404);
  }

  const completeOrgsData: Organization[] = [];

  for (const org of shipment.organizations) {
    const orgFound = await organizationService.getOrganizationsByCode(org);

    if (orgFound !== null) {
      completeOrgsData.push(orgFound);
    }
  }

  res.status(200).send({ ...shipment, organizations: completeOrgsData });
});

app.get("/organizations/:id", async (req: Request, res: Response) => {
  const organization = await organizationService.getOrganizationById(
    req.params.id
  );

  if (organization === null) {
    return res.sendStatus(404);
  }

  res.status(200).send(organization);
});

app.get(
  "/weight-aggregation/:desiredUnit",
  async (req: Request, res: Response) => {
    const desiredUnit = req.params.desiredUnit;

    const shipments = await shipmentService.getAllShipments();

    try {
      const total = calculateTotalWeightFromShipments(shipments, desiredUnit);

      res.status(200).send({ totalWeight: total, unit: desiredUnit });
    } catch (error) {
      return res.status(400).send(error.toString());
    }
  }
);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
