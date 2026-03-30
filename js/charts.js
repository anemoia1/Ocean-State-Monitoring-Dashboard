// charts.js

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

  function initSSTChart() {
    const canvas = document.getElementById('sst-chart');
    if (!canvas) return;

    const labels = ['1995','1998','2001','2004','2007','2010','2013','2016','2019','2022','2024'];
    const data   = [16.4, 16.8, 16.9, 17.1, 17.3, 17.4, 17.5, 17.9, 18.1, 18.4, 18.7];
    const anomaly= [0.0,  0.4,  0.5,  0.7,  0.9,  1.0,  1.1,  1.5,  1.7,  2.0,  2.3];

    new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Avg SST (°C)',
            data,
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
            data: anomaly,
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

  function initSeaLevelChart() {
    const canvas = document.getElementById('sea-level-chart');
    if (!canvas) return;

    const labels = ['1990','1993','1996','1999','2002','2005','2008','2011','2014','2017','2020','2023','2024'];
    const data   = [0, 8, 17, 22, 30, 40, 50, 62, 72, 85, 98, 108, 115];

    new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Sea Level Rise (mm above 1990)',
          data,
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

  function initPHChart() {
    const canvas = document.getElementById('ph-chart');
    if (!canvas) return;

    const labels = ['1750','1900','1950','1980','2000','2010','2015','2020','2024'];
    const data   = [8.18, 8.16, 8.14, 8.11, 8.08, 8.07, 8.065, 8.05, 8.04];

    new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Surface Ocean pH',
          data,
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

  function initOHCChart() {
    const canvas = document.getElementById('ohc-chart');
    if (!canvas) return;

    const labels = ['2005','2008','2011','2014','2017','2020','2023','2024'];
    const data   = [0, 40, 95, 150, 200, 265, 340, 385];

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'OHC Anomaly (ZJ)',
          data,
          backgroundColor: data.map(v => `rgba(56,189,248,${0.25 + (v / 385) * 0.55})`),
          borderColor: data.map(v => `rgba(56,189,248,${0.4 + (v / 385) * 0.4})`),
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

  function init() {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not loaded. Charts will not render.');
      return;
    }
    applyChartGlobals();
    initSSTChart();
    initSeaLevelChart();
    initPHChart();
    initOHCChart();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
