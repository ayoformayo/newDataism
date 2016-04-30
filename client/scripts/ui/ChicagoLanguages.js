import React from 'react';
import d3 from 'd3';
import _ from 'underscore';
import SVGContainer from './SvgContainer';
import topojson from 'topojson';
import { ButtonGroup } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { DropdownButton } from 'react-bootstrap';
import { MenuItem } from 'react-bootstrap';

class ChicagoLanguages extends React.Component {

  constructor(props) {
    super(props);
    this.state =  { activelanguage: null, languages: null };
  }

  drawMe() {
    var height = $('section').height(),
    width = $('section').width();
    var color = d3.scale.category20();
    var svg = d3.select('.default-svg-container.language-map svg')
    var scaleRatio = 50;
    var scaleRatio = width < height ? 50 : 92.43;
    var scale = height * scaleRatio;
    d3.xhr('/maps/chicago_communities.json', (error, success) => {

      var projection = d3.geo.mercator()
          .center([-87.62, 41.86])
          .scale(scale)
          .translate([width / 1.4, height / 2.3]);

        var path = d3.geo.path()
            .projection(projection);

      var chicago = JSON.parse(success.response);
      var chicagoLanguages = chicago.languages;
      this.setState({languages: chicagoLanguages, activelanguage: chicagoLanguages[0]});
      var g = svg.append("g");
      var features = topojson.feature(chicago, chicago.objects.google_map);

      g.attr("id", "comms")
        .selectAll(".comms")
        .data(features.features)
        .enter().append("path")
        .attr('class', (d)=>{ return 'chicago-community'})
        .style('fill', (d)=>{
          var commValues = _.values(chicagoLanguages);
          var properValues = _.filter(commValues, (value)=>{
            return _.contains(chicagoLanguages, value);
          });

          var valueArray  = _.map(properValues, (lang)=>{return d.properties[lang]});
          var maxVal = Math.max.apply( Math, valueArray );
          var minVal = Math.min.apply( Math, valueArray );
          var ramp = d3.scale.linear().domain([maxVal,minVal]).range(["red","blue"]);

          return ramp(d.properties[this.state.activelanguage]);
        })
        .attr("d", path);
      var idGradient = "legendGradient";

      var linearGradient = svg.append("g")
        .append("defs")
        .append("linearGradient")
            .attr("id",idGradient)
            .attr("x1","100%")
            .attr("x2","0%")
            .attr("y1","0%")
            .attr("y2","0%");
      var colors = ['red', 'blue'];

      _.each(colors, (color,i)=>{
        linearGradient.append('stop')
          .attr('stop-color', color)
          .attr('stop-opacity', 1)
          .attr('offset', (d)=>{
            var percent = (i / (colors.length - 1));
            return percent;
          });
      });


      svg.append('text')
        .text('Foreign language popularity')
        .attr('width', 20)
        .attr('x', width * 0.1)
        .attr('y', height - height * 0.4);
      svg.append('text')
        .text('by Chicago neighborhood')
        .attr('width', 20)
        .attr('x', width * 0.1)
        .attr('y', height - height * 0.38);

      svg.append('rect')
        .attr("fill","url(#" + idGradient + ")")
        .attr('height', '10px')
        .attr('width', '250px')
        .attr('x', width * 0.1)
        .attr('y', height - height * 0.36);

        svg.append('text')
          .text('Least Popular')
          .attr('x', width * 0.1)
          .attr('y', height - height * 0.30);
        svg.append('text')
          .text('Most Popular')
          .attr('x', (width * 0.1) + 230)
          .attr('y', height - height * 0.30);

    });
  }

  handleClick(language){
    this.setState({activelanguage: language});
    var languages = this.state.languages;
    var communities = d3.selectAll('.chicago-community');
    communities.transition().style('fill', (d)=>{

      var commValues = _.values(languages);
      var properValues = _.filter(commValues, (value)=>{
        return _.contains(languages, value);
      });

      var valueArray  = _.map(properValues, (lang)=>{return d.properties[lang]});
      var maxVal = Math.max.apply( Math, valueArray );
      var minVal = Math.min.apply( Math, valueArray );
      var ramp = d3.scale.linear().domain([maxVal,minVal]).range(["red","blue"]);

      return ramp(d.properties[language]);
    });
  }

  renderMaterialButtons() {
    // var activelanguage = this.state.activelanguage || {};
    // var languages = this.state.languages || [];
    // var languageButtons = _.map((language)=>{
    //   return (
    //     <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
    //       <i class="material-icons">{language}</i>
    //     </button>
    //   );
    // });

    // return languageButtons;

    var activelanguage = this.state.activelanguage || {};
    var languages = this.state.languages || [];
    var languageButtons = _.map(languages, (language)=>{

      return(
        <button onClick={this.handleClick.bind(this, language)} classname="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
          <i classname="material-icons">{language}</i>
        </button>
      );
      // return <Button onClick={this.handleClick.bind(this, language)}>{language}</Button>
    });

    return languageButtons;
  }

  renderButtons() {
    var activelanguage = this.state.activelanguage || {};
    var languages = this.state.languages || [];
    var languageButtons = _.map(languages, (language, i)=>{
      return <MenuItem key={i} className="language-button" onSelect={this.handleClick.bind(this, language)}>{language}</MenuItem>
    });

    return languageButtons;
  }

  render() {
    var activelanguage = this.state.activelanguage || 'african_languages';
    return (
      <div>
        <DropdownButton id='language-picker' title={activelanguage}>
        // {this.renderButtons()}
        </DropdownButton>
        <SVGContainer className='language-map' onMount={this.drawMe.bind(this)}>
        </SVGContainer>
      </div>
    );
  }
}

export default ChicagoLanguages;
