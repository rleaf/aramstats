<script>
import * as d3 from 'd3'

export default {
   data() {
      return {
         championNameEntry: String,
         x: null,
         y: null,
         histogram: null,
         margin: { top: 20, right: 20, bottom: 40, left: 80 },
         width: null,
         height: null,
         svg: null,
      }
   },

   mounted() {
      this.width = 400 - this.margin.left - this.margin.right
      this.height = 200 - this.margin.top - this.margin.bottom
      this.Histogram(this.data[25].matches)
   },

   watch: {
      championFilter() {
         let championIndex = this.getChampionIndex()
         let matches = this.data[championIndex].matches

         this.updateHistogram(matches)
      }
   },

   methods: {
      Histogram(data) {

         this.svg = d3.select(".histogram-main")
            .append("svg")
               .attr("width", this.width + this.margin.left + this.margin.right)
               .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
               .attr("transform",
               `translate(${this.margin.left},${this.margin.top})`);

         // X Axis
         this.x = d3.scaleLinear()
            .domain([0, 4000])
            .range([0, this.width])

         this.svg.append("g")
            .attr("transform", `translate(0, ${this.height})`)
            .call(d3.axisBottom(this.x))
               .attr("font-size", "0.7rem")
               .attr("color", "var(--color-font)")
            .call(g => g.append("text")
               .attr("x", this.width + 15)
               .attr("y", 35)
               .attr("fill", "var(--color-font)")
               .attr("font-size", "0.8rem")
               .attr("text-anchor", "end")
               .text("DPM"))

         // Histogram
         this.histogram = d3.histogram()
            .value(d => d.damagePerMinute)
            .domain(this.x.domain())
            .thresholds(this.x.ticks(20))

         const bins = this.histogram(data)

         // Y Axis
         this.y = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)])
            .range([this.height, 0])

         const yAxisTicks = this.y.ticks()
            .filter(tick => Number.isInteger(tick))

         const yAxis = d3.axisLeft(this.y)
            .tickValues(yAxisTicks)
            .tickFormat(d3.format('d'))

         this.svg.append("g")
            .classed('y-axis', true)
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
         this.svg.selectAll("rect")
            .data(bins)
            .join("rect")
            .attr("x", 1)
            .attr("transform", (d) => `translate(${this.x(d.x0)} , ${this.y(d.length)})`)
            .attr("width", d => {
               if (this.x(d.x1) - this.x(d.x0) == 0) {
                  return 0
               } 
               return this.x(d.x1) - this.x(d.x0) - 1
            })
            .attr("height", (d) => this.height - this.y(d.length))
            .attr("fill", d => `hsl(221, ${Math.round(d.length * 20)}%, 50%)`)

      },
      
      updateHistogram(matches) {
         const bins = this.histogram(matches)

         this.y = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)])
            .range([this.height, 0])

         const yAxisTicks = this.y.ticks()
            .filter(tick => Number.isInteger(tick))

         const yAxis = d3.axisLeft(this.y)
            .tickValues(yAxisTicks)
            .tickFormat(d3.format('d'))

         this.svg.select(".y-axis")
            .transition()
            .call(yAxis)

         this.svg.selectAll("rect")
            .data(bins)
            .transition()
            .duration(2000)
            .attr("transform", d => `translate(${this.x(d.x0)} , ${this.y(d.length)})`)
            .attr("height", d => this.height - this.y(d.length))
            .attr("fill", d => `hsl(221, ${Math.round(d.length * 15)}%, 50%)`)
            // .attr("fill", d => `hsl(221, 59%, 50%)`)
            // .attr("fill", d => `hwb(221 ${Math.round(d.length * 15)}% ${Math.round(d.length * 5)}%)`)
      },

      getChampionIndex() {
         return this.data.findIndex((e) => {
            if (e.trueChampionName) {
               return e.trueChampionName == this.championFilter
            } else {
               return e.championName == this.championFilter
            }
            
         })
      }
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