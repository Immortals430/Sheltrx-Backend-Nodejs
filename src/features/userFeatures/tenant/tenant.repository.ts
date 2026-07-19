import { prisma } from "@/config/prisma";
import { UTCISOToYYYYMMDD, YYYYMMDDToUTCISO } from "@/lib/dateTime";
import { Prisma } from "generated/prisma/browser";
import type { Gender } from "generated/prisma/enums";

interface TenantDetail {
  gender: Gender;
  dob: string | undefined;
  profilePhoto: string | undefined;
  address:
    | {
        line1: string;
        line2?: string | undefined;
        city: string;
        state: string;
        country: string;
        pinCode: string;
      }
    | undefined;
  comment: string | undefined;
  localGuardianName: string | undefined;
  localGuardianPhone: string | undefined;
  localGuardianRelation: string | undefined;
  joiningDate: string;
  expectedExitDate: string | undefined;
}

interface GetDetailPayload {
  filters: Prisma.TenantWhereUniqueInput;
  include?: Prisma.TenantInclude | null;
}
export default class TenantRepository {
  async createTenant(
    userId: number,
    aadhaarId: number,
    tenantDetail: TenantDetail,
    tx: Prisma.TransactionClient,
  ) {
    return await (tx ?? prisma).tenant.create({
      data: {
        userId: userId,
        aadhaarId: aadhaarId,
        gender: tenantDetail.gender,
        dob: tenantDetail.dob ?? null,
        profilePhoto: tenantDetail.profilePhoto ?? null,
        address: tenantDetail.address ?? Prisma.DbNull,
        comment: tenantDetail.comment ?? null,
        localGuardianName: tenantDetail.localGuardianName ?? null,
        localGuardianPhone: tenantDetail.localGuardianPhone ?? null,
        localGuardianRelation: tenantDetail.localGuardianRelation ?? null,
        joiningDate: YYYYMMDDToUTCISO(tenantDetail.joiningDate),
        expectedExitDate: YYYYMMDDToUTCISO(tenantDetail.expectedExitDate ?? ""),
      },
    });
  }

  async getTenantDetail({ filters , include = null }: GetDetailPayload) {
    const tenant = await prisma.tenant.findUnique({
      where: filters,
      include,
    });

    if (!tenant) return null;

    return {
      ...tenant,
      joiningDate: UTCISOToYYYYMMDD(tenant.joiningDate),
      expectedExitDate: UTCISOToYYYYMMDD(tenant.expectedExitDate),
    };
  }
}
