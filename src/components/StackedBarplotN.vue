<script>
import * as d3 from 'd3'

export default {
   data() {
      return {
         svg: null,
         x: null,
         y: null,
         margin: { top: 0, right: 40, bottom: 30, left: 115 },
         width: null,
         height: null,
      }
   },

   mounted() {
      this.width = 700 - this.margin.left - this.margin.right
      this.height = 258 - this.margin.top - this.margin.bottom

      this.Barplot(this.data)
   },

   methods: {
      Barplot(data) {

         // ['Enchanter', 'Controller', 'Juggernaut', 'Diver', 'Mage', 'Burst', 'Artillery', 'Marksman']
         // const subgroups = Object.keys(data[0]).slice(1)

         // ['Controller', 'Fighter', 'Mage', 'Marksman']
         const groups = data.map(d => (d.class))

         this.svg = d3.select(".barplot-svg")
            .append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform",
               `translate(${this.margin.left}, ${this.margin.top})`)

         this.x = d3.scaleBand()
            .domain(groups)
            .range([0, this.width])
            .padding([0.3])


         this.svg.append("g")
            .attr("transform", `translate(0, ${this.height})`)
            .call(d3.axisBottom(this.x))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll("line").remove())
            .attr("font-size", "0.75rem")
            // .attr("color", "tomato")
            // .call(g => g.append("text")
            //    .attr("x", this.width + 15)
            //    .attr("y", 35)
            //    .attr("fill", "var(--color-font)")
            //    .attr("font-size", "0.8rem")
            //    .attr("text-anchor", "end")
            //    .text("Class"))

         this.y = d3.scaleLinear()
            // .domain([0, d3.max(data, d => Object.values(d).slice(1).reduce((a, b) => a + b))])
            .domain([0, d3.max(data, d => d.Total)])
            .range([this.height, 0])

         const yAxisTicks = this.y.ticks()
            .filter(tick => tick % 10 == 0)

         const yAxis = d3.axisLeft(this.y)
            .tickValues(yAxisTicks)
            .tickFormat(d => d + "%")

         this.svg.append("g")
            .classed('y-axis', true)
            .call(yAxis)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll("line").remove())
            .attr("font-size", "0.7rem")
            // .attr("color", "var(--color-font)")
            // .call(g => g.append("text")
            //    .attr("x", 15)
            //    .attr("y", -8)
            //    .attr("fill", "var(--color-font)")
            //    .attr("font-size", "0.8rem")
            //    .attr("text-anchor", "end")
            //    .text("Frequency"))

         // const color = d3.scaleOrdinal()
         //    .domain(subgroups)
         //    .range([
         //       'var(--bar2)', /* enchanter */
         //       // 'var(--bar3)', /* catcher */
         //       // 'var(--bar2)', /* juggernaut */
         //       // 'var(--bar3)', /* diver */
         //       // 'var(--bar2)', /* mage */
         //       // 'var(--bar3)', /* burst */
         //       // 'var(--bar4)', /* battlemage */
         //       // 'var(--bar5)', /* artillery */
         //       // 'var(--bar2)', /* marksman */
         //       // 'var(--bar2)', /* assassin */
         //       // 'var(--bar3)', /* skirmisher */
         //       // 'var(--bar2)', /* vanguard */
         //       // 'var(--bar3)', /* warden */
         //       // 'var(--bar2)'  /* specialist */
         //    ])

         const tooltip = d3.select(".barplot-svg")
            .append("div")
            .attr("class", "barplot-tooltip")

         // const mouseoverText = (data, totalClass) => { 
         //    let string = `${data.class} (${Math.round(totalClass * 10) / 10}%)\n`
         //    for (const [k, v] of Object.entries(data).slice(1)) {
         //       if (v != 0) string = string.concat('    ', `${k} (${Math.round(v * 10) / 10}%)\n`)
         //    }

         //    return string
         // }

         const mouseover = function (_, d) {
            let string = `${d.class} (${Math.round(d.Total * 10) / 10}%)\n`
            for (const [k, v] of Object.entries(d).slice(2)) {
               string = string.concat('    ', `${k} (${Math.round(v * 10) / 10}%)\n`)
            }

            tooltip
               .text(string)
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

         this.svg.append("g")
            .selectAll("g")
            .data(data)
            .join("rect")
            .attr("fill", "#8E9ED7")
            .attr("x", d => this.x(d.class))
            .attr("y", d => this.y(d.Total))
            .attr("height", d => this.height - this.y(d.Total))
            .attr("width", this.x.bandwidth())
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)


         /*
             Stacked Barchart
         */
         // const stackedData = d3.stack()
         //    .keys(subgroups)(data)
         // 
         // this.svg.append("g")
         //    .selectAll("g")
         //    .data(stackedData)
         //    .join("g")
         //       .attr("fill", d => color(d.key))
         //    .selectAll("rect")
         //    .data(d => d)
         //    .join("rect")
         //       .attr("x", d => this.x(d.data.class))
         //       .attr("y", d => this.y(d[1]))
         //       .attr("height", d => this.y(d[0]) - this.y(d[1]))
         //       .attr("width", this.x.bandwidth())
         //    .on("mouseover", mouseover)
         //    .on("mousemove", mousemove)
         //    .on("mouseleave", mouseleave)
      }
   },

   props: {
      data: null
   }
}
</script>

<template>
   <div class="barplot-main">
      <div class="barplot-asterisk">*<a href="https://pastebin.com/cH6tpmUT" target="_blank">classes</a>.</div>
      <div class="barplot-svg"></div>
   </div>
</template>

<style>
.barplot-asterisk {
   font-style: oblique;
   /* padding: 10px 0; */
   /* padding-right: 20px; */
   /* margin-bottom: -30px; */
   text-align: end;
   color: var(--color-font-fade);
   font-size: 0.8rem;
}

.barplot-asterisk a {
   color: var(--color-font-fade);
}

.barplot-asterisk a:hover {
   color: var(--color-font);
}

.barplot-main {
   /* height: 100%; */
   /* width: 100%; */
   /* border-radius: 10px; */
   /* margin: 0 20px; */
   background: var(--light1000);
   margin-top: 20px;
}

.barplot-tooltip {
   background: var(--panel2);
   /* background: var(--blue600s); */
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

.tick line {
   /* visibility: hidden; */
}
</style>