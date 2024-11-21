<template>
  <div class="container mx-auto my-8 text-sm">
    <div class="flex justify-between items-center mb-4">
      <select
        v-model="selectedYear"
        class="border border-gray-400 px-4 py-2 rounded-lg"
      >
        <option v-for="year in availableYears" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
      <router-link
        :to="{ name: 'Report', params: {} }"
        class="p-3 rounded-xl border border-gray-300 hover:bg-primary hover:text-white hover:border-primary"
      >
        Xem biểu đồ
      </router-link>
    </div>
    <table class="w-full border-collapse">
      <thead>
        <tr class="bg-gray-200">
          <th class="border border-gray-400 px-4 py-2 w-1/12">Tháng</th>
          <th class="border border-gray-400 px-4 py-2 w-1/12">Ngày</th>
          <th class="border border-gray-400 px-4 py-2 w-2/12">
            Loại giao dịch
          </th>
          <th class="border border-gray-400 px-4 py-2 w-2/12">Danh mục</th>
          <th class="border border-gray-400 px-4 py-2 w-2/12">Chi tiêu</th>
          <th class="border border-gray-400 px-4 py-2 w-2/12">Thu nhập</th>
          <th class="border border-gray-400 px-4 py-2 w-2/12">Số dư</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="monthIndex in months" :key="monthIndex">
          <template
            v-for="(transaction, idx) in getTransactionsForMonth(monthIndex)"
            :key="`${monthIndex}-${idx}`"
          >
            <tr class="text-center align-top">
              <td
                class="border border-gray-400 px-4 py-2"
                :rowspan="getTransactionsForMonth(monthIndex).length"
                v-if="idx === 0"
              >
                Tháng {{ monthIndex }}
              </td>
              <td class="border border-gray-400 px-4 py-2">
                {{ formatDate(transaction.time) }}
              </td>
              <td class="border border-gray-400 px-4 py-2">
                {{ transaction.type }}
              </td>
              <td class="border border-gray-400 px-4 py-2">
                {{ transaction.category || "--" }}
              </td>
              <td class="border border-gray-400 px-4 py-2 text-red">
                {{
                  transaction.type === "Chi tiêu"
                    ? `- ${formatCurrency(transaction.total)}`
                    : "--"
                }}
              </td>
              <td class="border border-gray-400 px-4 py-2 text-primary">
                {{
                  transaction.type === "Thu nhập"
                    ? `+ ${formatCurrency(transaction.total)}`
                    : "--"
                }}
              </td>
              <td class="border border-gray-400 px-4 py-2">
                {{ formatCurrency(balanceByMonth[monthIndex] || 0) }}
              </td>
            </tr>
          </template>
          <tr
            v-if="getTransactionsForMonth(monthIndex).length === 0"
            class="text-center"
          >
            <td class="border border-gray-400 px-4 py-2">
              Tháng {{ monthIndex }}
            </td>
            <td class="border border-gray-400 px-4 py-2" colspan="5">--</td>
            <td class="border border-gray-400 px-4 py-2">
              {{ formatCurrency(balanceByMonth[monthIndex] || 0) }}
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot>
        <tr class="bg-gray-200 font-bold">
          <td class="border border-gray-400 px-4 py-2" colspan="6">
            Tổng cộng
          </td>
          <td class="border border-gray-400 px-4 py-2">
            {{ formatCurrency(totalBalance) }}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";

import { db } from "@/configs/firebase";

import { collection, getDocs } from "firebase/firestore";

export default {
  setup() {
    const months = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]); // Tạo danh sách tháng từ 1 đến 12

    const transactions = ref([]);

    const income = ref([]);

    const balanceByMonth = ref({});

    const selectedYear = ref(new Date().getFullYear().toString());

    const availableYears = ref([]);

    // Lấy dữ liệu từ Firestore

    const fetchData = async () => {
      const transactionCollection = collection(db, "transactions");

      const incomeCollection = collection(db, "income");

      const transactionSnapshot = await getDocs(transactionCollection);

      const incomeSnapshot = await getDocs(incomeCollection);

      transactions.value = transactionSnapshot.docs.map((doc) => ({
        id: doc.id,

        ...doc.data(),

        type: "Chi tiêu",

        time: doc.data().time || "",
      }));

      income.value = incomeSnapshot.docs.map((doc) => ({
        id: doc.id,

        ...doc.data(),

        type: "Thu nhập",

        time: doc.data().time || "",
      }));

      processTransactions();

      setAvailableYears();
    };

    // Lấy tất cả giao dịch của một tháng

    const getTransactionsForMonth = (monthIndex) => {
      const month = monthIndex.toString().padStart(2, "0");

      const expenses = transactions.value.filter(
        (t) =>
          getMonthFromTime(t.time) === month &&
          getYearFromTime(t.time) === selectedYear.value
      );

      const incomes = income.value.filter(
        (i) =>
          getMonthFromTime(i.time) === month &&
          getYearFromTime(i.time) === selectedYear.value
      );

      return [...expenses, ...incomes];
    };

    // Xử lý dữ liệu theo tháng

    const processTransactions = () => {
      const balance = {};

      // Duyệt qua tất cả 12 tháng

      months.value.forEach((monthIndex) => {
        const month = monthIndex.toString().padStart(2, "0");

        const expenses = transactions.value.filter(
          (t) =>
            getMonthFromTime(t.time) === month &&
            getYearFromTime(t.time) === selectedYear.value
        );

        const incomes = income.value.filter(
          (i) =>
            getMonthFromTime(i.time) === month &&
            getYearFromTime(i.time) === selectedYear.value
        );

        const totalExpenses = expenses.reduce(
          (sum, t) => sum + parseFloat(t.total || 0),
          0
        );

        const totalIncome = incomes.reduce(
          (sum, i) => sum + parseFloat(i.total || 0),
          0
        );

        balance[monthIndex] = totalIncome - totalExpenses;
      });

      balanceByMonth.value = balance;
    };

    const setAvailableYears = () => {
      const years = new Set();

      [...transactions.value, ...income.value].forEach((item) => {
        const year = getYearFromTime(item.time);

        if (year) years.add(year);
      });

      availableYears.value = Array.from(years).sort().reverse();
    };

    const getMonthFromTime = (time) => {
      if (!time) return "";

      const date = new Date(time);

      return isNaN(date.getTime()) ? "" : date.toISOString().slice(5, 7);
    };

    const getYearFromTime = (time) => {
      if (!time) return "";

      const date = new Date(time);

      return isNaN(date.getTime()) ? "" : date.getFullYear().toString();
    };

    const formatDate = (date) =>
      date ? new Date(date).toLocaleDateString("vi-VN") : "--";

    const totalBalance = computed(() => {
      return months.value.reduce((sum, month) => {
        return sum + (balanceByMonth.value[month] || 0);
      }, 0);
    });

    const formatCurrency = (value) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",

        currency: "VND",
      }).format(value);
    };

    onMounted(fetchData);

    watch(selectedYear, processTransactions);

    return {
      months,

      selectedYear,

      availableYears,

      getTransactionsForMonth,

      formatDate,

      formatCurrency,

      totalBalance,

      balanceByMonth,
    };
  },
};
</script>