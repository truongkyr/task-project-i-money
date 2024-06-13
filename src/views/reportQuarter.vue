<template>
  <div class="row">
    <div class="py-4 border-x-4">
      <select
        @change="handleChange"
        class="font-semibold block w-32 h-12 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="select" disabled selected>Chọn</option>
        <option value="month">Tháng</option>
        <option value="quarter">Quý</option>
        <option value="year">Năm</option>
      </select>
    </div>
  </div>
  <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>

<script>
import { useRouter } from 'vue-router';
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "BarChart",
  components: { Bar },
    setup(){
    const router = useRouter();

    function handleChange(event) {
    const value = event.target.value;
    if(value == 'month'){
      router.push({ name: 'Report', params:{} });
    } else if (value == 'quarter') {
      router.push ({ name: 'ReportQuarter', params:{} });
    } else if (value == 'year'){
      router.push ({ name: 'ReportYear', params:{} });
    }
  }
  return {
      handleChange,
    }
  },
  data() {
    return {
      chartData: {
        labels: [
          "First Quarter",
          "Second Quarter",
          "Third quarter",
          "Fourth quarter",
        ],
        datasets: [
          {
            label: "Data One",
            backgroundColor: "rgba(255, 159, 64, 0.2)",
            borderColor: "rgba(255, 159, 64, 1)",
            borderWidth: 1,
            data: [40, 20, 12, 22],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };
  },
};
</script>

