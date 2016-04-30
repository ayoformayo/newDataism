import React from 'react';
import Router from 'react-router';
import d3 from 'd3';
import topojson from 'topojson';
import SVGContainer from './SvgContainer';
import classNames from 'classnames'

class UBHeatMap extends React.Component {

  drawMe(){

  }

  get path() {
    const height = window.innerHeight,
    width =  window.innerWidth;
    const scale = width * 0.9;
    const projection = d3.geo.albersUsa()
        .scale(scale)
        .translate([width / 2, height / 2]);
    return d3.geo.path()
      .projection(projection);
  }

  renderStates() {
    const usBoundaries = this.props.dataPoints
    const height = window.innerHeight,
    width =  window.innerWidth;
    const scale = width * 0.9;
    const projection = d3.geo.albersUsa()
        .scale(scale)
        .translate([width / 2, height / 2]);
    const path = d3.geo.path()
      .projection(projection);
    const subunits = topojson.feature(usBoundaries, usBoundaries.objects.units);
    const destination_count = usBoundaries.destination_count;
    const ramp = d3.scale.linear().domain([destination_count.max.val,destination_count.min.val]).range(["red","blue"]);

    return subunits.features.map((subunit, i) => {
      const unitClass = 'us-state ' + subunit.id;
      const val = destination_count[subunit.properties.name] ? destination_count[subunit.properties.name] : 0;
      const color = ramp(val);
      return(
        <path className={unitClass} style={{fill: color}} d={path(subunit)}/>
      )
    });
  }

  renderOuterBoundaries() {
    const usBoundaries = this.props.dataPoints;
    const datum = topojson.mesh(usBoundaries, usBoundaries.objects.units, (a, b) => { return a !== b ; })
    return(
      <path className='us_subunit-boundary' d={this.path(datum)}/>
    )
  }

  renderInnerBoundaries() {
    const usBoundaries = this.props.dataPoints;
    const datum = topojson.mesh(usBoundaries, usBoundaries.objects.units, (a, b) => { return a === b; });
    return(
      <path d={this.path(datum)} className='my_subunit-boundary'/>
    )
  }

  render(){
    if(this.props.dataPoints.length <= 0) return <p/>
    return (
      <SVGContainer className='heat-map-container' onMount={this.drawMe}>
        {this.renderStates()}
        {this.renderOuterBoundaries()}
        {this.renderInnerBoundaries()}
      </SVGContainer>
    )
  }
}

export default UBHeatMap;
