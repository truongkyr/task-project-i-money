import { onUnmounted, ref, watchEffect } from "vue";
import { db } from "@/configs/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useUser } from "./useUser";

export const useFirestore = (documentId) => {
    const data = ref(null);  // Lưu trữ dữ liệu nhận được từ Firestore
    const error = ref(null);  // Lưu trữ lỗi nếu có
    const { user } = useUser();  // Sử dụng user từ `useUser`

    const unsub = ref(null); // Lưu trữ hàm hủy đăng ký

    // Sử dụng watchEffect để theo dõi sự thay đổi của documentId và user
    watchEffect(() => {
        // Kiểm tra xem documentId và user có hợp lệ không
        if (!documentId || !user.value || !user.value.uid) return;

        const docRef = doc(db, `users/${user.value.uid}/data`, documentId);  // Tham chiếu tới document trong Firestore

        // Đăng ký lắng nghe dữ liệu thay đổi từ Firestore
        unsub.value = onSnapshot(
            docRef,
            (doc) => {
                if (doc.exists()) {
                    data.value = doc.data();  // Cập nhật dữ liệu nếu document tồn tại
                } else {
                    error.value = "Document does not exist";  // Nếu document không tồn tại
                }
            },
            (err) => {
                error.value = err.message;  // Cập nhật lỗi nếu có
            }
        );
    });

    // Hủy đăng ký khi component bị hủy
    onUnmounted(() => {
        if (unsub.value) {
            unsub.value();  // Gọi hàm hủy đăng ký khi component bị hủy
        }
    });

    return { data, error };
};
