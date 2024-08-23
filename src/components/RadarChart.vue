<script>
import * as echarts from 'echarts'
import classBook from '@/constants/championClasses'

export default {
   data() {
      return {
         tally: {
            'Mage': 0,
            'Marksman': 0,
            'Specialist': 0,
            'Controller': 0,
            'Tank': 0,
            'Fighter': 0,
            'Slayer': 0,
         },
         option: Object,
         ceiling: Number,
      }
   },

   mounted() {
      this.processData()
      this.initChart()
   },

   methods: {
      processData() {
         for (const c of this.data) {
            for (const v of classBook[c.championId]) {
               switch (v) {
                  case 'Enchanter':
                  case 'Catcher':
                     this.tally['Controller']++
                     break
                  case 'Juggernaut':
                  case 'Diver':
                     this.tally['Fighter']++ 
                     break
                  case 'Mage':
                  case 'Burst':
                  case 'Battlemage':
                  case 'Artillery':
                     this.tally['Mage']++ 
                     break
                  case 'Marksman':
                     this.tally['Marksman']++ 
                     break
                  case 'Assassin':
                  case 'Skirmisher':
                     this.tally['Slayer']++ 
                     break
                  case 'Vanguard':
                  case 'Warden':
                     this.tally['Tank']++ 
                     break
                  case 'Specialist':
                     this.tally['Specialist']++ 
                     break
               }
            }
         }

         this.ceiling = Math.max(...Object.values(this.tally)) + 1
      },

      initChart() {
         const myChart = echarts.init(this.$refs.chart, null, { renderer: 'svg' });

         const option = {
            tooltip: {
               show: false,
               formatter: () => { 
                  return 'tooltip here'
               },
               textStyle: {
                  fontSize: 12
               }
            },
            radar: {
               center: ['50%', '55%'],
               indicator: [
                  { name: 'Mage', max: this.ceiling },
                  { name: 'Marksman', max: this.ceiling },
                  { name: 'Specialist', max: this.ceiling },
                  { name: 'Controller', max: this.ceiling },
                  { name: 'Tank', max: this.ceiling },
                  { name: 'Fighter', max: this.ceiling },
                  { name: 'Slayer', max: this.ceiling },
               ],
               // shape: 'circle',
               splitNumber: 5,
               axisName: {
                  color: 'var(--color-font)',
                  formatter: (value) => `{${value}|}\n${value}`,
                  rich: {
                     'Controller': {
                        height: 25,
                        width: 25,
                        lineHeight: 22,
                        align: 'center',
                        backgroundColor: {
                           image: new URL('../assets/class_images/Controller_icon.webp', import.meta.url).href
                        },
                     },
                     'Fighter': {
                        height: 22,
                        width: 22,
                        lineHeight: 30,
                        align: 'center',
                        backgroundColor: {
                           image: new URL('../assets/class_images/Fighter_icon.webp', import.meta.url).href
                        },
                     },
                     'Mage': {
                        height: 22,
                        width: 22,
                        align: 'center',
                        lineHeight: 30,
                        backgroundColor: {
                           image: new URL('../assets/class_images/Mage_icon.webp', import.meta.url).href
                        },
                     },
                     'Marksman': {
                        height: 22,
                        width: 22,
                        align: 'center',
                        lineHeight: 30,
                        backgroundColor: {
                           image: new URL('../assets/class_images/Marksman_icon.webp', import.meta.url).href
                        },
                     },
                     'Slayer': {
                        height: 22,
                        width: 22,
                        align: 'center',
                        lineHeight: 30,
                        backgroundColor: {
                           image: new URL('../assets/class_images/Slayer_icon.webp', import.meta.url).href
                        },
                     },
                     'Tank': {
                        height: 20,
                        width: 20,
                        lineHeight: 23,
                        align: 'center',
                        backgroundColor: {
                           image: new URL('../assets/class_images/Tank_icon.webp', import.meta.url).href
                        },
                     },
                     'Specialist': {
                        height: 22,
                        width: 22,
                        lineHeight: 30,
                        align: 'center',
                        backgroundColor: {
                           image: new URL('../assets/class_images/Specialist_icon.webp', import.meta.url).href
                        },
                     },
                  },
               },
               splitLine: {
                  lineStyle: {
                     color: [
                        'rgba(var(--secondary-rgb), 0.3)',
                     ]
                  }
               },
               splitArea: {
                  show: false
               },
               axisLine: {
                  lineStyle: {
                  color: 'rgba(var(--secondary-rgb), 0.3)'
                  }
               }
            },
            series: [
               {
                  name: 'Roles',
                  type: 'radar',
                  lineStyle: { width: 1, opacity: 1},
                  data: [Object.values(this.tally)],
                  symbol: 'none',
                  itemStyle: {
                  color: 'var(--primary)' // ice blue
                  },
                  areaStyle: {
                     opacity: 0.25
                  },
                  tooltip: {}
               },
            ]
         }

         myChart.setOption(option);
      }
   },

   props: {
      data: null
   }
}

</script>

<template>
   <div ref="chart" class="radar-chart-main"></div>
</template>

<style scoped>
   .radar-chart-main {
      width: 370px;
      height: 280px;
   }
</style>