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

    return (
      <div className={containerClass} >
        {this.props.children}
      </div>
    );
  }
}

export default SvgContainer;
