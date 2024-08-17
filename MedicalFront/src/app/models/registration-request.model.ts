// registration-request.model.ts

export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
}

export interface RegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string; // Typically in ISO format (YYYY-MM-DD)
  gender: Gender;
  city: string;
}
