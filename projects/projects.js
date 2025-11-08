import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');
const title = document.querySelector('.projects-title');
title.textContent = `Projects (${projects.length})`;

function renderPieChart(projectsGiven) {
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  let newData = newRolledData.map(([year, count]) => ({
    label: year,
    value: count
  }));

  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let newArcData = newSliceGenerator(newData);
  let colors = d3.scaleOrdinal(d3.schemeTableau10);
  let legend = d3.select('.legend');
  legend.selectAll('li').remove();
  let svg = d3.select('#projects-plot');
  svg.selectAll('path').remove();
  let selectedIndex = -1;

  newArcData.forEach((arc, i) => {
    svg
      .append('path')
      .attr('d', newArcGenerator(arc))
      .attr('fill', colors(i))
      .style('cursor', 'pointer')
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;

        svg
          .selectAll('path')
          .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));

        legend
          .selectAll('li')
          .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));

          if (selectedIndex === -1) {
            renderProjects(projects, projectsContainer, 'h2');
          } else {
            let selectedYear = newData[selectedIndex].label;
            let filtered = projects.filter((p) => p.year === selectedYear);
            renderProjects(filtered, projectsContainer, 'h2');
        }

      });
  });

  legend
    .selectAll('li')
    .data(newData)
    .join('li')
    .attr('style', (d, i) => `--color:${colors(i)}`)
    .html((d) => `<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
}

renderPieChart(projects);

let query = '';
let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
  query = event.target.value.trim().toLowerCase();

  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query);
  });

  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});