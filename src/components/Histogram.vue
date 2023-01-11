<script>
import * as d3 from 'd3'

export default {
   data() {
      return {
         matches: null,
         avgDPM: null,
         x: null,
         y: null,
         bins: null,
         histogram: null,
         margin: { top: 20, right: 20, bottom: 40, left: 45 },
         width: null,
         height: null,
         std: null,
         mean: null,
         svg: null,
      }
   },

   mounted() {
      this.width = 350 - this.margin.left - this.margin.right
      this.height = 200 - this.margin.top - this.margin.bottom
      this.Histogram(this.data[25].matches)
   },

   watch: {
      championIndex() {
         this.matches = this.data[this.championIndex].matches
         this.avgDPM = this.data[this.championIndex].averageDamagePerMinute
         this.updateHistogram(this.matches)
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

         if (data) this.bins = this.histogram(data)

         // Y Axis
         this.y = d3.scaleLinear()
            .domain([0, d3.max(this.bins, d => d.length)])
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
         let maxBin = 0
         this.bins.forEach(bin => {
            if (bin.length > maxBin) maxBin = bin.length
         });

         const tooltip = d3
            .select(".histogram-main")
            .append("div")
            .attr("class", "svg-tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden");

         this.std = this.svg.append("g")
            .append("text")
            .attr("x", `${this.width - 50}`)
            .attr("y", 20)
            .attr("text-align", "right")
            .attr("fill", "var(--color-font)")
            .attr("font-size", "0.8rem")
            .text(`std: -`)

         this.mean = this.svg.append("g")
            .append("text")
            .attr("x", `${this.width - 50}`)
            .attr("y", 0)
            .attr("text-align", "right")
            .attr("fill", "var(--color-font)")
            .attr("font-size", "0.8rem")
            .text(`mean: -`)

         this.svg.selectAll("rect")
            .data(this.bins)
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
            .attr("fill", d => `hsl(221, ${Math.round((((maxBin - d.length) / maxBin) * 10) + 50)}%, 50%)`)
            .on('mouseover', function(_, d) {
               // need function declaration format to pass 'this'.
               d3.select(this)
                  .attr('stroke-width', 1)
                  .attr('stroke', 'var(--color-font)')
               tooltip
                  .style("visibility", "visible")
                  .text(`count: ${d.length}\nx0: ${d.x0}\nx1: ${d.x1}`)
            })
            .on("mousemove", function (e) {
               tooltip
                  .style("top", `${e.pageY + -20}px`)
                  .style("left", `${e.pageX + 10}px`)
            })
            .on("mouseout", function () {
               // change the selection style
               d3.select(this).attr('stroke-width', '0');

               tooltip.style("visibility", "hidden");
            });
      },
      
      updateHistogram(matches) {
         this.bins = this.histogram(matches)

         this.y = d3.scaleLinear()
            .domain([0, d3.max(this.bins, d => d.length)])
            .range([this.height, 0])

         const yAxisTicks = this.y.ticks()
            .filter(tick => Number.isInteger(tick))

         const yAxis = d3.axisLeft(this.y)
            .tickValues(yAxisTicks)
            .tickFormat(d3.format('d'))

         this.svg.select(".y-axis")
            .transition()
            .call(yAxis)

         let maxBin = 0
         this.bins.forEach(bin => {
            if (bin.length > maxBin) maxBin = bin.length
         });

         this.std
            .text(`std: ${this.getStdDev(this.championFilter)}`)

         this.mean
            .text(`mean: ${this.avgDPM}`)

         this.svg.selectAll("rect")
            .data(this.bins)
            .transition()
            .duration(1000)
            .attr("transform", d => `translate(${this.x(d.x0)} , ${this.y(d.length)})`)
            .attr("height", d => this.height - this.y(d.length))
            .attr("fill", d => `hsl(221, ${Math.round(60 - (((maxBin - d.length) / maxBin) * 40))}%, ${Math.round((((maxBin - d.length) / maxBin) * 8) + 50)}%)`)
      },

      getStdDev() {
         let arr = []
         this.matches.forEach((match) => {
            arr.push(match.damagePerMinute)
         })
         let std = 0
         let num = arr.length
         arr.forEach((value) => {
            std += (value - this.avgDPM) ** 2
         })
         std /= num
         std = Math.round(std ** (1/2))
         return std

      },
   },

   props: {
      data: null,
      championIndex: Number,
   }
}
</script>

<template>
   <div class="histogram-main">

   </div>
</template>

<style>
   .histogram-main {
      padding-top: 25px;
      width: 350px;
   }

   .svg-tooltip {
      background: rgba(69, 77, 93, .9);
      border-radius: .1rem;
      color: #fff;
      display: block;
      font-size: 14px;
      max-width: 320px;
      padding: .2rem .4rem;
      position: absolute;
      text-overflow: ellipsis;
      white-space: pre;
      z-index: 300;
      visibility: hidden;
   }
</style>