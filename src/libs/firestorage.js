import { getStorage as getStorage1, ref, uploadBytes, getDownloadURL, deleteObject, connectStorageEmulator } from "firebase/storage";
import { getUser } from 'libs/firebase/auth'
import { trim } from 'libs/helper';

const getStorage = () => {
  const storage = getStorage1();

  if (process.env['NEXT_PUBLIC_FIREBASE_STORAGE_EMULATOR_HOST']) {
    const parts = process.env['NEXT_PUBLIC_FIREBASE_STORAGE_EMULATOR_HOST'].split(':');
    connectStorageEmulator(storage, ...parts);
  }

  return storage;
}

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
        .catch(error => alert(error.message))
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

//This never used
export const deleteFile = async (file) => {
  const storage = await getStorage();
  const fileRef =  ref(storage, file.url)

  return deleteObject(fileRef)
}
