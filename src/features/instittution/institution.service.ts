import type { CurrentUser } from "@/types/express";
import InstitutionRepository from "./institution.repository";
import type {
  CreateInstitution,
  GetInstitutionQueries,
  UpdateInstitution,
} from "./institution.validatior";

export default class InstitutionService {
  institutionRepository;
  constructor() {
    this.institutionRepository = new InstitutionRepository();
  }
  async createInstitution(payload: CreateInstitution) {
    const institution =
      await this.institutionRepository.createInstitution(payload);
    return institution;
  }

  async getInstitution(
    currentUser: CurrentUser,
    queries: GetInstitutionQueries,
  ) {
    const limit = Number(queries.limit) || 10;
    const page = Number(queries.page) || 1;
    const skip = (page - 1) * limit;

    let userId: number | undefined =
      currentUser.role == "superadmin" ? undefined : currentUser.userId;

    const institution = await this.institutionRepository.getInstitution(
      userId,
      queries.search,
      skip,
      limit,
    );
    return institution;
  }

  async getInstitutionDetail(params: string) {
    const institution = await this.institutionRepository.getInstitutionDetail(
      Number(params),
    );
    return institution;
  }

  async updateInstitution(institutionId: string, payload: UpdateInstitution) {
    const institutionDetail =
      await this.institutionRepository.getInstitutionDetail(
        Number(institutionId),
      );

    let newAddress = {
      ...JSON.parse(JSON.stringify(institutionDetail?.address)),
    };

    const institution = await this.institutionRepository.updateInstitution(
      Number(institutionId),

      {
        ...(payload.institutionName !== undefined && {
          institutionName: payload.institutionName,
        }),
        ...(payload.contactEmail !== undefined && {
          contactEmail: payload.contactEmail,
        }),
        ...(payload.contactPhone !== undefined && {
          contactPhone: payload.contactPhone,
        }),
        ...(payload.adminName !== undefined && {
          adminName: payload.adminName,
        }),
        ...(payload.adminEmail !== undefined && {
          adminEmail: payload.adminEmail,
        }),
        ...(payload.adminPhone !== undefined && {
          adminPhone: payload.adminPhone,
        }),
        ...(payload.logo !== undefined && {
          logo: payload.logo,
        }),
        ...(payload.isActive !== undefined && {
          isActive: payload.isActive,
        }),

        ...(payload.address !== undefined && {
          address: {
            line1: payload.address.line1 || newAddress?.line1 || null,
            line2: payload.address.line2 || newAddress?.line2 || null,
            city: payload.address.city || newAddress?.city || null,
            state: payload.address.state || newAddress?.state || null,
            country: payload.address.country || newAddress?.country || null,
            pinCode: payload.address.pinCode || newAddress?.pinCode || null,
          },
        }),

        ...(payload.comment !== undefined && {
          comment: payload.comment,
        }),
      },
    );
    return institution;
  }

  async deleteInstitution(params: string) {
    const institution = await this.institutionRepository.deleteInstitution(
      Number(params),
    );
    return institution;
  }
}
