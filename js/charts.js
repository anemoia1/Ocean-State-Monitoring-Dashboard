// charts.js — Chart.js initializations for dashboard.html

(function() {
  'use strict';

  const CHART_DEFAULTS = {
    color: 'rgba(200,230,255,0.8)',
    gridColor: 'rgba(56,189,248,0.07)',
    tickColor: '#475569',
    tooltipBg: 'rgba(1,15,30,0.95)',
    fontFamily: "'Inter', sans-serif",
  };

  function applyChartGlobals() {
    if (typeof Chart === 'undefined') return;
    Chart.defaults.color = CHART_DEFAULTS.color;
    Chart.defaults.font.family = CHART_DEFAULTS.fontFamily;
    Chart.defaults.font.size = 11;
  }

  function makeAxes(yLabel) {
    return {
      x: {
        grid: { color: CHART_DEFAULTS.gridColor, drawTicks: false },
        ticks: { color: CHART_DEFAULTS.tickColor, maxRotation: 0 },
        border: { color: 'rgba(56,189,248,0.08)' },
      },
      y: {
        grid: { color: CHART_DEFAULTS.gridColor, drawTicks: false },
        ticks: {
          color: CHART_DEFAULTS.tickColor,
          callback: typeof yLabel === 'function' ? yLabel : (v) => v + (yLabel || ''),
        },
        border: { color: 'rgba(56,189,248,0.08)' },
      }
    };
  }

  function makeTooltip(unit) {
    return {
      backgroundColor: CHART_DEFAULTS.tooltipBg,
      titleColor: '#38bdf8',
      bodyColor: '#94a3b8',
      borderColor: 'rgba(56,189,248,0.2)',
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: (ctx) => ` ${ctx.parsed.y}${unit || ''}`,
      }
    };
  }

  // --- SST Trend Chart ---
  function initSSTChart(apiLabels, apiData, apiAnomaly) {
    const canvas = document.getElementById('sst-chart');
    if (!canvas || !apiLabels || apiLabels.length === 0) return;

    new Chart(canvas, {
      type: 'line',
      data: {
        labels: apiLabels,
        datasets: [
          {
            label: 'Avg SST (°C)',
            data: apiData,
            borderColor: '#38bdf8',
            backgroundColor: 'rgba(56,189,248,0.07)',
            borderWidth: 2.5,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#38bdf8',
            fill: true,
            tension: 0.4,
            yAxisID: 'y',
          },
          {
            label: 'Anomaly (°C)',
            data: apiAnomaly,
            borderColor: '#fb923c',
            backgroundColor: 'transparent',
            borderWidth: 1.8,
            borderDash: [5, 3],
            pointRadius: 3,
            pointBackgroundColor: '#fb923c',
            fill: false,
            tension: 0.4,
            yAxisID: 'y2',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        animation: { duration: 1200, easing: 'easeInOutQuart' },
        plugins: {
          legend: {
            display: true,
            labels: { color: '#64748b', boxWidth: 12, font: { size: 11 } }
          },
          tooltip: makeTooltip('°C')
        },
        scales: {
          x: makeAxes().x,
          y: {
            ...makeAxes('°C').y,
            position: 'left',
            title: { display: true, text: 'SST (°C)', color: '#475569', font: { size: 10 } },
          },
          y2: {
            ...makeAxes('°C').y,
            position: 'right',
            title: { display: true, text: 'Anomaly (°C)', color: '#475569', font: { size: 10 } },
            grid: { drawOnChartArea: false },
          }
        }
      }
    });
  }

  // --- Sea Level Rise Chart ---
  function initSeaLevelChart(apiLabels, apiData) {
    const canvas = document.getElementById('sea-level-chart');
    if (!canvas || !apiLabels || apiLabels.length === 0) return;

    new Chart(canvas, {
      type: 'line',
      data: {
        labels: apiLabels,
        datasets: [{
          label: 'Sea Level Rise (mm above 1990)',
          data: apiData,
          borderColor: '#2dd4bf',
          backgroundColor: 'rgba(45,212,191,0.07)',
          borderWidth: 2.5,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#2dd4bf',
          fill: true,
          tension: 0.4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1400, easing: 'easeInOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: makeTooltip(' mm')
        },
        scales: {
          x: makeAxes().x,
          y: {
            ...makeAxes(v => `+${v}mm`).y,
          }
        }
      }
    });
  }

  // --- Ocean pH Trend ---
  function initPHChart(apiLabels, apiData) {
    const canvas = document.getElementById('ph-chart');
    if (!canvas || !apiLabels || apiLabels.length === 0) return;

    new Chart(canvas, {
      type: 'line',
      data: {
        labels: apiLabels,
        datasets: [{
          label: 'Surface Ocean pH',
          data: apiData,
          borderColor: '#a78bfa',
          backgroundColor: 'rgba(167,139,250,0.07)',
          borderWidth: 2.5,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#a78bfa',
          fill: true,
          tension: 0.35,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1200, easing: 'easeInOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: makeTooltip(' pH')
        },
        scales: {
          x: makeAxes().x,
          y: {
            ...makeAxes().y,
            min: 8.00,
            max: 8.22,
            ticks: {
              color: CHART_DEFAULTS.tickColor,
              callback: (v) => 'pH ' + Number(v).toFixed(2),
            }
          }
        }
      }
    });
  }

  // --- Ocean Heat Content Bar ---
  function initOHCChart(apiLabels, apiData) {
    const canvas = document.getElementById('ohc-chart');
    if (!canvas || !apiLabels || apiLabels.length === 0) return;

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: apiLabels,
        datasets: [{
          label: 'OHC Anomaly (ZJ)',
          data: apiData,
          backgroundColor: apiData.map(v => `rgba(56,189,248,${0.25 + (v / 385) * 0.55})`),
          borderColor: apiData.map(v => `rgba(56,189,248,${0.4 + (v / 385) * 0.4})`),
          borderWidth: 1,
          borderRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1000 },
        plugins: {
          legend: { display: false },
          tooltip: makeTooltip(' ZJ')
        },
        scales: {
          x: makeAxes().x,
          y: makeAxes(' ZJ').y,
        }
      }
    });
  }

  // --- Data Fetching ---
  async function fetchDashboardData() {
    try {
      console.log("Fetching live data from API Aggregator...");
      
      const response = await fetch('http://localhost:5000/api/ocean-data');
      if (!response.ok) throw new Error('Network response was not ok');
      
      const ocean = await response.json();
      console.log("Aggregated Data Received:", ocean);

      if (ocean.sst) {
        initSSTChart(ocean.sst.labels, ocean.sst.data, ocean.sst.anomaly);
      }
      if (ocean.seaLevel) {
        initSeaLevelChart(ocean.seaLevel.labels, ocean.seaLevel.data);
      }
      if (ocean.ph) {
        initPHChart(ocean.ph.labels, ocean.ph.data);
      }
      if (ocean.ohc) {
        initOHCChart(ocean.ohc.labels, ocean.ohc.data);
      }

    } catch (error) {
      console.error("Critical: Failed to fetch dashboard data.", error);
    }
  }

  function init() {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not loaded. Charts will not render.');
      return;
    }
    applyChartGlobals();
    
    fetchDashboardData();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();