<template>
    <div>
      <canvas ref="lineChart"></canvas>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, watch } from 'vue';
  import Chart from 'chart.js/auto';
  
  export default {
    name: 'LineChart',
    props: {
    labels: {
      type: Array,
      required: true
    },
    data1: {
      type: Object,
      required: true
    },
    data2: {
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
            label: props.data1.nombre,
            data: props.data1.valores,
            fill: false,
            borderColor: 'rgb(254, 236, 27)',
            tension: 0.1
          },
          {
            label: props.data2.nombre,
            data: props.data2.valores,
            fill: false,
            borderColor: 'rgb(47, 172, 102)',
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
  