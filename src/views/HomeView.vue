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
        </div>
      </div>
    </div>

    <!-- Transaction days -->
    <div
      v-for="(transactions, date) in transactionsByDate"
      :key="date"
      class="border-x-4 rounded-lg mt-8"
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
      class="border-x-4 rounded-lg mt-8"
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
          <label class="block mb-2">
            <span class="text-gray-700">Tổng:</span>
            <input
              v-model="editForm.total"
              type="number"
              class="form-input mt-1 block w-full"
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
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export default {
  setup() {
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

    // Fetch data from Firestore
    const fetchData = async () => {
      const transactionCollection = collection(db, "transactions");
      const incomeCollection = collection(db, "income");

      const transactionSnapshot = await getDocs(transactionCollection);
      const incomeSnapshot = await getDocs(incomeCollection);

      transactions.value = transactionSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      income.value = incomeSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      calculateTotals();
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
    };

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
      const docRef = doc(db, deleteItemType.value, currentItem.value.id);
      await updateDoc(docRef, editForm.value);
      fetchData();
      isEditModalVisible.value = false;
    };

    const cancelEdit = () => {
      isEditModalVisible.value = false;
    };

    const onDeleteConfirm = async (id, type) => {
      const docRef = doc(db, type, id);
      await deleteDoc(docRef);
      fetchData();
      isDeleteModalVisible.value = false;
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

    onMounted(fetchData);

    watch(selectedMonth, fetchData);

    const transactionsByDate = computed(() => {
      const filteredTransactions = transactions.value.filter((transaction) => {
        const transactionMonth = new Date(transaction.time)
          .toISOString()
          .slice(0, 7);
        return transactionMonth === selectedMonth.value;
      });

      return filteredTransactions.reduce((acc, transaction) => {
        const date = new Date(transaction.time).toISOString().slice(0, 10);
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
        const date = new Date(incomeItem.time).toISOString().slice(0, 10);
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
    };
  },
};
</script>