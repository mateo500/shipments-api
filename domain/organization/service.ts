import { Organization } from "./entity";
import { OrganizationRepository } from "./repository";

export class OrganizationService {
  organizationRepository: OrganizationRepository;

  constructor(organizationRepository: OrganizationRepository) {
    this.organizationRepository = organizationRepository;
  }

  async create(id: string, code: string): Promise<Organization> {
    const organization = new Organization(id, code);

    return this.organizationRepository.save(organization);
  }

  async getOrganizationById(
    organizationId: string
  ): Promise<Organization | null> {
    return this.organizationRepository.getById(organizationId);
  }

  async getOrganizationsByCode(code: string): Promise<Organization | null> {
    return this.organizationRepository.getByCode(code);
  }
}
