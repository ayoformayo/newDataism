'use strict';

import React from 'react';
import d3 from 'd3';
import topojson from 'topojson';
import SVGContainer from './SvgContainer';

class LiquorMap extends React.Component {
  drawMe(){
    const height = $('section').height(),
    width = $('section').width();
    const color = d3.scale.category20();
    const svg = d3.select('.default-svg-container.liquor-map svg');
    const scaleRatio = width < height ? 50 : 92.43;
    const scale = height * scaleRatio;
    const textG = svg.append('g');
    const textName = textG.append('text');
    const textDate = textG.append('text');
    textG.attr('class', 'text-group')
    let textY;
    let textX;
    let fontSize;
    let textAnchor = 'left';
    if(width <= height){
      textAnchor = 'middle';
      textX = width * 0.5;
      fontSize = '32px';
      textY = height - (height * 0.2);
    }else {
      textAnchor = 'left';
      textX = width * 0.1;
      textY = 100;
      fontSize = '30px';
    }
    if(width < 768) fontSize = '14px';
    textName.text('Places to Get a Drink')
        .attr('fill', 'white')
        .attr('text-anchor', textAnchor)
        .attr('font-size', fontSize)
        .attr('x',textX)
        .attr('y', textY);
    textDate.text('New York NY, May 2015')
        .attr('text-anchor', textAnchor)
        .attr('fill', 'white')
        .attr('font-size', fontSize)
        .attr('x',textX)
        .attr('y', textY + 50);

    d3.xhr('/maps/new_york.json', (error, success) => {
      const projection = d3.geo.mercator()
                  .center([-73.94, 40.70])
                  .scale(scale)
                  .translate([(width) / 2, (height)/2]);

      const path = d3.geo.path().pointRadius(1)
          .projection(projection);

      const g = svg.append('g');

      const newYork = JSON.parse(success.response);
      g.append('g')
        .attr('id', 'boroughs')
        .selectAll('.state')
        .data(newYork.features)
        .enter().append('path')
        .attr('class', function(d){ return d.properties.name; })
        .attr('class', 'new-york-unit')
        .attr('d', path);
      g.append('g')
        .attr('id', 'stores')
        .selectAll('.stores')
        .data(newYork.stores)
        .enter().append('path')
        .attr('id', function(d){ return d.properties.name; })
        .attr('class', 'new-york-store')
        .style('fill', (d) => { return d.color = color(d.properties.name.replace(/ .*/, ''))})
        .attr('d', path);
    });
  }

  render() {
    return (
      <SVGContainer className='liquor-map' onMount={this.drawMe}/>
    );
  }
}


export default LiquorMap;
