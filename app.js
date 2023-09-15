const dataUrl = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

fetch(dataUrl)
  .then((response) => response.json())
  .then((data) => {
   scatterGraph(data);
});

let scatterGraph = (data) => {
  const width = 900;
  const height = 700;
  const padding = 50;
  
  let getYear = data.map((item) => {
    return item['Year'];
  })
  
  //generate svg
  let svg = d3
    .select('.main-section')
    .append("svg")
    .attr('width', width)
    .attr('height', height)
  
  //generate scale
  const xScale = d3
    .scaleLinear()
    .domain([d3.min(getYear) - 1, d3.max(getYear) + 1])
    .range([padding, width - padding])
  
  const yScale = d3
    .scaleTime()
    .domain([new Date(1970, 0, 1, 0, 39, 50), new Date(1970, 0, 1, 0, 36, 50)])
    .range([height - padding, padding])
  
  //generate axis
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));
  
  svg
    .append("g")
    .attr('id', 'x-axis')
    .attr("transform", `translate(0, ${height - padding})`)
    .call(xAxis);
  
   svg
    .append("g")
    .attr('id', 'y-axis')
    .attr("transform", `translate( ${padding}, 0)`)
    .call(yAxis);
  
  //generate tooltip
  let tooltip = d3
    .select('.main-section')
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0)
  
  //generate dots
  svg
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('data-xvalue', (d) => d['Year'])
    .attr('data-yvalue', (d) => {
      const minRegex = /^[0-9]{2}/;
      const min = d['Time'].match(minRegex);
      const secRegex = /[0-9]{2}$/;
      const sec = d['Time'].match(secRegex);
      return new Date(1970, 0, 1, 0, min, sec);
    })
    .attr('r', 6)
    .attr('cx', (d) => xScale(d['Year']))
    .attr('cy', (d) => {
      const minRegex = /^[0-9]{2}/;
      const min = d['Time'].match(minRegex);
      const secRegex = /[0-9]{2}$/;
      const sec = d['Time'].match(secRegex);
      return yScale(new Date(1970, 0, 1, 0, min, sec));
    })
    .attr('fill', (d) => d["URL"] === "" ? '#368B85' : '#EA5455')
    .attr("stroke", "#343434")
    .attr('index', (d, i) => i)
    .on("mouseover", function(d){
        let i = this.getAttribute('index');

        tooltip.transition()
                 .duration(100)
                 .style("opacity", 0.9)
                 .attr('data-year', d['Year']);
        tooltip.style("left", d3.event.pageX + 20 + "px")
                 .style("top", d3.event.pageY + 20 + "px");
        tooltip.html('Name: ' + d['Name'] + 
                     '<br/>' + 'Nationality: ' + d['Nationality']  + 
                    '<br/>' + 'Year: ' + d['Year'] + 
                    '<br/>' + 'Time: ' + d['Time'] + 
                    (d['Doping'] ? '<br/><br/>' + d['Doping'] : ''))
      })
     .on("mouseout", function(){
          tooltip.transition()
            .duration(100)
            .style("opacity", 0);
      });
}

