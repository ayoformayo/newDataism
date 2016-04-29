'use strict';
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { selectEndPoint, fetchVizDataIfNeeded, invalidateEndPoint } from '../actions'
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
          endPoint: 'maps/new_york',
          component: require('../ui/LiquorMap')
        },
        {
          displayName: 'Interactive Language Map of Chicago',
          displayText: 'Explore the popularity of foreign languages in Chicago on a neighborhood basis.',
          name: 'chicagoLanguages',
          anchor: '#languages',
          endPoint: 'maps/chicago_communities',
          component: require('../ui/ChicagoLanguages')
        },
      ],
      [
        {
          displayName: 'Heat Map of UB moves',
          displayText: 'Popular Moves.',
          name: 'heatMap',
          anchor: '#heat_map',
          endPoint: 'maps/ub_heat_map',
          component: require('../ui/UBHeatMap')
        },
        {
          displayName: 'Slack Chat Room experience',
          displayText: 'A visualization of UB Slack users and their chat room activity.',
          name: 'sankey',
          anchor: '#sankey',
          endPoint: 'slack',
          component: require('../ui/Sankey')
        }
      ],
    ]
  }

  constructor(props, context) {
    super(props)
    this.state = {row: 0, col: 0, direction: 'down'};
    this.handleChange = this.handleChange.bind(this)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
    context.router
  }

  componentDidMount() {
    const { dispatch } = this.props
    const {colIndex, rowIndex} = this.findCurrentComp();
    const thisComp = this.PAGES[rowIndex][colIndex]
    dispatch(fetchVizDataIfNeeded(thisComp.endPoint));
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, selectedEndpoint } = nextProps
    if (nextProps.selectedEndpoint !== this.props.selectedEndpoint) {
      const { dispatch, selectedEndpoint } = nextProps
      dispatch(fetchVizDataIfNeeded(selectedEndpoint))
    }
  }

  handleChange(nextEndPoint) {
    this.props.dispatch(selectEndPoint(nextEndPoint))
  }

  handleRefreshClick(e) {
    e.preventDefault()
    const { dispatch, selectedEndpoint } = this.props
    dispatch(invalidateEndPoint(selectedEndpoint))
    dispatch(fetchVizDataIfNeeded(selectedEndpoint))
  }

  transitionViz(args){
    const { dispatch } = this.props
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
      this.setState({direction: args.direction}, ()=> {
        this.context.router.push(nextComp.name);
        dispatch(fetchVizDataIfNeeded(nextComp.endPoint));
      });
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
        <Page ref={obj.name} dataPoints={this.props.dataPoints}/>
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

  findCurrentComp() {
    const slug = this.props.params.slug || this.PAGES[0].name;
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
    return { colIndex: colIndex, rowIndex: rowIndex };
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
    const {colIndex, rowIndex} = this.findCurrentComp();
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
    router: React.PropTypes.object.isRequired,
    selectedEndpoint: PropTypes.string.isRequired,
    dataPoints: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { selectedEndpoint, dataPointsByEndPoint } = state
  const {
    isFetching,
    lastUpdated,
    items: dataPoints
  } = dataPointsByEndPoint[selectedEndpoint] || {
    isFetching: true,
    items: []
  }

  return {
    selectedEndpoint,
    dataPoints,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(OnePager)
