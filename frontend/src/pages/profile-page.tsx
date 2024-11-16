import AddressInfoBox from '@/components/profile/address-information';
import PasswordInfoBox from '@/components/profile/password-info-box';
import PersonalInfoBox from '@/components/profile/peronal-info-box';
import ProfileReusableLayout from '@/layout/ProfileReusableLayout';

export default function ProfilePage() {
  const user = localStorage.getItem('user');
  const userData: PersonalInformationProps = user ? JSON.parse(user) : null;

  return (
    <ProfileReusableLayout personalInformation={userData}>
      <>
        <PersonalInfoBox user={userData} />
        <AddressInfoBox user={userData} />
        <PasswordInfoBox user={userData} />
      </>
    </ProfileReusableLayout>
  );
}
