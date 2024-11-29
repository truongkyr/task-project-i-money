import { ref } from "vue";
import { signOut } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { db } from "@/configs/firebase"; // Import database config
import { deleteDoc, doc } from "firebase/firestore";

const error = ref(null);

async function logout() {
  error.value = null;
  try {
    const auth = getAuth();
    const user = auth.currentUser; // Lấy người dùng hiện tại
    const userId = user.uid;

    // Xóa dữ liệu của người dùng khi đăng xuất
    const userDocRef = doc(db, `users/${userId}`);
    await deleteDoc(userDocRef);

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