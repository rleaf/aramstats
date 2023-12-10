<script>
import * as d3 from 'd3'

export default {
   data() {
      return {
         svg: null,
         x: null,
         y: null,
         margin: { top: 0, right: 10, bottom: 60, left: 105 },
         width: null,
         height: null,
         classes: [
            new URL('../assets/class_images/Controller_icon.webp', import.meta.url).href,
            new URL('../assets/class_images/Fighter_icon.webp', import.meta.url).href,
            new URL('../assets/class_images/Mage_icon.webp', import.meta.url).href,
            new URL('../assets/class_images/Marksman_icon.webp', import.meta.url).href,
            new URL('../assets/class_images/Slayer_icon.webp', import.meta.url).href,
            new URL('../assets/class_images/Tank_icon.webp', import.meta.url).href,
            new URL('../assets/class_images/Specialist_icon.webp', import.meta.url).href,
         ]
      }
   },

   mounted() {
      this.width = 700 - this.margin.left - this.margin.right
      this.height = 268 - this.margin.top - this.margin.bottom

      this.Barplot(this.data)
   },

   methods: {
      Barplot(data) {

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
            .call(g => {
               g.select(".domain").remove()
               g.selectAll("line").remove()
               g.selectAll("g.tick text").remove()
               g.selectAll("g.tick").each((_, i, n) => {
                  d3.select(n[i])
                     .append('image')
                     .classed('class-image', true)
                     .attr('href', this.classes[i])
               })
            })
            .attr("font-size", "0.75rem")

         this.y = d3.scaleLinear()
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

         const tooltip = d3.select(".barplot-svg")
            .append("div")
            .attr("class", "barplot-tooltip")

         const mouseover = function (_, d) {
            let string = `<b>${d.class}</b>: (${Math.round(d.Total * 10) / 10}%)\n`
            for (const [k, v] of Object.entries(d).slice(2)) {
               string = string.concat('   &#x2022; ', `${k}: (${Math.round(v * 10) / 10}%)\n`)
            }

            tooltip
               .html(string)
               .style("visibility", 'visible')
               .style("opacity", "1")
         }

         const mousemove = (e) => {
            tooltip
               .style("top", `${e.pageY + -20}px`)
               .style("left", `${e.pageX + 10}px`)
         }
         const mouseleave = () => {
            tooltip
               .style("visibility", 'hidden')
               .style("opacity", "0")
         }

         this.svg.append("g")
            .selectAll("g")
            .data(data)
            .join("rect")
            .attr("fill", "var(--ice-blue)")
            .attr("x", d => this.x(d.class))
            .attr("y", d => this.y(d.Total))
            .attr("height", d => this.height - this.y(d.Total))
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
      <div class="barplot-asterisk"><a href="https://pastebin.com/cH6tpmUT" target="_blank">Champion classes</a></div>
      <div class="barplot-svg"></div>
   </div>
</template>

<style>

.barplot-asterisk {
   padding: 10px 0;
   text-align: end;
   padding-right: 20px;
}
.barplot-asterisk a {
   font-style: italic;
   /* text-decoration: none; */
   color: var(--color-font);
   transition: color 0.15s;
   font-size: 0.8rem;
}

.barplot-main {
   background: var(--cell-panel);
   margin-top: 20px;
   border-radius: 15px;
   height: 300px;
}


.barplot-tooltip {
   backdrop-filter: blur(13px) saturate(120%);
   -webkit-backdrop-filter: blur(13px) saturate(120%);
   background-color: rgba(var(--cold-blue-rgb), 0.65);
   border-radius: 5px;
   box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.85);
   color: var(--color-font);
   font-size: .9rem;
   max-width: 320px;
   padding: .2rem .4rem;
   position: absolute;
   text-overflow: ellipsis;
   white-space: pre;
   z-index: 300;
   transition: opacity 0.25s;
   visibility: hidden;
   opacity: 1;
}

image.class-image {
   transform: translate(-13px, 7px);
   width: 26px;
}
</style>