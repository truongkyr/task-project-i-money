import { ref } from "vue";
import { getFirestore, collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { useUser } from "./useUser";

const useCollection = (name) => {
  const error = ref(null);
  const { user } = useUser();

  async function addRecord(record) {
    error.value = null;

    if (!user.value || !user.value.uid) {
      error.value = "User not logged in"; 
      return;
    }

    try {
      const firestore = getFirestore();
      const userId = user.value.uid;

      const colRef = collection(firestore, `users/${userId}/${name}`);
      const response = await addDoc(colRef, record);

      return response;
    } catch (err) {
      console.error("Error adding record:", err);
      error.value = err.message;
    }
  }

  // Cập nhật record
  async function updateRecord(recordId, updatedData) {
    error.value = null;

    if (!user.value || !user.value.uid) {
      error.value = "User not logged in"; 
      return;
    }

    try {
      const firestore = getFirestore();
      const userId = user.value.uid;

      const docRef = doc(firestore, `users/${userId}/${name}`, recordId);
      await updateDoc(docRef, updatedData);
    } catch (err) {
      console.error("Error updating record:", err);
      error.value = err.message;
    }
  }

  return { error, addRecord, updateRecord };
};

export default useCollection;
