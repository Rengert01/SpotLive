interface PersonalInfo {
  first_name: string;
  last_name: string;
  maiden_name: string;
  middle_name: string;
  date_of_birth?: Date | undefined;
  work_email: string;
  gender: string;
  phone_number: string;
}

interface PersonalInformationProps {
  image?: string;
  email?: string;
  gender?: string;
  username?: string;
  phone?: string;
  country?: string;
  state?: string;
  date_of_birth?: date;
  city?: string;
  street?: string;
  id?: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PersonalInfoBoxProps {
  user: PersonalInformationProps;
}

interface addressSchemainterface {
  country?: string;
  city?: string;
  street?: string;
  state?: string;
}
