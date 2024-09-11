import { OrganizationTypes } from "./organization-types";

export interface Organization {
  organizationName: string;
  typeOfInstitution: OrganizationTypes;
  description: string;
  facilityCity: string;
  facilityAddress: string;
  phoneNumber: string;
  schedule: string;
  website: string;
  facilityEmailAddress: string;
  verified: boolean;
  [key: string]: any;
}
