<template>
  <div>
    <canvas ref="lineChart"></canvas>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'LineChart',
  props: {
    labels: {
      type: Array,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const lineChart = ref(null);
    let chartInstance = null;

    onMounted(() => {
      const ctx = lineChart.value.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: props.labels,
          datasets: [{
            label: props.data.nombre,
            data: props.data.valores,
            fill: false,
            borderColor: '#006633',
            tension: 0.1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    });

    return { lineChart };
  }
}
</script>

<style scoped>
div {
  margin: 15px 0;
}
</style>