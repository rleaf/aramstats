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
         margin: { top: 40, right: 20, bottom: 50, left: 40 },
         width: null,
         height: null,
         std: null,
         mean: null,
         svg: null,
         statDomain: {
            'dtc': 'Damage / minute',
            'h': 'Healing / minute',
            'ah': 'Ally healing / minute',
            'dt': 'Damage taken / minute',
            'sm': 'Damage mitigated / minute',
            'g': 'Gold / minute',
         },
         averageTable: {
            'dtc': 'dpm',
            'h': 'hpm',
            'ah': 'ahpm',
            'dt': 'dtpm',
            'sm': 'smpm',
            'g': 'gpm'
         }
      }
   },

   mounted() {
      this.width = 450 - this.margin.left - this.margin.right
      this.height = 298 - this.margin.top - this.margin.bottom

      // this.avgStat = this.initChampion.averages.damagePerMinute
      this.avgStat = this.championData.avg[this.averageTable[this.stat]]
      // this.Histogram(this.initChampion.matches)
      this.Histogram(this.championData.matches)
   },

   watch: {
      championData() {
         this.avgStat = this.championData.avg[this.averageTable[this.stat]]
         this.updateHistogram(this.championData.matches)
      },

      stat() {
         // this.avgStat = this.championData[this.averageTable[this.stat]]
         this.avgStat = this.championData.avg[this.averageTable[this.stat]]
         this.updateHistogram(this.championData.matches)
      },

      // comparisonData(_, prev) {
      //    (prev) ? this.comparisonUpdate(this.comparisonData, true) :
      //       this.comparisonUpdate(this.comparisonData)
      // }
   },

   methods: {
      perMinute(unit, duration) {
         return Math.round(unit / duration)
      },

      getDomain() {
         switch (this.stat) {
            case 'dtc':
               return 5000
            case 'h':
               return 2500
            case 'ah':
               return 1000
            case 'dt':
               return 5000
            case 'sm':
               return 10000
            case 'g':
               return 2000
            default:
               return 10000
         }
      },

      Histogram(data) {
         this.svg = d3.select(".histogram-svg")
            .append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform",
               `translate(${this.margin.left},${this.margin.top})`);

         // X Axis
         this.x = d3.scaleLinear()
            .domain([0, this.getDomain()])
            .range([0, this.width])

         const xAxisTicks = this.x.ticks()
            .filter(tick => tick % 300 === 0)

         const xAxis = d3.axisBottom(this.x)
            .tickValues(xAxisTicks)

         this.svg.append("g")
            .classed('x-axis', true)
            .attr("transform", `translate(0, ${this.height})`)
            .call(xAxis)
            .attr("font-size", "0.7rem")
            .attr("color", "var(--color-font)")
            .call(g => g.append("text")
               .classed('stat', true)
               .attr("x", this.width)
               .attr("y", 40)
               .style("fill", "var(--color-font)")
               .style("font-size", "0.8rem")
               .style("text-anchor", "middle")
               .style("transform", "translateX(-40%)")
               .text(`${this.statDomain[this.stat]}`))

         // Histogram
         this.histogram = d3.histogram()
            .value(d => d.t[this.stat] / d.gd)
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
            .select(".histogram-svg")
            .append("div")
            .attr("class", "svg-tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden");

         this.blueLegend = this.svg.append("g")
            .classed("blue-legend", true)


         // this.blueLegend
         //    .append("circle")
         //    .attr("cx", `${this.width - 132}`)
         //    .attr("cy", -12)
         //    .attr("r", 6)
         //    .style("fill", "var(--ice-blue)")

         this.blueLegend
            .append("text")
            .classed("stats", true)
            .attr("x", `${this.width - 120}`)
            .attr("y", -8)
            .attr("text-align", "right")
            .attr("fill", "var(--color-font)")
            .attr("font-size", "0.8rem")
            // .html(`<p>toad</p>`)
            .text(`mean: ${this.avgStat}, std: ${this.getStdDev(this.initChampion, this.avgStat)}`)

         // Put comparison higher in DOM
         this.svg.append("g")
            .classed("comparison", true)

         this.svg.append("g")
            .classed("base", true)
            .selectAll("rect")
            .data(this.bins)
            .join("rect")
            .attr("x", 1)
            .attr("transform", (d) => `translate(${this.x(d.x0)} , ${this.y(d.length)})`)
            .attr("width", d => {
               if (this.x(d.x1) - this.x(d.x0) == 0) return 0
               return this.x(d.x1) - this.x(d.x0) - 1
            })
            .attr("height", (d) => this.height - this.y(d.length))
            // .attr("fill", d => `hsl(221, ${Math.round((((this.maxBin - d.length) / this.maxBin) * 10) + 50)}%, 50%)`)
            .attr("fill", 'var(--ice-blue)')
            .style("opacity", 0.7)
            .on('mouseover', function (_, d) {
               // need function declaration format to pass 'this'.
               d3.select(this)
                  .attr('stroke-width', 1)
                  .attr('stroke', 'var(--color-font)')
               tooltip
                  .style("visibility", "visible")
                  .text(`${d.length} games in: \n ${d.x0} - ${d.x1}`)
                  // .text(`Games: ${d.length}\nx0: ${d.x0}\nx1: ${d.x1}`)
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

         if (this.comparisonData) this.binDomain = [this.bins, this.bins2].flat()

         this.x = d3.scaleLinear()
            .domain([0, this.getDomain()])
            .range([0, this.width])

         const xAxisTicks = this.x.ticks()
            .filter(tick => tick % 300 === 0)

         const xAxis = d3.axisBottom(this.x)
            .tickValues(xAxisTicks)

         this.histogram = d3.histogram()
            .value(d => d.t[this.stat] / d.gd)
            .domain(this.x.domain())
            .thresholds(this.x.ticks(20))

         if (data) this.bins = this.histogram(data)

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
            
         this.svg.select(".x-axis")
            .transition()
            .call(xAxis)

         this.svg.select('.stat')
            .text(`${this.statDomain[this.stat]}`)

         this.blueLegend.selectAll("text.stats")
            .text(`mean: ${this.avgStat} std: ${this.getStdDev(this.championData, this.avgStat)}`)

         this.svg.select("g.base")
            .selectAll("rect")
            .data(this.bins)
            .transition()
            .duration(1000)
            .attr("transform", d => `translate(${this.x(d.x0)} , ${this.y(d.length)})`)
            .attr("height", d => this.height - this.y(d.length))
            .attr("width", d => {
               if (this.x(d.x1) - this.x(d.x0) == 0) {
                  return 0
               }
               return this.x(d.x1) - this.x(d.x0) - 1
            })
         // .attr("fill", d => `hsl(221, ${Math.round(60 - (((this.maxBin - d.length) / this.maxBin) * 40))}%, ${Math.round((((this.maxBin - d.length) / this.maxBin) * 8) + 50)}%)`)

         if (this.comparisonData) {
            this.svg.select("g.comparison").selectAll("rect")
               .data(this.bins2)
               .transition()
               .duration(1000)
               .attr("transform", (d) => `translate(${this.x(d.x0)} , ${this.y(d.length)})`)
               .attr("height", (d) => this.height - this.y(d.length))
            // .attr("fill", d => `hsl(9, ${Math.round(90 - (((this.maxBin2 - d.length) / this.maxBin2) * 40))}%, 64%)`)
         }
      },

      comparisonUpdate(data, update = false) {
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

            this.redLegend.selectAll("text.stats")
               .text(`mean: ${Math.round(ensembleDPM)}, std: ${this.getStdDev(this.comparisonData, ensembleDPM, true)}`)
         } else {

            const tooltip = d3
               .select(".histogram-svg")
               .append("div")
               .attr("class", "svg-tooltip-red")
               .style("position", "absolute")
               .style("visibility", "hidden");

            this.svg.select("g.comparison")
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
               .attr("fill", 'var(--bar1)')
               .attr("z-index", -20)
               .style("opacity", 0.6)
               .on('mouseover', function (_, d) {
                  // need function declaration format to pass 'this'.
                  d3.select(this)
                     .attr('stroke-width', 1)
                     .attr('stroke', 'var(--color-font)')
                  tooltip
                     .style("visibility", "visible")
                     .text(`Games: ${d.length}\nbetween ${d.x0} - ${d.x1}`)
                     // .text(`Games: ${d.length}\nx0: ${d.x0}\nx1: ${d.x1}`)
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
               .style("fill", "var(--bar1)")

            this.redLegend
               .append("text")
               .classed("stats", true)
               .attr("x", `${this.width - 120}`)
               .attr("y", 15)
               .attr("text-align", "right")
               .attr("fill", "var(--color-font)")
               .attr("font-size", "0.8rem")
               .text(`mean: ${Math.round(ensembleDPM)}, std: ${this.getStdDev(this.comparisonData, ensembleDPM, true)}`)

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

         this.svg.select("g.base")
            .selectAll("rect")
            .data(this.bins)
            .transition()
            .duration(1000)
            .attr("transform", d => `translate(${this.x(d.x0)} , ${this.y(d.length)})`)
            .attr("height", d => this.height - this.y(d.length))
         // .attr("fill", d => `hsl(221, ${Math.round(60 - (((this.maxBin - d.length) / this.maxBin) * 40))}%, ${Math.round((((this.maxBin - d.length) / this.maxBin) * 8) + 50)}%)`)
      },

      getStdDev(data, mean, comparison = false) {
         let arr = []

         data.matches.forEach((match) => {
            let pie = this.perMinute(match.t[this.stat], match.gd)
            arr.push(pie)
         })

         let std = 0
         let num = arr.length

         arr.forEach((value) => {
            std += (value - mean) ** 2
         })
         std /= num
         std = Math.round(std ** (1 / 2))
         return std
      },
   },

   props: {
      championData: null,
      stat: null,
      comparisonData: null,
      initChampion: null
   }
}
</script>

<template>
   <div class="histogram-main">
      <div class="histogram-svg"></div>
   </div>
</template>

<style>

.svg-tooltip {
   backdrop-filter: blur(13px) saturate(120%);
   -webkit-backdrop-filter: blur(13px) saturate(120%);
   background-color: rgba(31, 36, 51, 0.5);
   box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.85);
   border-radius: 3px;
   color: var(--color-font);
   display: block;
   font-size: .85rem;
   max-width: 320px;
   padding: .2rem .4rem;
   position: absolute;
   text-overflow: ellipsis;
   white-space: pre;
   z-index: 300;
   visibility: hidden;
}

.svg-tooltip-red {
   background: var(--panel1);
   border-radius: .1rem;
   color: var(--color-font);
   display: block;
   font-size: .85rem;
   max-width: 320px;
   padding: .2rem .4rem;
   position: absolute;
   text-overflow: ellipsis;
   white-space: pre;
   z-index: 300;
   visibility: hidden;
}
</style>