import { ref } from "vue";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getAuth } from "firebase/auth";

const error = ref(null);
const isPending = ref(false);

async function signup(email, password, fullName) {
  error.value = null;
  isPending.value = true;
  try {
    const auth = getAuth();
    const response = await createUserWithEmailAndPassword(auth, email, password);

    if (!response) {
      throw new Error("Could not create new user.");
    }

    await updateProfile(response.user, { displayName: fullName });

    console.log("User after profile update:", response.user);

    return response;

  } catch (err) {
    console.log(err);
    error.value = err.message;

  } finally {
    isPending.value = false;
  }
}

export function useSignUp() {
  return {
    error,
    isPending,
    signup,
  };
}
