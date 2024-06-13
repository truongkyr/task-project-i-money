import { ref } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export function useUser() {
  const user = ref(null);
  const auth = getAuth();

  onAuthStateChanged(auth, (_user) => {
    if (_user) {
      user.value = _user;
    } else {
      user.value = null;
    }
  });

  return {
    user
  };
}
