'use strict';
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Glyphicon } from 'react-bootstrap';
import { Popover } from 'react-bootstrap';
import { OverlayTrigger } from 'react-bootstrap';
import _ from 'underscore';
import {Router, History} from 'react-router';
import classNames from 'classnames'

class OnePager extends React.Component {

  get PAGES() {
    return [
      [
        {
          displayName: 'Where to Get a Drink in NYC',
          displayText: "Check out a map of all of the Big Apple's drinking establishments",
          name: 'liquorLicenses',
          anchor: '#liquor_licenses',
          component: require('./LiquorMap')
        },
        {
          displayName: 'Interactive Language Map of Chicago',
          displayText: 'Explore the popularity of foreign languages in Chicago on a neighborhood basis.',
          name: 'chicagoLanguages',
          anchor: '#languages',
          component: require('./ChicagoLanguages')
        },
      ],
      [
        {
          displayName: 'Heat Map of UB moves',
          displayText: 'Popular Moves.',
          name: 'heatMap',
          anchor: '#heat_map',
          component: require('./UBHeatMap')
        },
        {
          displayName: 'Slack Chat Room experience',
          displayText: 'A visualization of UB Slack users and their chat room activity.',
          name: 'sankey',
          anchor: '#sankey',
          component: require('./Sankey')
        }
      ],
    ]
  }

  constructor(props, context) {
    super(props);
    this.state = {row: 0, col: 0, direction: 'down'};
    context.router
  }

  transitionViz(args){
    if(!this.moving){
      this.moving = true;
      let col = args.column;
      let row = args.row;

      switch(args.direction){
        case 'right':
          col++;
          break;
        case 'left':
          col--;
          break;
        case 'up':
          row--;
          break;
        case 'down':
          row++;
          break;
      }
      _.delay(() => {
        this.moving = false;
      }, 2000);
      if(row < 0) return;
      if(this.PAGES.length < row + 1) return;
      if(this.PAGES[row].length < col + 1) return;
      if(col < 0) return;

      const nextComp = this.PAGES[row][col];
      this.setState({direction: args.direction}, ()=> this.context.router.push(nextComp.name));
    }
  }

  renderComp(args){
    const colIndex = args.colIndex || 0;
    const rowIndex = args.rowIndex || 0;
    const obj = this.PAGES[args.row][args.col];
    const Page = obj.component;
    return (
      <section key={obj.name} style={{height: '100%', width: '100%', display: 'inline-block'}}>
        <a id={obj.name} />
        <Page ref={obj.name} />
      </section>
    );
  }

  renderArrows(args){
    const colIndex = args.colIndex || 0;
    const rowIndex = args.rowIndex || 0;
    let arrows = [];
    if(colIndex > 0) arrows.push({direction: 'left', name: 'chevron-left'});
    if(colIndex + 1 < this.PAGES[rowIndex].length) arrows.push({direction: 'right', name: 'chevron-right'});
    if(rowIndex > 0) arrows.push({direction: 'up', name: 'chevron-up'});
    if(rowIndex + 1 < this.PAGES.length) arrows.push({direction: 'down', name: 'chevron-down'});
    const arrowIcons = _.map(arrows, (arrow, i)=>{
      let options = {
        direction: arrow.direction,
        column: colIndex,
        row: rowIndex
      }
      let title;
      let description;
      let placement;
      switch(arrow.direction){
        case 'up':
          placement = 'bottom';
          title = this.PAGES[rowIndex-1][colIndex].displayName;
          description = this.PAGES[rowIndex-1][colIndex].displayText;
          break;
        case 'down':
          placement = 'top';
          title = this.PAGES[rowIndex+1][colIndex].displayName;
          description = this.PAGES[rowIndex+1][colIndex].displayText;
          break;
        case 'left':
          placement = 'right';
          title = this.PAGES[rowIndex][colIndex-1].displayName;
          description = this.PAGES[rowIndex][colIndex-1].displayText;
          break;
        case 'right':
          placement = 'left';
          title = this.PAGES[rowIndex][colIndex+1].displayName;
          description = this.PAGES[rowIndex][colIndex+1].displayText;
          break;
      }
      let popover = <Popover id='Popover' title={title}>{description}</Popover>
      return(
        <OverlayTrigger key={i} placement={placement} overlay={popover}>
          <Glyphicon glyph={arrow.name} onClick={this.transitionViz.bind(this, options)}/>
        </OverlayTrigger>
      );
    });
    return arrowIcons;
  }

  render(){
    const sectionHeight = window.innerHeight;
    const sectionWidth = window.innerWidth;
    let pageScoller = {
      perspective: sectionHeight +'px',
      MozPerspective: sectionHeight +'px',
      WebkitPerspective: sectionHeight +'px'
    };
    const direction = 'scroll-' + this.state.direction;
    const pageScollerHash = { 'pages-scroller': true };
    pageScollerHash[direction] = true;
    const pageScollerClass = classNames(pageScollerHash);
    const slug = this.props.params.slug || this.PAGES[0].name;
    const ref = this.refs[slug];
    let colIndex = 0;
    let rowIndex = 0;

    this.PAGES.forEach((row, rowI, array) => {

      row.forEach((element, colI) => {
        if(element.name === slug){
          colIndex = colI;
          rowIndex = rowI;
        };
      });

    });
    const arrowIcons = this.renderArrows({colIndex: colIndex, rowIndex: rowIndex});
    const page = this.renderComp({col: colIndex, row: rowIndex});

    return(
      <div className='pages-container' style={{height: '100%', width: '100%', position: "fixed"}} >
       <div className={pageScollerClass} style={pageScoller}>
         <div className='arrow-container' style={{width: '100%', height: '100%', position: 'absolute'}}>
           {arrowIcons}
         </div>
         <ReactCSSTransitionGroup transitionName='viz' transitionEnterTimeout={0} transitionLeaveTimeout={0}>
           {page}
         </ReactCSSTransitionGroup>
       </div>
     </div>
    )
  }
}

OnePager.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default OnePager;
