import { ref } from "vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getAuth } from "firebase/auth";

const error = ref(null);
const isPending = ref(false);

async function signin(email, password) {
  error.value = null;
  isPending.value = true;
  try {
    const auth = getAuth();
    const response = await signInWithEmailAndPassword(auth, email, password);
    
    console.log("Signed in user:", response.user);

    return response;

  } catch (err) {
    console.error(err);
    error.value = err.message;
  } finally {
    isPending.value = false;
  }
}

export function useSignIn() {
  return {
    error,
    isPending,
    signin,
  };
}
