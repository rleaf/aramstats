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
         maxBin: 0,
         maxBin2: 0,
         binDomain: null,
         bins2: null,
         histogram: null,
         blueLegend: null,
         redLegend: null,
         margin: { top: 20, right: 20, bottom: 40, left: 45 },
         width: null,
         height: null,
         std: null,
         mean: null,
         svg: null,
      }
   },

   mounted() {
      this.width = 600 - this.margin.left - this.margin.right
      this.height = 250 - this.margin.top - this.margin.bottom

      this.avgDPM = this.initChampion.averageDamagePerMinute
      this.Histogram(this.initChampion.matches)
   },

   watch: {
      championData() {
         this.avgDPM = this.championData.averageDamagePerMinute
         this.updateHistogram(this.championData.matches)
      },
      
      comparisonData(_, prev) {
         (prev) ? this.comparisonUpdate(this.comparisonData, true) :
            this.comparisonUpdate(this.comparisonData)
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
            .domain([0, 5000])
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
         this.bins.forEach(bin => {
            if (bin.length > this.maxBin) this.maxBin = bin.length
         });

         const tooltip = d3
            .select(".histogram-main")
            .append("div")
            .attr("class", "svg-tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden");

         this.blueLegend = this.svg.append("g")
            .classed("blue-legend", true)
            

         this.blueLegend
            .append("circle")
            .attr("cx", `${this.width - 132}`)
            .attr("cy", -12)
            .attr("r", 6)
            .style("fill", "var(--bar1)")

         this.blueLegend
            .append("text")
            .classed("stats", true)
            .attr("x", `${this.width - 120}`)
            .attr("y", -8)
            .attr("text-align", "right")
            .attr("fill", "var(--color-font)")
            .attr("font-size", "0.8rem")
            .text(`mean: ${this.avgDPM}, std: ${this.getStdDev(this.initChampion, this.avgDPM)}`)

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
            // .attr("fill", d => `hsl(221, ${Math.round((((this.maxBin - d.length) / this.maxBin) * 10) + 50)}%, 50%)`)
            .attr("fill", 'var(--bar1)')
            .style("opacity", 0.7)
            .on('mouseover', function(_, d) {
               // need function declaration format to pass 'this'.
               d3.select(this)
                  .attr('stroke-width', 1)
                  .attr('stroke', 'var(--color-font)')
               tooltip
                  .style("visibility", "visible")
                  .text(`games: ${d.length}\nx0: ${d.x0}\nx1: ${d.x1}`)
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
      
      updateHistogram(data) {
         this.bins = this.histogram(data)
         if (this.comparisonData) this.binDomain = [this.bins, this.bins2].flat()
         // let been
         // (this.comparisonData) ? been = this.binDomain : been = this.bins

         this.y = d3.scaleLinear()
            .domain([0, d3.max(this.binDomain || this.bins, d => d.length)])
            .range([this.height, 0])

         const yAxisTicks = this.y.ticks()
            .filter(tick => Number.isInteger(tick))

         const yAxis = d3.axisLeft(this.y)
            .tickValues(yAxisTicks)
            .tickFormat(d3.format('d'))

         this.svg.select(".y-axis")
            .transition()
            .call(yAxis)

         this.blueLegend.selectAll("text.stats")
            .text(`mean: ${this.avgDPM}, std: ${this.getStdDev(this.championData, this.avgDPM)}`)

         this.svg.selectAll("rect")
            .data(this.bins)
            .transition()
            .duration(1000)
            .attr("transform", d => `translate(${this.x(d.x0)} , ${this.y(d.length)})`)
            .attr("height", d => this.height - this.y(d.length))
            // .attr("fill", d => `hsl(221, ${Math.round(60 - (((this.maxBin - d.length) / this.maxBin) * 40))}%, ${Math.round((((this.maxBin - d.length) / this.maxBin) * 8) + 50)}%)`)
            .attr("fill", 'var(--bar1)')

         if(this.comparisonData) {
            this.svg.select("g.comparison").selectAll("rect")
               .data(this.bins2)
               .transition()
               .duration(1000)
               .attr("transform", (d) => `translate(${this.x(d.x0)} , ${this.y(d.length)})`)
               .attr("height", (d) => this.height - this.y(d.length))
               // .attr("fill", d => `hsl(9, ${Math.round(90 - (((this.maxBin2 - d.length) / this.maxBin2) * 40))}%, 64%)`)
               .attr("fill", 'var(--bar2)')
         }
      },

      comparisonUpdate(data, update=false) {
         this.bins2 = this.histogram(data)
         this.binDomain = [this.bins, this.bins2].flat()

         this.y = d3.scaleLinear()
            .domain([0, d3.max(this.binDomain, d => d.length)])
            .range([this.height, 0])

         const yAxisTicks = this.y.ticks()
            .filter(tick => Number.isInteger(tick))

         const yAxis = d3.axisLeft(this.y)
            .tickValues(yAxisTicks)
            .tickFormat(d3.format('d'))

         this.svg.select(".y-axis")
            .transition()
            .call(yAxis)

         this.bins2.forEach(bin => {
            if (bin.length > this.maxBin2) this.maxBin2 = bin.length
         });
         
         let ensembleDPM = 0
         data.forEach((match) => {
            ensembleDPM += match.damagePerMinute
         })

         ensembleDPM /= data.length

         if (update) {
            this.svg.select("g.comparison").selectAll("rect")
               .data(this.bins2)
               .transition()
               .duration(1000)
               .attr("transform", (d) => `translate(${this.x(d.x0)} , ${this.y(d.length)})`)
               .attr("height", (d) => this.height - this.y(d.length))
               // .attr("fill", d => `hsl(9, ${Math.round(90 - (((this.maxBin2 - d.length) / this.maxBin2) * 40))}%, 64%)`)
               .attr("fill", 'var(--bar2)')

            this.redLegend.selectAll("text.stats")
               .text(`mean: ${Math.round(ensembleDPM)}, std: ${this.getStdDev(this.comparisonData, ensembleDPM, true)}`)
         } else {

            const tooltip = d3
               .select(".histogram-main")
               .append("div")
               .attr("class", "svg-tooltip-red")
               .style("position", "absolute")
               .style("visibility", "hidden");

            this.svg.append("g")
               .classed("comparison", true)
               .selectAll("rect")
               .data(this.bins2)
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
               // .attr("fill", d => `hsl(9, ${Math.round(80 - (((this.maxBin2 - d.length) / this.maxBin2) * 40) )}%, 64%)`)
               .attr("fill", 'var(--bar2)')
               .style("opacity", 0.6)
               .on('mouseover', function (_, d) {
                  // need function declaration format to pass 'this'.
                  d3.select(this)
                     .attr('stroke-width', 1)
                     .attr('stroke', 'var(--color-font)')
                  tooltip
                     .style("visibility", "visible")
                     .text(`games: ${d.length}\nx0: ${d.x0}\nx1: ${d.x1}`)
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

            this.redLegend = this.svg.append("g")
               .classed("red-legend", true)

            this.redLegend
               .append("circle")
               .attr("cx", `${this.width - 132}`)
               .attr("cy", 11)
               .attr("r", 6)
               .style("fill", "var(--bar2)")

            this.redLegend
               .append("text")
               .classed("stats", true)
               .attr("x", `${this.width - 120}`)
               .attr("y", 15)
               .attr("text-align", "right")
               .attr("fill", "var(--color-font)")
               .attr("font-size", "0.8rem")
               .text(`mean: ${Math.round(ensembleDPM)}, std: ${this.getStdDev(this.comparisonData, ensembleDPM,  true)}`)

            // this.redLegend
            //    .append("text")
            //    .classed("mean", true)
            //    .attr("x", `${this.width - 50}`)
            //    .attr("y", 50)
            //    .attr("text-align", "right")
            //    .attr("fill", "var(--color-font)")
            //    .attr("font-size", "0.8rem")
            //    .text(`mean: ${Math.round(ensembleDPM)}`)
         }


         this.svg.selectAll("rect")
            .data(this.bins)
            .transition()
            .duration(1000)
            .attr("transform", d => `translate(${this.x(d.x0)} , ${this.y(d.length)})`)
            .attr("height", d => this.height - this.y(d.length))
            // .attr("fill", d => `hsl(221, ${Math.round(60 - (((this.maxBin - d.length) / this.maxBin) * 40))}%, ${Math.round((((this.maxBin - d.length) / this.maxBin) * 8) + 50)}%)`)
            .attr("fill", 'var(--bar1)')
      },

      getStdDev(data, mean, comparison=false) {
         let arr = []
         
         if (comparison == false) {
            data.matches.forEach((match) => {
               arr.push(match.damagePerMinute)
            })
         } else {
            data.forEach((match) => {
               arr.push(match.damagePerMinute)
            })
         }

         let std = 0
         let num = arr.length

         arr.forEach((value) => {
            std += (value - mean) ** 2
         })
         std /= num
         std = Math.round(std ** (1/2))
         return std

      },
   },

   props: {
      championData: null,
      comparisonData: null,
      initChampion: null
   }
}
</script>

<template>
   <div class="histogram-main">

   </div>
</template>

<style>
.histogram-main {
      padding: 10px;
      padding-top: 30px;
      border-left: 2px solid var(--color-background);
      border-right: 2px solid var(--color-background);
   }

   .svg-tooltip {
      background: var(--panel1);
      border-radius: .1rem;
      color: var(--color-font);
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

   .svg-tooltip-red {
      background: var(--panel2);
      border-radius: .1rem;
      color: var(--color-font);
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