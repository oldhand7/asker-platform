import AdminProfileForm from "./admin-profile-form";

const AdminProfileFormPreview = () => {
  const userApi = {
    user: {
      companyId: 'CompanyX'
    },
    updateProfile: () => alert('Profile updated'),
    getAvatar: () => 'https://placekitten.com/200/300',
    changePassword: () => alert('Password changed'),
    changeEmail: () => alert('Email changed')
  }

  const firestorageApi = {
    uploadCompanyFile: (companyId, file, type) => { alert('Company file uploaded'); return DemoAvatar.src; },
    uploadUserFile: (file, type) => { alert('User file uploaded'); return DemoAvatar.src; }
  }

  return <AdminProfileForm firestorageApi={firestorageApi} userApi={userApi} />
}

export default AdminProfileFormPreview;