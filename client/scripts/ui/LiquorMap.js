'use strict';

import React from 'react';
import d3 from 'd3';
import topojson from 'topojson';
import SVGContainer from './SvgContainer';

class LiquorMap extends React.Component {
  drawMe(){
  }

  renderStores() {
    const height = $('section').height(),
    width = $('section').width();
    const color = d3.scale.category20();
    const svg = d3.select('.default-svg-container.liquor-map svg');
    const scaleRatio = width < height ? 50 : 92.43;
    const scale = height * scaleRatio;
    const projection = d3.geo.mercator()
                .center([-73.94, 40.70])
                .scale(scale)
                .translate([(width) / 2, (height)/2]);

    const path = d3.geo.path().pointRadius(1)
        .projection(projection);
    const stores = this.props.dataPoints.stores_2016.map((store, i) =>{
      let style = {
        fill: 'red'
        // 'fill': store.color = color(store.properties.name.replace(/ .*/, ''))
      }
      return(
        <path id={store.properties.name} key={i} className='new-york-store' style={style} d={path(store)}/>
      )
    });
    return stores
  }

  renderTextSpace() {
    const height = window.innerHeight;
    const width = window.innerWidth;
    const scaleRatio = width < height ? 50 : 92.43;
    const scale = height * scaleRatio;
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

    const textNameAttrs = {
      fill: 'white',
      textAnchor: textAnchor,
      fontSize: fontSize,
      x: textX,
      y: textY
    }

    const textDateAtts = {
        textAnchor: textAnchor,
        fill: 'white',
        fontSize: fontSize,
        x: textX,
        y: textY + 50
    }

    return(
      <g className='text-group'>
        <text {...textNameAttrs}>Places to Get a Drink</text>
        <text {...textDateAtts}>New York NY, May 2015</text>
      </g>
    )
  }

  render() {
    let stores = this.props.dataPoints ? this.renderStores(this.props.dataPoints.stores_2016) : <path />;

    return (
      <SVGContainer className='liquor-map' onMount={this.drawMe}>
        { this.renderTextSpace() }
        <g id='stores'>
          {stores}
        </g>
      </SVGContainer>
    );
  }
}


export default LiquorMap;
