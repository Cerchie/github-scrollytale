// // set the dimensions and margins of the graph
// const margin = {top: 30, right: 30, bottom: 70, left: 60},
//     width = 460 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;

// // append the svg object to the body of the page
// const svg = d3.select("#my_dataviz")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", `translate(${margin.left},${margin.top})`);

// X axis

const getLanguages = async (owner, repo) => {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`);
    const languages = await response.json();
    return languages;
  }




const x = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(d => Object.entries(d)))
  .padding(0.2);

svg.select("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

const yDomain = data.map(d => Object.entries(d)[1]);
// // Add Y axis
const y = d3.scaleLinear()
  .domain([0, yDomain])
  .range([ height, 0]);
svg.select("g")
  .call(d3.axisLeft(y));

// Bars
svg.selectAll("mybar")
  .data(data)
  .join("rect")
    .attr("x", d => x(Object.keys(d)))
    .attr("y", d => y(Object.values(d)))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.Value))
    .attr("fill", "#69b3a2")

      (async() => {
        await getLanguages("apache", "flink").then((data) => {Object.entries(data).forEach(([key, value]) => {
            console.log(`${key}: ${value}`);
        })});
      })();

