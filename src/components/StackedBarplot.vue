<script>
import * as d3 from 'd3'

export default {
   data() {
      return {
         svg: null,
         x: null,
         y: null,
         margin: { top: 20, right: 20, bottom: 40, left: 75 },
         width: null,
         height: null,
      }
   }, 

   mounted() {
      this.width = 500 - this.margin.left - this.margin.right
      this.height = 250 - this.margin.top - this.margin.bottom

      this.Barplot(this.data)
   },

   methods: {
      Barplot(data) {

         // ['Enchanter', 'Controller', 'Juggernaut', 'Diver', 'Mage', 'Burst', 'Artillery', 'Marksman']
         const subgroups = Object.keys(data[0]).slice(1)
         
         // ['Controller', 'Fighter', 'Mage', 'Marksman']
         const groups = data.map(d => (d.class))
         
         this.svg  = d3.select(".barplot-main")
            .append("svg")
               .attr("width", this.width + this.margin.left + this.margin.right)
               .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
               .attr("transform", 
               `translate(${this.margin.left}, ${this.margin.top})`)

         this.x = d3.scaleBand()
            .domain(groups)
            .range([0, this.width])
            .padding([0.2])

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
               .text("Class"))

         this.y = d3.scaleLinear()
            // .domain([0, 50])
            .domain([0, d3.max(data, d => Object.values(d).slice(1).reduce((a, b) => a + b))])
            .range([this.height, 0])

         const yAxisTicks = this.y.ticks()
            .filter(tick => tick % 10 == 0)

         const yAxis = d3.axisLeft(this.y)
            .tickValues(yAxisTicks)
            .tickFormat(d3.format('d'))

         this.svg.append("g")
            .classed('y-axis', true)
            // .call(d3.axisLeft(this.y))
            .call(yAxis)
               .attr("font-size", "0.7rem")
               .attr("color", "var(--color-font)")
            .call(g => g.append("text")
               .attr("x", 0)
               .attr("y", -10)
               .attr("fill", "var(--color-font)")
               .attr("font-size", "0.8rem")
               .attr("text-anchor", "end")
               .text("Frequency"))

         const color = d3.scaleOrdinal()
            .domain(subgroups)
            .range([
               'var(--bar2)', /* enchanter */
               'var(--bar3)', /* catcher */
               'var(--bar2)', /* juggernaut */
               'var(--bar3)', /* diver */
               'var(--bar2)', /* mage */
               'var(--bar3)', /* burst */
               'var(--bar4)', /* battlemage */
               'var(--bar1)', /* artillery */
               'var(--bar2)', /* marksman */
               'var(--bar2)', /* assassin */
               'var(--bar3)', /* skirmisher */
               'var(--bar2)', /* vanguard */
               'var(--bar3)', /* warden */
               'var(--bar2)'  /* specialist */
            ])

         const tooltip = d3.select(".barplot-main")
            .append("div")
            .attr("class", "barplot-tooltip")
            // .style("position", "absolute")
            // .style("visibility", "hidden");

         // Three function that change the tooltip when user hover / move / leave a cell
         const mouseover = function (_, d) {
            // console.log(d3.select(this.parentNode).datum())
            // console.log(d.data)
            const totalClass = Object.values(d.data).slice(1).reduce((a, b) => a + b)
            const subgroupName = d3.select(this.parentNode).datum().key;
            const subgroupValue = d.data[subgroupName];
            // console.log('tc', totalClass)
            tooltip
               .text(`Mainclass: ${d.data.class} (${Math.round(totalClass * 10)/10}%)\nSubclass: ${subgroupName} (${Math.round(subgroupValue * 10) / 10}%)`)
               .style("visibility", 'visible')

         }
         const mousemove = (e) => {
            tooltip
               .style("top", `${e.pageY + -20}px`)
               .style("left", `${e.pageX + 10}px`)
         }
         const mouseleave = () => {
            tooltip
               .style("visibility", 'hidden')
         }

         const stackedData = d3.stack()
            .keys(subgroups)(data)
            
         this.svg.append("g")
            .selectAll("g")
            .data(stackedData)
            .join("g")
               .attr("fill", d => color(d.key))
               // .attr("fill", 'var(--bar2)')
            .selectAll("rect")
            .data(d => d)
            .join("rect")
               .attr("x", d => this.x(d.data.class))
               .attr("y", d => this.y(d[1]))
               .attr("height", d => this.y(d[0]) - this.y(d[1]))
               .attr("width", this.x.bandwidth())
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
      }
   },

   props: {
      data: null
   }
}
</script>

<template>
   <div class="barplot-main">

   </div>
</template>

<style>
.barplot-main {
   padding-top: 30px;
}

.barplot-tooltip {
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