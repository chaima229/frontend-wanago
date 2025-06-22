import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from '@/config/firebase';

const storage = getStorage(app);

export const uploadImage = async (file: File, path: string): Promise<string> => {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
  
  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Une erreur est survenue lors du téléchargement de l'image.");
  }
}; 