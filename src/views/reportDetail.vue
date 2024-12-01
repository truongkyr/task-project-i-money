<template>
  <div class="container mx-auto my-8 text-sm">
    <!-- Chọn năm -->
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

    <!-- Bảng -->
    <div class="overflow-x-auto">
      <table class="w-full table-auto border-collapse">
        <thead>
          <tr class="bg-gray-200">
            <th
              class="border border-gray-400 px-4 py-2 text-xs sm:text-sm w-1/12"
            >
              Tháng
            </th>
            <th
              class="border border-gray-400 px-4 py-2 text-xs sm:text-sm w-1/12"
            >
              Ngày
            </th>
            <th
              class="border border-gray-400 px-4 py-2 text-xs sm:text-sm w-2/12"
            >
              Loại giao dịch
            </th>
            <th
              class="border border-gray-400 px-4 py-2 text-xs sm:text-sm w-2/12"
            >
              Danh mục
            </th>
            <th
              class="border border-gray-400 px-4 py-2 text-xs sm:text-sm w-2/12"
            >
              Chi tiêu
            </th>
            <th
              class="border border-gray-400 px-4 py-2 text-xs sm:text-sm w-2/12"
            >
              Thu nhập
            </th>
            <th
              class="border border-gray-400 px-4 py-2 text-xs sm:text-sm w-2/12"
            >
              Số dư
            </th>
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
                    "Chi tiêu" === transaction.type
                      ? `- ${formatCurrency(transaction.total)}`
                      : "--"
                  }}
                </td>
                <td class="border border-gray-400 px-4 py-2 text-primary">
                  {{
                    "Thu nhập" === transaction.type
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
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import { db } from "@/configs/firebase";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default {
  setup() {
    const loading = ref(true);
    const months = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const transactions = ref([]);
    const income = ref([]);
    const balanceByMonth = ref({});
    const selectedYear = ref(new Date().getFullYear().toString());
    const availableYears = ref([]);
    //const transactionDate = new Date(transaction.time.seconds * 1000); // Sử dụng .seconds để lấy thời gian đúng
    //const incomeDate = new Date(incomeItem.time.seconds * 1000);

    const fetchData = async () => {
      try {
        loading.value = true;
        const auth = getAuth();
        const userId = auth.currentUser ? auth.currentUser.uid : null;

        if (!userId) {
          console.error("Người dùng chưa đăng nhập.");
          loading.value = false;
          return;
        }

        const transactionSnapshot = await getDocs(
          collection(db, `users/${userId}/transactions`)
        );
        const incomeSnapshot = await getDocs(
          collection(db, `users/${userId}/income`)
        );

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

        console.log("Transactions:", transactions.value); // Kiểm tra dữ liệu transactions
        console.log("Income:", income.value); // Kiểm tra dữ liệu income

        processTransactions();
        setAvailableYears();

        loading.value = false;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

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

      console.log(`Transactions for month ${monthIndex}:`, [
        ...expenses,
        ...incomes,
      ]); // Log giao dịch của tháng
      return [...expenses, ...incomes];
    };

    const processTransactions = () => {
      const balance = {};

      months.value.forEach((monthIndex) => {
        const month = monthIndex.toString().padStart(2, "0");

        const expenses = transactions.value.filter((transaction) => {
          const transactionMonth = getMonthFromTime(transaction.time);
          const transactionYear = getYearFromTime(transaction.time);
          return (
            transactionMonth === month && transactionYear === selectedYear.value
          );
        });

        const incomes = income.value.filter((incomeItem) => {
          const incomeMonth = getMonthFromTime(incomeItem.time);
          const incomeYear = getYearFromTime(incomeItem.time);
          return incomeMonth === month && incomeYear === selectedYear.value;
        });

        const totalExpenses = expenses.reduce(
          (sum, transaction) => sum + parseFloat(transaction.total || 0),
          0
        );

        const totalIncome = incomes.reduce(
          (sum, incomeItem) => sum + parseFloat(incomeItem.total || 0),
          0
        );

        balance[monthIndex] = totalIncome - totalExpenses;
      });

      balanceByMonth.value = balance;
      console.log("Balance By Month:", balanceByMonth.value);
    };

    //console.log(`Expenses for month ${month}:`, expenses);
    //console.log(`Incomes for month ${month}:`, incomes);

    const setAvailableYears = () => {
      const years = new Set();

      [...transactions.value, ...income.value].forEach((item) => {
        const year = getYearFromTime(item.time);
        if (year) {
          years.add(year);
        } else {
          console.warn("Invalid year from item:", item);
        }
      });

      availableYears.value = Array.from(years).sort().reverse();
      console.log("Available Years:", availableYears.value);
    };

    const getMonthFromTime = (time) => {
      if (!time) {
        console.warn("Invalid time field:", time);
        return "";
      }

      let date;
      if (time.seconds) {
        // Firestore Timestamp
        date = new Date(time.seconds * 1000);
      } else if (typeof time === "string") {
        // ISO string
        date = new Date(time);
      } else if (typeof time === "number") {
        // Unix timestamp
        date = new Date(time);
      } else {
        console.warn("Unsupported time field format:", time);
        return "";
      }

      return isNaN(date.getTime()) ? "" : date.toISOString().slice(5, 7); // Trả về tháng (MM)
    };

    const getYearFromTime = (time) => {
      if (!time) {
        console.warn("Invalid time field:", time);
        return "";
      }

      let date;
      if (time.seconds) {
        date = new Date(time.seconds * 1000);
      } else if (typeof time === "string") {
        date = new Date(time);
      } else if (typeof time === "number") {
        date = new Date(time);
      } else {
        console.warn("Unsupported time field format:", time);
        return "";
      }

      return isNaN(date.getTime()) ? "" : date.getFullYear().toString(); // Trả về năm (YYYY)
    };

    const formatDate = (date) => {
      if (!date) return "--";

      let parsedDate;
      if (date.seconds) {
        parsedDate = new Date(date.seconds * 1000);
      } else if (typeof date === "string") {
        parsedDate = new Date(date);
      } else if (typeof date === "number") {
        parsedDate = new Date(date);
      } else {
        console.warn("Unsupported date format:", date);
        return "--";
      }

      return isNaN(parsedDate.getTime())
        ? "--"
        : parsedDate.toLocaleDateString("vi-VN");
    };

    const totalBalance = computed(() => {
      const balance = months.value.reduce((sum, month) => {
        return sum + (balanceByMonth.value[month] || 0);
      }, 0);
      console.log("Total Balance:", balance);
      return balance;
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
      loading,
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
