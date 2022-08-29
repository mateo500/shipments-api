import { Organization } from "./entity";

export abstract class OrganizationRepository {
  public abstract save(organization: Organization): Promise<Organization>;
  public abstract getById(organizationId: string): Promise<Organization | null>;
  public abstract getByCode(code: string): Promise<Organization | null>;
}
