import React from 'react';
import Router from 'react-router';
import d3 from 'd3';
import topojson from 'topojson';
import SVGContainer from './SvgContainer';

class UBHeatMap extends React.Component {

  drawMe(){
    var height = $('section').height(),
    width = $('section').width();

    var svg = d3.select('.default-svg-container.heat-map-container svg');
    var scale = width * 0.9;
    var projection = d3.geo.albersUsa()
        .scale(scale)
        .translate([width / 2, height / 2]);
    var path = d3.geo.path()
        .projection(projection);
    d3.xhr('/maps/ub_heat_map.json', (err, success) => {
      var usBoundaries = JSON.parse(success.response);
      var subunits = topojson.feature(usBoundaries, usBoundaries.objects.units);
      var destination_count = usBoundaries.destination_count;
      var blah = d3.scale.linear()
          .domain([destination_count.max.val, destination_count.min.val])
          .range(["white", "red"]);
          // console(blah(÷200))
          // console(blah)
          var ramp=d3.scale.linear().domain([destination_count.max.val,destination_count.min.val]).range(["red","blue"]);



        svg.selectAll('.states')
        .data(subunits.features)
        .enter()
        .append('path')
        .attr('class', (d) => { return 'us-state ' + d.id })
        .style("fill", (d) => {
          var val = destination_count[d.properties.name] ? destination_count[d.properties.name] : 0
        //   console.log(color);
        //   console(color(val))
          return ramp(val);})
        .attr("d", path);

      svg.append("path")
          .datum(topojson.mesh(usBoundaries, usBoundaries.objects.units, (a, b) => { return a !== b ; }))
          .attr("d", path)
          .attr("class", "us_subunit-boundary");
      svg.append("path")
          .datum(topojson.mesh(usBoundaries, usBoundaries.objects.units, (a, b) => { return a === b; }))
          .attr("d", path)
          .attr("class", "my_subunit-boundary");
    });
  }

  render(){
    return (
      <SVGContainer className='heat-map-container' onMount={this.drawMe}/>
    )
  }
}

module.exports = UBHeatMap;
