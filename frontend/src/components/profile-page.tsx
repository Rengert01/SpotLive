import AddressInfoBox from '@/components/profile/address-information';
import PasswordInfoBox from '@/components/profile/password-info-box';
import PersonalInfoBox from '@/components/profile/peronal-info-box';
import ProfileReusableLayout from '@/layout/ProfileReusableLayout';

export default function ProfilePage() {
  const user = {
    name: 'Joe',
    email: 'joeDoe@shshs.com',
  };
  const dummyProfileData = {
    profile: {
      profileCompletion: {
        completionPercentage: 75, // Example completion percentage
        checklist: {
          setupAccount: true,
          personalInformation: true,
          uploadPhoto: false,
          contactInformation: true,
          workInformation: false,
        },
      },
      personalInformation: {
        firstName: 'John',
        lastName: 'Doe',
        profilePicture:
          'https://res.cloudinary.com/dxib0srtu/image/upload/v1684077318/samples/people/boy-snow-hoodie.jpg', // Example URL
      },
    },
  };

  return (
    <ProfileReusableLayout user={user} profile={dummyProfileData?.profile}>
      <PersonalInfoBox />
      <AddressInfoBox />
      <PasswordInfoBox />
    </ProfileReusableLayout>
  );
}
