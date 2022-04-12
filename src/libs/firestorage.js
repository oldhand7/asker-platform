import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getUser } from 'libs/firebase'
import { trim } from 'libs/helper';

export const uploadCompanyFile = (companyId, file, type = '') => {
  return getUser()
    .then(async (user) => {
      const storage = await getStorage();

      const storageRef = ref(
        storage,
        `company-data/${companyId}${type ? '/' + trim(type, ' /') : ''}/${file.name}`
      );

      return uploadBytes(storageRef, file)
        .then(snapshot => getDownloadURL(snapshot.ref))
    })
}

export const uploadUserFile = (file, type = '') => {
  return getUser()
    .then(async (user) => {
      const storage = await getStorage();

      const storageRef = ref(
        storage,
        `users/${user.uid}${type ? '/' + trim(type, ' /') : ''}/${file.name}`
      );

      return uploadBytes(storageRef, file)
        .then(snapshot => getDownloadURL(snapshot.ref))
    })
}
