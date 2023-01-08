<script>
import * as d3 from 'd3'

export default {
   data() {
      return {
         championNameEntry: String,
         championNameBook: {
            // book of champ names
         }
      }
   },

   mounted() {

      // console.log(this.data)
      // console.log(this.data[39].matches)
      this.Histogram(this.data[14].matches)

   },

   watch: {
      // championFilter(curr) {
      //    console.log('curr', curr)
      //    // if curr is in championNameBook.key, this.championNameEntry = key.value
      // }
   },

   methods: {
      Histogram(data) {
         const margin = { top: 20, right: 20, bottom: 40, left: 80 },
            width = 400 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom;

         const svg = d3.select(".histogram-main")
            .append("svg")
               .attr("width", width + margin.left + margin.right)
               .attr("height", height + margin.top + margin.bottom)
            .append("g")
               .attr("transform",
               `translate(${margin.left},${margin.top})`);

         // X Axis
         const x = d3.scaleLinear()
            .domain([0, 4000])
            .range([0, width])

         svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x))
               .attr("font-size", "0.7rem")
               .attr("color", "var(--color-font)")
            .call(g => g.append("text")
               .attr("x", width + 15)
               .attr("y", 35)
               .attr("fill", "var(--color-font)")
               .attr("font-size", "0.8rem")
               .attr("text-anchor", "end")
               .text("DPM"))

         // Histogram
         const histogram = d3.histogram()
            .value(d => d.damagePerMinute)
            .domain(x.domain())
            .thresholds(x.ticks(20))

         const bins = histogram(data)

         // Y Axis
         const y = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)])
            .range([height, 0])

         const yAxisTicks = y.ticks()
            .filter(tick => Number.isInteger(tick))

         const yAxis = d3.axisLeft(y)
            .tickValues(yAxisTicks)
            .tickFormat(d3.format('d'))

         svg.append("g")
            .call(yAxis)
               .attr("font-size", "0.7rem")
               .attr("color", "var(--color-font)")
            .call(g => g.append("text")
               .attr("x", 0)
               .attr("y", -10)
               .attr("fill", "var(--color-font)")
               .attr("font-size", "0.8rem")
               .attr("text-anchor", "end")
               .text("Games"))
         
         // append the bar rectangles to the svg element
         svg.selectAll("rect")
            .data(bins)
            .join("rect")
            .attr("x", 1)
            .attr("transform", (d) => `translate(${x(d.x0)} , ${y(d.length)})`)
            .attr("width", d => {
               if (x(d.x1) - x(d.x0) == 0) {
                  return 0
               } 
               return x(d.x1) - x(d.x0) - 1
            })
            .attr("height", (d) => height - y(d.length))
            .style("fill", "steelblue")
      },
   },

   props: {
      data: null,
      championFilter: String 
   }
}
</script>

<template>
   <div class="histogram-main">

   </div>
</template>

<style scoped>
   .histogram-main {
      padding-left: 45px;
      padding-top: 80px;
      /* height: 450px; */
   }
</style>