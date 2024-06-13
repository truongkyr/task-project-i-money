import { ref } from "vue";
import { signOut } from "firebase/auth";
import { getAuth } from "firebase/auth";

const error = ref(null);

async function logout() {
  error.value = null;
  try {
    const auth = getAuth();
    const response = await signOut(auth);
    

    return response;

  } catch (err) {
    console.error(err);
    error.value = err.message;
  }
}

export function useLogout() {
  return {
    error,
    logout,
  };
}
