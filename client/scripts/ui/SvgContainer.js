import React from 'react';
import classNames from 'classnames';
import d3 from 'd3';
class SvgContainer extends React.Component {
  componentDidMount() {
    const containerSelected = '.default-svg-container.' + this.props.className;
    const sectionHeight = window.innerHeight;
    const sectionWidth = window.innerWidth;
    const viewBox = '0 0 ' + sectionWidth + ' ' + sectionHeight;
    d3.select(containerSelected)
                  .append('svg')
                  .attr('viewBox', viewBox)
                  .attr('height', '100%')
                  .attr('width', '100%');
    this.props.onMount();
  }

  render() {
    let classHash = {
      'default-svg-container': true,
    };
    classHash[this.props.className]  = true;
    let containerClass = classNames(classHash);

    const height = window.innerHeight;
    const width = window.innerWidth;
    const viewBox = '0 0 ' + width + ' ' + height;

    return (
      <div className={containerClass} >
        <svg viewBox={viewBox} height='100%' width='100%'>
          {this.props.children}
        </svg>
      </div>
    );
  }
}

export default SvgContainer;
