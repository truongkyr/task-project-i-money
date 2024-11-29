import { ref, onUnmounted } from "vue";  // Import onUnmounted để dọn dẹp khi không cần theo dõi trạng thái người dùng nữa
import { getAuth, onAuthStateChanged } from "firebase/auth";

export function useUser() {
  const user = ref(null);  // Đảm bảo rằng user là một ref để theo dõi thay đổi

  const auth = getAuth();  // Khởi tạo auth

  // Đăng ký lắng nghe trạng thái đăng nhập
  const unsubscribe = onAuthStateChanged(auth, (_user) => {
    if (_user) {
      console.log("User logged in:", _user.uid);
      user.value = _user;  // Lưu thông tin người dùng vào user
    } else {
      console.log("No user logged in");
      user.value = null;  // Nếu không có người dùng đăng nhập, set user thành null
    }
  });

  // Dọn dẹp khi không cần theo dõi trạng thái người dùng nữa
  onUnmounted(() => {
    unsubscribe();  // Hủy đăng ký lắng nghe khi component bị tháo gỡ
  });

  return {
    user  // Trả về `user` để các component có thể sử dụng
  };
}
