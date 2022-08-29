import { Organization } from "../../../domain/organization/entity";
import { OrganizationRepository } from "../../../domain/organization/repository";

export class OrganizationInMemoryRepository implements OrganizationRepository {
  data: Organization[] = [];

  public async save(organization: Organization): Promise<Organization> {
    const orgIndex = this.data.findIndex((org) => org.id === organization.id);

    if (orgIndex === -1) {
      this.data.push(organization);
    } else {
      this.data[orgIndex] = organization;
    }

    return organization;
  }
  public async getById(organizationId: string): Promise<Organization | null> {
    const org = this.data.find((org) => org.id === organizationId);

    return org || null;
  }

  public async getByCode(code: string): Promise<Organization | null> {
    const org = this.data.find((org) => org.code === code);

    return org || null;
  }
}
