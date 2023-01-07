<script>
import * as d3 from 'd3'
import { object } from 'webidl-conversions';

export default {
   data() {
      return {
         histogram: null,
         distribution: [],
         toads: {
            '100': 1,
            '200': 2,
            '300': 3
         }
      }
   },

   mounted() {
      for (let i = 0; i < 40; i++) {
         // Demarcate by 100 ((4500-500) / 100 = 40)
         this.distribution.push([])
      }

      this.createDistribution()
      console.log(this.distribution)
      console.log(this.data[1].matches)
   },
   methods: {
      // Copyright 2021 Observable, Inc.
      // Released under the ISC license.
      // https://observablehq.com/@d3/histogram
      Histogram(data, {
            // value = () => 1, // convenience alias for x
            // domain, // convenience alias for xDomain
            // label, // convenience alias for xLabel
            format, // convenience alias for xFormat
            type = d3.scaleLinear, // convenience alias for xType
            x = j => j, // given d in data, returns the (quantitative) x-value
            y = d => 1, // given d in data, returns the (quantitative) weight
         // thresholds = this.data[1].matches.length, // approximate number of bins to generate, or threshold function
            thresholds = 40, // approximate number of bins to generate, or threshold function
            normalize, // whether to normalize values to a total of 100%
            marginTop = 20, // top margin, in pixels
            marginRight = 30, // right margin, in pixels
            marginBottom = 30, // bottom margin, in pixels
            marginLeft = 40, // left margin, in pixels
            width = 450, // outer width of chart, in pixels
            height = 200, // outer height of chart, in pixels
            insetLeft = 0.5, // inset left edge of bar
            insetRight = 0.5, // inset right edge of bar
            xType = type, // type of x-scale
            xDomain = [500, 4500], // [xmin, xmax]
            xRange =[marginLeft, width - marginRight], // [left, right]
            xLabel = "DPM", // a label for the x-axis
            xFormat = format, // a format specifier string for the x-axis
            yType = d3.scaleLinear, // type of y-scale
            yDomain = [0, 30], // [ymin, ymax]
            yRange =[height - marginBottom, marginTop], // [bottom, top]
            yLabel = "Game Frequency", // a label for the y-axis
            yFormat = normalize ? "%" : undefined, // a format specifier string for the y-axis
            color = "currentColor" // bar fill color
         } = {}) {
         // Compute values.
         const X = d3.map(data, x);
         const Y0 = d3.map(data, y);
         const I = d3.range(X.length);

         // Compute bins.
         const bins = d3.bin().thresholds(thresholds).value(i => X[i])(I);
         const Y = Array.from(bins, I => d3.sum(I, i => Y0[i]));
         if (normalize) {
            const total = d3.sum(Y);
            for (let i = 0; i < Y.length; ++i) Y[i] /= total;
         }

         // Compute default domains.
         if (xDomain === undefined) xDomain = [bins[0].x0, bins[bins.length - 1].x1];
         if (yDomain === undefined) yDomain = [0, d3.max(Y)];

         // Construct scales and axes.
         const xScale = xType(xDomain, xRange);
         const yScale = yType(yDomain, yRange);
         const xAxis = d3.axisBottom(xScale).ticks(width / 80, xFormat).tickSizeOuter(0);
         const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);
         yFormat = yScale.tickFormat(100, yFormat);

         const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

         svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(yAxis)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
               .attr("x2", width - marginLeft - marginRight)
               .attr("stroke-opacity", 0.1))
            .call(g => g.append("text")
               .attr("x", -marginLeft)
               .attr("y", 10)
               .attr("fill", "currentColor")
               .attr("text-anchor", "start")
               .text(yLabel));

         svg.append("g")
            .attr("fill", color)
            .selectAll("rect")
            .data(bins)
            .join("rect")
            .attr("x", d => xScale(d.x0) + insetLeft)
            .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - insetLeft - insetRight))
            .attr("y", (d, i) => yScale(Y[i]))
            .attr("height", (d, i) => yScale(0) - yScale(Y[i]))
            .append("title")
            .text((d, i) => [`${d.x0} ≤ x < ${d.x1}`, yFormat(Y[i])].join("\n"));

         svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(xAxis)
            .call(g => g.append("text")
               .attr("x", width - marginRight)
               .attr("y", 27)
               .attr("fill", "currentColor")
               .attr("text-anchor", "end")
               .text(xLabel));

         return svg.node();
      },

      renderHistogram() {
         return this.histogram = this.Histogram(this.distribution, {
            // value: d => d.damagePerMinute,
            color: "steelblue"
         }).outerHTML
      },

      createDistribution() {
         for (let i = 500; i < 4500; i+=100) {
            let upper = i + 100
            let arrIndex = (i - 500) / 100
            this.data[1].matches.forEach(match => {
               if (match.damagePerMinute > i && match.damagePerMinute < upper) {
                  this.distribution[arrIndex].push(match.damagePerMinute)
               }
            });
         }

      }
   },

   props: {
      data: null,
      championRender: String 
   }
}
</script>

<template>
   <div class="histogram-main">
      <span v-html="renderHistogram()"></span>
   </div>
</template>

<style scoped>
   .histogram-main {
      display: block;
      height: 450px;
   }
</style>