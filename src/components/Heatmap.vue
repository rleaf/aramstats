<script>
import * as echarts from 'echarts'
import Tooltip from './Tooltip.vue'

export default {
   components: {
      Tooltip
   },
   data() {
      return {
         selectedYear: new Date().getFullYear(),
         chart: null,
         years: [], // the years a user has played through up to the current year
         epochDates: [],  // cleaned array containing gameCreation dates of all games
         ceiling: 0, // ceiling for visualMap options
         heatMapData: []
      }
   },

   mounted() {
      this.preprocessData()
      this.generateHeatmapData()

      this.chart = echarts.init(this.$refs.chart, null, { renderer: 'svg' })
      this.chart.setOption(this.options);
   },
   
   methods: {

      selectYear(y) {
         this.selectedYear = y
         this.chart.setOption(this.options)
      },

      preprocessData() {
         /**
          * get prerequisite data from this.data to be fed into the chart and component UX.  
         */
         for (const c of this.data) {
            for (const m of c.matches) {
               this.epochDates.push(m.gc)
            }
         }

         this.epochDates.sort((a, b) => a - b)

         const currYear = new Date().getFullYear()
         const oldestYear = new Date(this.epochDates[0]).getFullYear()
         for (let i = oldestYear; i <= currYear; i++) {
            this.years.unshift(i)
         } 

      },

      generateHeatmapData() {
         const start = +echarts.time.parse(this.years[this.years.length - 1] + '-01-01')
         const end = +echarts.time.parse(new Date().getFullYear() + 1 + '-01-01')

         for (let time = start; time <= end; time += 86400000) {
            const games = this.epochDates.filter(e => e >= time && e < (time + 86400000)).length
            if (games > this.ceiling) this.ceiling = games
            this.heatMapData.push([
               echarts.time.format(time, '{yyyy}-{MM}-{dd}', false),
               games
            ])
         }
      },

   },

   computed: {

      options() {
         return {
            textStyle: {
               fontFamily: "var(--font-main), sans-serif",
               fontSize: '0.75rem',
            },
            tooltip: {
               show: true,
               renderMode: 'html',
               transitionDuration: 0,
               padding: [5, 10],
               position: (point, params, dom, rect, size) => {
                  return ([point[0] - (dom.offsetWidth / 2), point[1] - dom.offsetHeight - 5])
               },
               formatter: (params) => {
                  let o = (params.data[1] === 1) ? `${params.data[1]} game` : `${params.data[1]} games`
                  return `${o} on ${new Date(params.data[0]).toDateString()}`
               },
               backgroundColor: 'var(--off-blue)',
               borderWidth: 1,
               borderColor: 'var(--cell-border)',
               textStyle: {
                  fontFamily: 'var(--font-main)',
                  fontWeight: 'normal',
                  fontSize: 12,
                  width: 500,
                  color: 'var(--color-font)'
               },
               
            },
            visualMap: {
               min: 0,
               max: this.ceiling,
               inRange: {
                  color: [
                     'rgba(255, 255, 255, 0.05)', // hmm
                     '#7a90ca'
                  ]
               },
               show: false
            },
            calendar: {
               top: 20,
               left: 0,
               right: 0,
               cellSize: 'auto',
               range: this.selectedYear,
               itemStyle: {
                  borderWidth: 2,
                  opacity: 0,
               },
               splitLine: {
                  show: false
               },
               yearLabel: { show: false },
               monthLabel: {
                  show: true,
                  color: 'var(--color-font)',
               },
               dayLabel: { show: false },
            },
            series: {
               type: 'heatmap',
               itemStyle: {
                  borderRadius: 2,
               },
               coordinateSystem: 'calendar',
               data: this.heatMapData
            }
         }
      }
   },

   props: {
      data: null
   }
}
</script>

<template>
   <div class="heatmap-main">
      <div ref="chart" class="chart">
      </div>
      <div class="chart-util">
         <Tooltip :align="'right'" :tip="'heatmap'" />
         <div class="year-selection">
            <button
               v-for="year in years"
               :key="year" @click="this.selectYear(year)"
               :class="{ 'selected-year': year === selectedYear }">{{ year }}</button>
         </div>
      </div>
   </div>
</template>

<style>
   /* Unscoped styles for echarts heatmap */
   .heatmap-main {
      display: flex;
      justify-content: space-between;
      padding-bottom: 6vh;
      height: 120px;
   }
   
   .heatmap-main .chart {
      width: 90%;
      color: var(--color-font);
   }

   .heatmap-main .chart-util {
      display: flex;
      flex-direction: column;
      height: auto;
      flex: 0 0 60px;
      justify-content: space-between;
      align-items: flex-end;
   }
   
   .heatmap-main .year-selection {
      height: 90px;
      overflow-y: scroll;
      overflow-x: hidden;
   }

   .heatmap-main .year-selection button {
      width: 80%;
      padding: 0 0.5rem;
      margin-bottom: 5px;
      cursor: pointer;
      border-radius: 3px;
      border: 0;
      height: 25px;
      border: 1px solid transparent;
      background: var(--color-background);
      color: var(--color-font);
      font-size: 0.75rem;
      transition: background 150ms ease-in-out;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
   }

   
   .heatmap-main .year-selection button:hover {
      background: var(--cold-blue-focus);
   }

   .heatmap-main button.selected-year {
      background: var(--cold-blue-focus);
      border-color: var(--cell-border);
   }

   .heatmap-main .year-selection::-webkit-scrollbar {
      width: 4px;
      background: var(--alpha-01);
      border-radius: 3px;
   }

   .heatmap-main .year-selection::-webkit-scrollbar-thumb {
      background-color: var(--alpha-06);
      border-radius: 3px;
   }
   .heatmap-main .year-selection::-webkit-scrollbar-thumb:hover {
      background-color: var(--light-12);;
   }
</style>