import { User } from './user.model';

export interface Doctor extends User {
  speciality: string;
  education: string;
  workPlace: string;
  position: string;
  workExperienceYears: number;
  awards: string;
  contactPhone: string;
  contactEmail: string;
  aboutMe: string;
  specializationDetails: string;
  workExperienceDetails: string;
  furtherTraining: string;
  achievementsAndAwards: string;
  scientificWorks: string;
  verified: boolean;
}