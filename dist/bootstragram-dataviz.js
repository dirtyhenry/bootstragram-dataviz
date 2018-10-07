// https://github.com/Bootstragram/bootstragram-dataviz v1.0.0 Copyright 2018 Bootstragram
var version = "1.0.0";

// Generated by CoffeeScript 2.3.2
/**
Basic comment so that JSDoc recognizes this.
*/
var D3Common;

D3Common = class D3Common {
  /**
   * This is a description of the constructor
   * @class
   * @classdesc This is a description of the Bootstragram.D3Common class.
   * @memberof Bootstragram
   */
  constructor(opts) {
    var ref, ref1;
    if (typeof lang === "undefined" || lang === null) {
      console.error("lang not set");
    }
    this.verbose = false;
    // Overridable variables
    this.parentId = opts.parentId || 'defaultPlotID';
    /**
     * The key for the X variable in the source data
     * @member {string}
     * @default 'x'
     */
    this.xVar = opts.csvHeaderForX || 'x';
    /**
     * The key for the Y variable in the source data
     * @member {string}
     * @default 'y'
     */
    this.yVar = opts.csvHeaderForY || 'y';
    // Axes names
    this.xAxisName = (ref = this._localizedString(opts.xLegend, lang)) != null ? ref : 'x';
    this.yAxisName = (ref1 = this._localizedString(opts.yLegend, lang)) != null ? ref1 : 'y';
    // Alisases for tooltip
    this.xAlias = opts.xLegendAlias || 'x';
    this.yAlias = opts.yLegendAlias || 'y';
    this.margin = {
      top: (opts.margin && opts.margin.top) || 5,
      right: (opts.margin && opts.margin.right) || 5,
      bottom: (opts.margin && opts.margin.bottom) || 5,
      left: (opts.margin && opts.margin.left) || 5
    };
    this.padding = {
      top: (opts.padding && opts.padding.top) || 20,
      right: (opts.padding && opts.padding.right) || 20,
      bottom: (opts.padding && opts.padding.bottom) || 60,
      left: (opts.padding && opts.padding.left) || 60
    };
    this.displayRatio = opts.displayRatio || 1.61803; // Golden number
    
    // Computed variables
    this.parentSel = '#' + this.parentId;
    this.plotId = "svg" + this.parentId;
    this.plotSel = '#' + this.plotId;
    // Dimensions of the SVG
    this.svgWidth = parseInt($(this.parentSel).width()) - this.margin.left - this.margin.right;
    if (opts.forceGraphHeight) {
      this.svgHeight = opts.forceGraphHeight + this.padding.top + this.padding.bottom;
    } else {
      this.svgHeight = parseInt(this.svgWidth / this.displayRatio) - this.margin.top - this.margin.bottom;
    }
    this.graphWidth = this.svgWidth - this.padding.left - this.padding.right;
    this.graphHeight = this.svgHeight - this.padding.top - this.padding.bottom;
    // Padding between points and edges of graph, as a proportion of domain
    //TODO: add to options?
    this.innerPadding = {
      top: 0.02,
      right: 0.02,
      bottom: 0.02,
      left: 0.02
    };
    // Padding between tick labels and axis, grid
    //TODO: add to options?
    this.xPaddingLabels = 10;
    this.yPaddingLabels = 10;
    // Shift tooltip from pointer in px, changed when near right border
    //TODO: add to options?
    this.xTooltipShift = 16;
    this.yTooltipShift = 0;
    // When pointer distance from right side less than tooltipInbound uses Alt
    //TODO: add to options?
    this.tooltipInbound = 100;
    this.xTooltipShiftAlt = -50;
    this.yTooltipShiftAlt = 20;
    // Tooltip opacity, time to transition on-off
    this.tooltipOpacity = 0.9;
    this.tooltipTransitionOn = 500;
    this.tooltipTransitionOff = 200;
    // Choose number of ticks on axes and their size
    // TODO: make ticks dynamic for smartphones
    this.xTicks = 10;
    this.yTicks = 5;
    this.tickDimension = 5;
    // Create svg translated by margin

    // Create tooltip, attached to div
    this.tooltip = d3.select(this.parentSel).append("div").attr("class", "bsg-d3__tooltip").style("opacity", 0);
    // Define scales ranges using dimensions of graph
    this.xScale = d3.scaleLinear().range([0, this.graphWidth]);
    this.yScale = d3.scaleLinear().range([this.graphHeight, 0]);
  }

  /**
  Draw a grid based on the values of @xScale / @yScale
  and @xTicks / @yTicks
  */
  _drawGrid() {
    this.xGrid = d3.axisBottom(this.xScale).ticks(this.xTicks);
    this.yGrid = d3.axisLeft(this.yScale).ticks(this.yTicks);
    // Create grid and tick labels attached to graph
    this.graph.append("g").attr("class", "bsg-d3__grid bsg-d3__grid--x").attr("id", "x-grid").attr("transform", "translate(0," + this.graphHeight + ")").call(this.xGrid.tickSize(-this.graphHeight, 0, 0).tickPadding(this.xPaddingLabels));
    return this.graph.append("g").attr("class", "bsg-d3__grid bsg-d3__grid--y").attr("id", "y-grid").call(this.yGrid.tickSize(-this.graphWidth, 0, 0).tickPadding(this.yPaddingLabels));
  }

  _drawAxis(yRefValueForXAxis = 0, xRefValueForYAxis = 0) {
    // Define axes
    this.xAxis = d3.axisBottom(this.xScale).ticks(this.xTicks);
    this.yAxis = d3.axisLeft(this.yScale).ticks(this.yTicks);
    // Create axes, no tick labels attached to graph
    this.graph.append("g").attr("class", "bsg-d3__axis bsg-d3__axis-x").attr("id", "x-axis").attr("transform", "translate(0," + this.yScale(yRefValueForXAxis) + ")").call(this.xAxis.tickSize(this.tickDimension, 0, 0).tickFormat(""));
    return this.graph.append("g").attr("class", "bsg-d3__axis bsg-d3__axis-y").attr("id", "y-axis").attr("transform", "translate(" + this.xScale(xRefValueForYAxis) + ",0)").call(this.yAxis.tickSize(this.tickDimension, 0, 0).tickFormat(""));
  }

  _initSVG() {
    this.svg = d3.select(this.parentSel).append("svg").attr("id", this.plotId).attr("width", this.svgWidth).attr("height", this.svgHeight).append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    // Create background, attached to svg
    this.svg.append("rect").attr("width", this.svgWidth).attr("height", this.svgHeight).attr("class", "bsg-d3__background-rect");
    // Create graph group translated by padding
    return this.graph = this.svg.append("g").attr("transform", "translate(" + this.padding.left + "," + this.padding.top + ")");
  }

  _localizedString(opt, lang = 'en') {
    if (opt == null) {
      return null;
    }
    if (typeof opt === 'object' && (lang != null)) {
      return opt[lang];
    }
    if (typeof opt === 'string') {
      return opt;
    }
    console.error('Invalid opt: ', opt, ', lang: ', lang);
    return null;
  }

};

var D3Common$1 = D3Common;

// Generated by CoffeeScript 2.3.2
var Scatterplot;

Scatterplot = class Scatterplot extends D3Common$1 {
  constructor(csvURL, opts) {
    super(opts);
    this.csvURL = csvURL;
    this.verbose = true;
    // false is the only possible option otherwise it evaluates as (false or true) => ie always true
    this.showRegressionLine = opts.showRegressionLine || false;
    // TODO: what is is?
    // Answer: it's in case two dots are in the same location
    this.dataFilteredTooltip = opts.dataFilteredTooltip || false;
    // Choose dots, regression line dimensions
    this.dotRadius = 6;
    this.regLineStrokeWidth = 2;
  }

  _regLine(slope, intercept, x) {
    return slope * x + intercept;
  }

  _regLineInverse(slope, intercept, y) {
    return (1 / slope) * (y - intercept);
  }

  draw(callback = null) {
    var self;
    this._initSVG();
    self = this;
    // Load data, rest is wrapped in
    // TODO: error management
    d3.csv(this.csvURL).then(function(dataset) {
      var equationLatex, lr, regLineIntercept, regLineSlope, scatterPoints, xData, xIntMax, xIntMin, xLength, xMax, xMin, yData, yLength, yMax, yMin;
      // Change xVar, yVar to num
      dataset.forEach(function(d) {
        d[self.xVar] = +d[self.xVar];
        return d[self.yVar] = +d[self.yVar];
      });
      // Set up x y variables
      xData = dataset.map(function(d) {
        return d[self.xVar];
      });
      yData = dataset.map(function(d) {
        return d[self.yVar];
      });
      // Compute domains with extra room, making sure 0 is always included
      xLength = d3.max(xData) - Math.min(0, d3.min(xData));
      yLength = d3.max(yData) - Math.min(0, d3.min(yData));
      xMin = Math.min(0, d3.min(xData) - self.innerPadding.left * xLength);
      xMax = Math.max(0, d3.max(xData) + self.innerPadding.right * xLength);
      yMin = Math.min(0, d3.min(yData) - self.innerPadding.bottom * yLength);
      yMax = Math.max(0, d3.max(yData) + self.innerPadding.top * yLength);
      // Set scales domains according to min max dimensions
      self.xScale.domain([xMin, xMax]);
      self.yScale.domain([yMin, yMax]);
      self._drawGrid();
      self._drawAxis();
      // Add axes names attached to svg
      // TODO: too much fudging with paddings?
      self.svg.append("text").attr("class", "bsg-d3__axis-name bsg-d3__axis-name--x").attr("id", "x-axis-name").attr("x", (self.svgWidth - self.padding.left - self.padding.right) / 2 + self.padding.left).attr("y", self.svgHeight).attr("dy", "-0.75em").text(self.xAxisName); // adapts distance to bottom in term of font size
      self.svg.append("text").attr("class", "bsg-d3__axis-name bsg-d3__axis-name--y").attr("id", "y-axis-name").attr("x", 0 - (self.svgHeight - self.padding.top - self.padding.bottom) / 2 - self.padding.top).attr("y", 0).attr("dy", "1.25em").text(self.yAxisName); // adapts distance to left in term of font size
      // Create scatter points, attached to graph
      scatterPoints = self.graph.selectAll("circle").data(xData).enter().append("circle").attr("class", "bsg-d3__scatter-point").attr("cx", function(d) {
        return self.xScale(d);
      }).attr("cy", function(d, i) {
        return self.yScale(yData[i]);
      }).attr("r", self.dotRadius);
      // Add tooltip on mouseover and change stroke of selected point
      scatterPoints.on("mouseover", function(d, i) {
        var dataFiltered, tooltipHtml;
        // Create tooltip
        d3.select(this).attr("class", "bsg-d3__scatter-point bsg-d3__scatter-point--highlighted");
        self.tooltip.transition().duration(self.tooltipTransitionOn).style("opacity", self.tooltipOpacity);
        // Filter data for overlapping points
        dataFiltered = dataset.filter(function(d) {
          return d[self.xVar] === dataset[i][self.xVar] && d[self.yVar] === dataset[i][self.yVar];
        });
        // Create tooltip html
        tooltipHtml = "<span>" + self.xAlias + " = " + xData[i] + ", " + self.yAlias + " = " + yData[i];
        if (self.dataFilteredTooltip) {
          dataFiltered.map(function(d, i) {
            return tooltipHtml = tooltipHtml + "<br/>" + " " + "Average rating diff. = " + dataFiltered[i]["Mean"] + "</span>";
          });
        }
        // Fill and position tooltip, separate case when too close to right side #(instead could check for 'collision'?)
        if (d3.event.pageX < self.svgWidth - self.tooltipInbound) {
          return self.tooltip.html(tooltipHtml).style("left", (d3.event.pageX + self.xTooltipShift) + "px").style("top", (d3.event.pageY + self.yTooltipShift) + "px");
        } else {
          return self.tooltip.html(tooltipHtml).style("left", (d3.event.pageX + self.xTooltipShiftAlt) + "px").style("top", (d3.event.pageY + self.yTooltipShiftAlt) + "px");
        }
      });
      // Remove tooltip on mouseout
      scatterPoints.on("mouseout", function(d) {
        d3.select(this).attr("class", "bsg-d3__scatter-point");
        return self.tooltip.transition().duration(self.tooltipTransitionOff).style("opacity", 0);
      });
      if (self.showRegressionLine) {
        // Compute regression line data
        lr = self._linearRegression(yData, xData);
        regLineSlope = +lr["slope"];
        regLineIntercept = +lr["intercept"];
        // Create regression line, attached to graph
        // Compute x-coord intersection with graph area TODO: other method?
        xIntMin = 0;
        xIntMax = 0;
        if (regLineSlope < 0) {
          xIntMin = Math.max(xMin, self._regLineInverse(regLineSlope, regLineIntercept, yMax));
          xIntMax = Math.min(xMax, self._regLineInverse(regLineSlope, regLineIntercept, yMin));
        } else {
          xIntMin = Math.max(xMin, self._regLineInverse(regLineSlope, regLineIntercept, yMin));
          xIntMax = Math.min(xMax, self._regLineInverse(regLineSlope, regLineIntercept, yMax));
        }
        self.graph.append("line").attr("id", "reg-line").attr("x1", self.xScale(xIntMin)).attr("y1", self.yScale(self._regLine(regLineSlope, regLineIntercept, xIntMin))).attr("x2", self.xScale(xIntMax)).attr("y2", self.yScale(self._regLine(regLineSlope, regLineIntercept, xIntMax))).attr("class", "bsg-d3__line bsg-d3__line--regression").attr("stroke-width", self.regLineStrokeWidth);
        // Add line equation
        equationLatex = $('<p class="math" id="static-equation">' + '$$' + 'P=' + regLineSlope.toFixed(2) + '\\times GD+' + regLineIntercept.toFixed(2) + '$$' + '</p>');
        $("#static-equation-container").append(equationLatex);
        if (typeof MathJax !== "undefined" && MathJax !== null) {
          MathJax.Hub.Typeset("static-equation");
        } else {
          console.warn('MathJax is not available here');
        }
      }
      if (callback != null) {
        if (self.verbose) {
          console.debug('Calling callback');
        }
        return callback();
      }
    }).catch(function(error) {
      return console.log(error);
    });
    return this;
  }

  // Linear regression function, returns "slope", "intercept", "r2"
  _linearRegression(y, x) {
    var i, lr, n, sum_x, sum_xx, sum_xy, sum_y, sum_yy;
    lr = {};
    n = y.length;
    sum_x = 0;
    sum_y = 0;
    sum_xy = 0;
    sum_xx = 0;
    sum_yy = 0;
    i = 0;
    while (i < y.length) {
      sum_x += x[i];
      sum_y += y[i];
      sum_xy += x[i] * y[i];
      sum_xx += x[i] * x[i];
      sum_yy += y[i] * y[i];
      i++;
    }
    lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
    lr['intercept'] = (sum_y - lr.slope * sum_x) / n;
    lr['r2'] = Math.pow((n * sum_xy - sum_x * sum_y) / Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)), 2);
    return lr;
  }

  // TODO: parametrize this better
  // TODO: use a path instead of circles to draw this!
  drawExtraCurveForDraws() {
    var i, self, z1Var, z2Var;
    if (this.verbose) {
      console.debug('drawExtraCurveForDraws');
    }
    z1Var = [];
    z2Var = [];
    i = 0;
    while (i < 1370) { // TODO! Why 1370? number of data points?
      z1Var.push(-720 + i);
      z2Var.push(400 * Math.pow(10, (-720 + i) / 200) / Math.pow(1 + Math.pow(10, (-720 + i) / 400), 4));
      i++;
    }
    self = this;
    this.graph.selectAll("circle").data(z1Var).enter().append("circle").attr("class", "bsg-d3__scatter-point bsg-d3__scatter-point--lining").attr("cx", function(d) {
      return self.xScale(d);
    }).attr("cy", function(d, i) {
      return self.yScale(z2Var[i]);
    }).attr("r", 2);
    return this;
  }

};

var Scatterplot$1 = Scatterplot;

var index = {
  version,
  D3Common: D3Common$1,
  Scatterplot: Scatterplot$1
};

export default index;