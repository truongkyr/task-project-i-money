import { ref } from "vue";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useUser } from "./useUser";



const useStorage = (name) => {
  const error = ref(null);
  const filePath = ref(null);
  const url = ref(null);

  const { user } = useUser();

  async function uploadFile(file){
    filePath.value = `${name}/${user.value.uid}/${file.name}`;


    const storage = getStorage();
    const fileRef = storageRef(storage, filePath.value);

    try {
      const response = await uploadBytes(fileRef, file);
      url.value = await getDownloadURL(response.ref);

      return url.value;
    } catch (err) {
      console.log(err);
      error.value = err.message;
    }

  }
  return {
    error,
    filePath,
    url,
    uploadFile,
  }
}

export default useStorage;