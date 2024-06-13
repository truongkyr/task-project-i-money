import { ref } from "vue";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const useCollection = (name) => {
    const error = ref(null);

    async function addRecord(record) {
        error.value = null;
        try {
            const firestore = getFirestore();
            const colRef = collection(firestore, name);
            const response = await addDoc(colRef, record);
            return response;
        } catch (err) {
            console.log(err);
            error.value = err.message;
        }
    }

    return { error, addRecord };
};

export default useCollection;
