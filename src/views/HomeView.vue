<template>
  <div>
    <!-- Transaction, Income Table -->
    <div class="row">
      <div class="bg-primary py-4 rounded-lg border-x-4">
        <div class="container mx-auto px-4">
          <div class="row">
            <div class="flex pb-2">
              <input
                type="month"
                class="rounded-lg bg-primary text-white"
                v-model="selectedMonth"
              />
            </div>
          </div>
          <div class="row">
            <label for="surplus" class="flex">
              <div class="text-right leading-10 mr-4 pb-1">
                <span class="px-1 text-white text-3xl font-bold">
                  Số dư: {{ formatCurrency(funds) }}
                </span>
              </div>
            </label>
          </div>
          <div class="row">
            <label for="transaction" class="flex">
              <div class="text-right leading-10 mr-4 pb-1">
                <span class="px-1 text-white text-base font-bold">
                  Chi tiêu: - {{ formatCurrency(totalExpenses) }}
                </span>
              </div>
            </label>
          </div>
          <div class="row">
            <label for="transaction" class="flex">
              <div class="text-right leading-10 mr-4 pb-1">
                <span class="px-1 text-white text-base font-bold">
                  Thu nhập: + {{ formatCurrency(totalIncome) }}
                </span>
              </div>
            </label>
          </div>
          <div class="row">
            <label for="expense_desire" class="py-2">
              <div class="leading-10 pb-1 flex items-center">
                <span class="text-white text-base font-bold px-1 width-response"
                  >Mức chi tiêu quy định:</span
                >
                <div v-if="isEditingExpense" class="flex">
                  <input
                    class="mx-4 rounded-xl text-red px-2 input-money"
                    type="text"
                    id="expense_desire"
                    v-model="expense_desire"
                    placeholder="Nhập số tiền ..."
                    @input="formatExpenseInput"
                  />
                  <button
                    class="font-semibold text-red bg-white px-3 rounded-xl mx-1"
                    type="button"
                    @click="submitExpenseDeriseCompare"
                  >
                    Thêm
                  </button>
                </div>
                <div v-else class="flex items-center w-full">
                  <span class="mx-4 rounded-xl text-red font-bold">
                    {{ formatCurrency(onSubmitExpense) }}
                  </span>
                  <button
                    class="font-semibold text-white bg-red px-2 rounded-xl mx-1 edit-front"
                    type="button"
                    @click="editExpense"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    class="font-semibold text-white bg-gray-500 px-2 rounded-xl mx-1"
                    type="button"
                    @click="deleteExpense"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
      <div class="row flex justify-center">
        <div
          v-if="warning"
          class="text-dark font-bold p-4 mt-6 w-1/2 text-center bg-yellow-500 warning-animation"
        >
          {{ warning }}
        </div>
      </div>
    </div>

    <!-- Transaction days -->
    <div
      v-for="(transactions, date) in transactionsByDate"
      :key="date"
      class="border-x-4 rounded-lg mt-6"
    >
      <div class="row">
        <div class="bg-gray-600 rounded-t-lg">
          <div class="container mx-auto px-8">
            <div class="row">
              <label for="surplus" class="font-semibold flex justify-between">
                <div class="text-right leading-10 pb-1 text-gray-300 flex">
                  <span class="px-1 text-xs font-bold">{{ date }}</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="bg-gray-200 py-4 rounded-b-lg">
          <div class="container mx-auto px-8">
            <div
              v-for="transaction in transactions"
              :key="transaction.id"
              class="row border-b border-gray-400"
            >
              <label for="surplus" class="font-semibold">
                <div
                  class="text-right leading-10 pb-1 text-dark flex justify-between"
                >
                  <span class="px-1 text-xs font-bold py-4">{{
                    transaction.category
                  }}</span>
                  <span class="px-1 text-xs font-bold py-4 text-orange-500"
                    >-{{ formatCurrency(transaction.total) }}</span
                  >
                  <div class="text-right leading-10 text-gray-500">
                    <span
                      class="px-1 text-xs font-bold"
                      @click="onEdit(transaction, 'transactions')"
                    >
                      <i class="fa-solid fa-pen"></i>
                    </span>
                    <span
                      class="px-1 text-xs font-bold"
                      @click.stop="onDelete(transaction.id, 'transactions')"
                    >
                      <i class="fa-regular fa-trash-can"></i>
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Income -->
    <div
      v-for="(income, date) in incomeByDate"
      :key="date"
      class="border-x-4 rounded-lg mt-6"
    >
      <div class="row">
        <div class="bg-gray-400 rounded-t-lg">
          <div class="container mx-auto px-8">
            <div class="row">
              <label for="surplus" class="font-semibold">
                <div
                  class="text-right leading-10 pb-1 text-dark flex justify-between"
                >
                  <span class="px-1 text-xs font-bold">{{ date }}</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="bg-orange-300 py-4 rounded-b-lg">
          <div class="container mx-auto px-8">
            <div
              v-for="incomeItem in income"
              :key="incomeItem.id"
              class="row border-b border-gray-400"
            >
              <label for="surplus" class="font-semibold">
                <div
                  class="text-right leading-10 pb-1 text-dark flex justify-between"
                >
                  <span class="px-1 text-xs font-bold py-4">{{
                    incomeItem.category
                  }}</span>
                  <span class="px-1 text-xs font-bold py-4 text-primary"
                    >+{{ formatCurrency(incomeItem.total) }}</span
                  >
                  <div class="text-right leading-10 text-gray-600">
                    <span
                      class="px-1 text-xs font-bold"
                      @click="onEdit(incomeItem, 'income')"
                    >
                      <i class="fa-solid fa-pen"></i>
                    </span>
                    <span
                      class="px-1 text-xs font-bold"
                      @click.stop="onDelete(incomeItem.id, 'income')"
                    >
                      <i class="fa-regular fa-trash-can"></i>
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div
        v-if="isEditModalVisible"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="bg-white p-4 rounded-lg">
          <h2 class="text-lg font-semibold mb-4">Chỉnh sửa mục</h2>
          <label class="block mb-2">
            <span class="text-gray-700">Loại:</span>
            <input
              v-model="editForm.category"
              type="text"
              class="form-input mt-1 block w-full"
            />
          </label>
          <!-- Modal Chỉnh sửa -->
          <label class="block mb-2">
            <span class="text-gray-700">Tổng:</span>
            <input
              v-model="editForm.total"
              type="text"
              class="form-input mt-1 block w-full"
              @input="formatInputNumber($event)"
              @blur="saveFormattedValue"
            />
          </label>

          <label class="block mb-2">
            <span class="text-gray-700">Thời gian:</span>
            <input
              v-model="editForm.time"
              type="datetime-local"
              class="form-input mt-1 block w-full"
            />
          </label>
          <div class="flex justify-end">
            <button
              @click="saveEdit"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
            >
              Lưu
            </button>
            <button
              @click="cancelEdit"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Modal -->
      <div
        v-if="isDeleteModalVisible"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="bg-white p-4 rounded-lg">
          <h2 class="text-lg font-semibold mb-4">Xác nhận xóa</h2>
          <p>Bạn có chắc muốn xóa mục này không ?</p>
          <div class="flex justify-end mt-4">
            <button
              @click="onDeleteConfirm(deleteItemId, deleteItemType)"
              class="px-4 py-2 bg-red-500 text-primary rounded hover:bg-red-600 mr-2"
            >
              Xác nhận
            </button>
            <button
              @click="onDeleteCancel"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from "vue";
import { db } from "@/configs/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore"; // Thêm các import bị thiếu
import { useUser } from "@/composables/useUser"; // Đảm bảo đúng đường dẫn
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { EventBus } from "@/composables/evenBus.js";

export default {
  setup() {
    const expense_desire = ref("");
    const onSubmitExpense = ref("");
    const isEditingExpense = ref(true);

    const isEditModalVisible = ref(false);
    const isDeleteModalVisible = ref(false);
    const deleteItemId = ref(null);
    const deleteItemType = ref("");
    const currentItem = ref(null);
    const editForm = ref({});
    const selectedMonth = ref(new Date().toISOString().slice(0, 7));
    const funds = ref(0);
    const transactions = ref([]);
    const income = ref([]);
    const totalExpenses = ref(0);
    const totalIncome = ref(0);

    const warning = ref("");

    // Lấy user từ useUser
    const { user } = useUser(); // Sử dụng useUser để lấy user đang đăng nhập

    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        // Nếu người dùng đã đăng nhập, gán thông tin người dùng
        console.log("Người dùng đăng nhập:", user.uid);
        user.value = user; // Cập nhật user.value nếu sử dụng Vue Reactive
        fetchData(); // Gọi fetchData sau khi người dùng đã đăng nhập
      } else {
        console.log("Người dùng chưa đăng nhập");
        user.value = null; // Reset user.value nếu người dùng chưa đăng nhập
      }
    });

    const formatExpenseInput = (event) => {
      let rawValue = event.target.value.replace(/\./g, ""); // Loại bỏ dấu chấm khi nhập
      expense_desire.value = formatNumber(rawValue); // Định dạng lại với dấu chấm
    };

    const formatInputNumber = (event) => {
      let rawValue = event.target.value.replace(/\./g, ""); // Loại bỏ dấu chấm khi người dùng nhập
      editForm.value.total = formatNumber(rawValue); // Định dạng lại giá trị sau khi nhập
    };
    const saveFormattedValue = () => {
      console.log("Trước khi xử lý:", editForm.value.total);
      if (!editForm.value.total) {
        editForm.value.total = ""; // Đảm bảo không bị undefined hoặc null
        return;
      }
      const rawValue = String(editForm.value.total).replace(/\./g, ""); // Chuyển đổi sang chuỗi và loại bỏ dấu chấm
      editForm.value.total = parseFloat(rawValue) || 0; // Chuyển về số thực hoặc đặt mặc định là 0
      console.log("Sau khi xử lý:", editForm.value.total);
    };

    // Hàm định dạng số với dấu phân cách chấm
    const formatNumber = (value) => {
      if (!value) return "";
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Định dạng với dấu chấm phân cách
    };

    // Fetch data from Firestore
    const fetchData = async () => {
      if (!user.value || !user.value.uid) {
        console.error("Người dùng chưa đăng nhập!");
        return;
      }
      const userId = user.value.uid;

      try {
        const transactionSnapshot = await getDocs(
          collection(db, `users/${userId}/transactions`)
        );
        const incomeSnapshot = await getDocs(
          collection(db, `users/${userId}/income`)
        );

        transactions.value = transactionSnapshot.docs.map((doc) => {
          const data = doc.data();
          const time =
            data.time && data.time.toDate
              ? data.time.toDate().toISOString()
              : data.time;
          return { id: doc.id, ...data, time };
        });

        income.value = incomeSnapshot.docs.map((doc) => {
          const data = doc.data();
          const time =
            data.time && data.time.toDate
              ? data.time.toDate().toISOString()
              : data.time;
          return { id: doc.id, ...data, time };
        });

        calculateTotals(); // Đảm bảo tính toán lại tổng sau khi lấy dữ liệu
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    const calculateTotals = () => {
      const filteredTransactions = transactions.value.filter((transaction) => {
        const transactionMonth = new Date(transaction.time)
          .toISOString()
          .slice(0, 7);
        return transactionMonth === selectedMonth.value;
      });

      const filteredIncome = income.value.filter((incomeItem) => {
        const incomeMonth = new Date(incomeItem.time).toISOString().slice(0, 7);
        return incomeMonth === selectedMonth.value;
      });

      totalExpenses.value = filteredTransactions.reduce(
        (sum, transaction) => sum + parseFloat(transaction.total),
        0
      );
      totalIncome.value = filteredIncome.reduce(
        (sum, incomeItem) => sum + parseFloat(incomeItem.total),
        0
      );

      funds.value = totalIncome.value - totalExpenses.value;
      checkExpenseWarning(); // Kiểm tra cảnh báo khi tính toán xong
    };

    const checkExpenseWarning = () => {
      if (
        onSubmitExpense.value &&
        totalExpenses.value >= parseFloat(onSubmitExpense.value)
      ) {
        warning.value =
          "Cảnh báo !!!: Bạn đã chi tiêu vượt mức quy định cho tháng này !!!";
      } else {
        warning.value = "";
      }
    };

    const submitExpenseDeriseCompare = () => {
      const monthKey = selectedMonth.value;

      if (funds.value === 0) {
        warning.value =
          "Cảnh báo: Số dư phải lớn hơn 0 để nhập mức chi tiêu quy định!";
      } else if (expense_desire.value) {
        // Loại bỏ dấu phân cách và chuyển thành số thực
        const rawValue = expense_desire.value.replace(/\./g, "");
        onSubmitExpense.value = parseFloat(rawValue); // Lưu dưới dạng số thực

        isEditingExpense.value = false;
        warning.value = "";

        // Lưu mức chi tiêu theo tháng vào LocalStorage
        const expenseData =
          JSON.parse(localStorage.getItem("expense_desire_data")) || {};
        expenseData[monthKey] = expense_desire.value;
        localStorage.setItem(
          "expense_desire_data",
          JSON.stringify(expenseData)
        );

        checkExpenseWarning(); // Kiểm tra cảnh báo
      }
    };

    const editExpense = () => {
      isEditingExpense.value = true;
    };

    const deleteExpense = () => {
      const monthKey = selectedMonth.value;
      let expenseData =
        JSON.parse(localStorage.getItem("expense_desire_data")) || {};

      if (expenseData[monthKey]) {
        delete expenseData[monthKey]; // Xóa dữ liệu của tháng hiện tại
        localStorage.setItem(
          "expense_desire_data",
          JSON.stringify(expenseData)
        );

        expense_desire.value = "";
        onSubmitExpense.value = "";
        isEditingExpense.value = true;
        warning.value = "";
      }

      fetchExpense();
    };

    const fetchExpense = () => {
      const monthKey = selectedMonth.value;
      const expenseData =
        JSON.parse(localStorage.getItem("expense_desire_data")) || {};

      if (expenseData[monthKey]) {
        onSubmitExpense.value = expenseData[monthKey];
        isEditingExpense.value = false;
      } else {
        onSubmitExpense.value = "";
        isEditingExpense.value = true;
      }
    };

    onMounted(() => {
      fetchData();
      fetchExpense();
    });

    watch(selectedMonth, () => {
      fetchData(); // Fetch lại dữ liệu khi tháng thay đổi
      fetchExpense(); // Lấy dữ liệu mức chi tiêu quy định khi tháng thay đổi
      checkExpenseWarning(); // Kiểm tra cảnh báo sau khi dữ liệu thay đổi
    });

    // Đảm bảo các hàm được sử dụng đúng
    const onEdit = (item, type) => {
      currentItem.value = item;
      editForm.value = { ...item };
      deleteItemType.value = type;
      isEditModalVisible.value = true;
    };

    const onDelete = (id, type) => {
      deleteItemId.value = id;
      deleteItemType.value = type;
      isDeleteModalVisible.value = true;
    };

    const saveEdit = async () => {
      if (!user.value || !user.value.uid) {
        console.error("Người dùng chưa đăng nhập!");
        return;
      }

      const userId = user.value.uid;
      const collectionPath = `users/${userId}/${deleteItemType.value}`; // Tạo đường dẫn đầy đủ

      try {
        const docRef = doc(db, collectionPath, currentItem.value.id);
        await updateDoc(docRef, {
          category: editForm.value.category,
          total: parseFloat(editForm.value.total), // Chuyển đổi số
          time: new Date(editForm.value.time), // Đảm bảo đúng kiểu thời gian
        });

        // Gọi lại fetchData trong PieChart để làm mới biểu đồ
        await fetchData(); // Gọi lại hàm fetchData trong PieChart

        isEditModalVisible.value = false; // Đóng modal chỉnh sửa
        EventBus.event = "data-updated";
      } catch (error) {
        console.error("Lỗi khi cập nhật dữ liệu:", error);
      }
    };

    const cancelEdit = () => {
      isEditModalVisible.value = false;
    };

    const onDeleteConfirm = async (id, type) => {
      if (!user.value || !user.value.uid) {
        console.error("Người dùng chưa đăng nhập!");
        return;
      }

      const userId = user.value.uid;
      const collectionPath = `users/${userId}/${type}`; // Tạo đường dẫn đầy đủ

      try {
        const docRef = doc(db, collectionPath, id);
        await deleteDoc(docRef); // Xóa tài liệu từ Firestore
        await fetchData(); // Cập nhật dữ liệu
        isDeleteModalVisible.value = false; // Đóng modal xóa
      } catch (error) {
        console.error("Lỗi khi xóa dữ liệu:", error);
      }
    };

    const onDeleteCancel = () => {
      isDeleteModalVisible.value = false;
    };

    const formatCurrency = (value) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    };

    const transactionsByDate = computed(() => {
      const filteredTransactions = transactions.value.filter((transaction) => {
        const transactionMonth = new Date(transaction.time)
          .toISOString()
          .slice(0, 7);
        return transactionMonth === selectedMonth.value;
      });

      return filteredTransactions.reduce((acc, transaction) => {
        const date = new Date(transaction.time).toISOString().slice(0, 10); // Đảm bảo định dạng ngày đúng
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(transaction);
        return acc;
      }, {});
    });

    const incomeByDate = computed(() => {
      const filteredIncome = income.value.filter((incomeItem) => {
        const incomeMonth = new Date(incomeItem.time).toISOString().slice(0, 7);
        return incomeMonth === selectedMonth.value;
      });

      return filteredIncome.reduce((acc, incomeItem) => {
        const date = new Date(incomeItem.time).toISOString().slice(0, 10); // Đảm bảo định dạng ngày đúng
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(incomeItem);
        return acc;
      }, {});
    });

    return {
      isEditModalVisible,
      isDeleteModalVisible,
      deleteItemId,
      deleteItemType,
      currentItem,
      editForm,
      selectedMonth,
      funds,
      transactions,
      income,
      totalExpenses,
      totalIncome,
      onEdit,
      onDelete,
      saveEdit,
      cancelEdit,
      onDeleteConfirm,
      onDeleteCancel,
      formatCurrency,
      transactionsByDate,
      incomeByDate,
      expense_desire,
      onSubmitExpense,
      isEditingExpense,
      submitExpenseDeriseCompare,
      editExpense,
      warning,
      deleteExpense,
      formatExpenseInput,
      formatInputNumber,
      saveFormattedValue,
    };
  },
};
</script>


<style scoped>
.width-response {
  width: 220px;
}
@media screen and (min-width: 430px) {
  .input-money {
    margin: 0;
  }
}
@media screen and (min-width: 412px) {
  .input-money {
    margin: 0;
    width: 90%;
  }
}
@media screen and (min-width: 375px) {
  .input-money {
    margin: 0;
    width: 90%;
  }
}
@media screen and (min-width: 360px) {
  .input-money {
    margin: 0;
    width: 90%;
  }
  .edit-front {
    width: 60px;
    padding: 2px;
    font-size: 12px;
  }
}
@media screen and (min-width: 1024px) {
  .edit-front {
    font-size: 16px;
    width: 100px;
    padding: 0;
  }
}

.warning-animation {
  animation: shake 1s ease-in-out infinite;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateY(10px);
  }
  50% {
    transform: translateX(10px);
    transform: translateY(-10px);
  }
  75% {
    transform: translateX(-10px);
  }
  100% {
    transform: translateX(0);
    transform: translateY(0);
  }
}
</style>