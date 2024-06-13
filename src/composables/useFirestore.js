// import { onUnmounted, ref, watchEffect } from "vue";
// import { db } from "@/configs/firebase";
// import { doc, onSnapshot } from "firebase/firestore";

// export const useFirestore = (collection, id) => {
//   const data = ref(null);
//   const error = ref(null);

//   watchEffect(() => {
//     if (!id) return;

//     const docRef = doc(db, collection, id);

//     const unsub = onSnapshot(
//       docRef,
//       (doc) => {
//         if (doc.exists()) {
//           data.value = doc.data();
//         } else {
//           error.value = "Document does not exist";
//         }
//       },
//       (err) => {
//         error.value = err.message;
//       }
//     );

//     onUnmounted(unsub);
//   });

//   return { data, error };
// };
