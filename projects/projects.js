import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
let projects = [
  { title: "Project A", year: 2021 },
  { title: "Project B", year: 2021 },
  { title: "Project C", year: 2022 },
  { title: "Project D", year: 2022 },
  { title: "Project E", year: 2023 },
  { title: "Project F", year: 2023 },
  { title: "Project G", year: 2023 },
  { title: "Project H", year: 2024 },
  { title: "Project I", year: 2024 },
  { title: "Project J", year: 2024 },
];
let rolledData = d3.rollups(
  projects,
  v => v.length,
  d => d.year
);
let data = rolledData.map(([year, count]) => ({
  label: year,
  value: count
}));

let arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(50);

let sliceGenerator = d3.pie().value(d => d.value);
let arcData = sliceGenerator(data);

let colors = d3.scaleOrdinal(d3.schemeTableau10);
d3.select('#projects-plot')
  .selectAll('path')
  .data(arcData)
  .join('path')
  .attr('d', d => arcGenerator(d))
  .attr('fill', (d, i) => colors(i));

let legend = d3.select('.legend');
legend.selectAll('li')
  .data(data)
  .join('li')
  .attr('style', (d, i) => `--color:${colors(i)}`)
  .html(d => `<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);