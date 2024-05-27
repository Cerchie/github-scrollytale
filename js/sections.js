
/**
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */

import ResponseData from './github_data_processing.js';
import scroller from './scroller.js';

const responseData = new ResponseData; 


let owner = "";
let repo = "";

const f = document.getElementById("repo_owner_form")

f.addEventListener("submit", async (event) => {
  event.preventDefault()
  const chosenOwner = document.getElementById("owner").value
  owner = chosenOwner;
  const chosenRepo = document.getElementById("repo").value
  repo = chosenRepo;
  display(await createDataArray());

})
console.log(owner, repo)

var scrollVis = function () {


  // constants to define the size
  // and margins of the vis area.
  var width = 600;
  var height = 520;
  var margin = { top: 0, left: 20, bottom: 40, right: 10 };

  // Keep track of which visualization
  // we are on and which was the last
  // index activated. When user scrolls
  // quickly, we want to call all the
  // activate functions that they pass.
  var lastIndex = -1;
  var activeIndex = 0;

  // main svg used for visualization
  var svg = null;

  // d3 selection that will be used
  // for displaying visualizations
  var g = null;

    // When scrolling to a new section
  // the activation function for that
  // section is called.
  var activateFunctions = [];
  var updateFunctions = [];


  /**
   * chart
   *
   * @param selection - the current d3 selection(s)
   *  to draw the visualization in. For this
   *  example, we will be drawing it in #vis
   */
  var chart =  function (selection) {

    selection.each(async function (rawData) {


      // create svg and give it a width and height
      svg = d3.select(this).selectAll('svg').data([rawData]);
      var svgE = svg.enter().append('svg');
      // @v4 use merge to combine enter and existing selection
      svg = svg.merge(svgE);

      svg.attr('width', width + margin.left + margin.right);
      svg.attr('height', height + margin.top + margin.bottom);

      svg.append('g');


      // this group element will be used to contain all
      // other elements.
      g = svg.select('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      let languages = await responseData.getLanguages(owner, repo);
      let topTenContributors = await responseData.getTopTenContributors(owner, repo);
      let starGazersAndForks = await responseData.getStargazersAndForks(owner, repo);
      let maintenance = await responseData.getLengthActive(owner, repo);
      let size = await responseData.getSize(owner, repo);


      setupVis(languages, topTenContributors, starGazersAndForks, maintenance, size);

      setupSections();
    });

  };


  /**
   * setupVis - creates initial elements for all
   * sections of the visualization.
   */
  var setupVis = function (languages, topTenContributors, starGazersAndForks, maintenance, size) {

    g.append('text')
      .attr('class', 'openvis-title')
      .attr('x', width / 2)
      .attr('y', height / 3)
      .text("GITHUB REPO PROJECT");
      
    g.append('text')
      .attr('class', 'size-text')
      .attr('x', width / 2)
      .attr('y', height / 3)
      .text(size)
      .attr('opacity', 0);

    g.append('text')
      .attr('class', 'maintenance-text')
      .attr('x', width / 2)
      .attr('y', height / 3)
      .text(maintenance.created_at + ' / ' + maintenance.pushed_at)
      .attr('opacity', 0);

    g.append('text')
      .attr('class', 'stargazers-and-forks-text')
      .attr('x', width / 2)
      .attr('y', height / 3)
      .text(starGazersAndForks.stargazers_count + ' / ' + starGazersAndForks.forks_count)
      .attr('opacity', 0);

    g.append('text')
      .attr('class', 'top-contributors-text')
      .attr('x', width / 2)
      .attr('y', height / 3)
      .text(topTenContributors[0])
      .attr('opacity', 0);

    g.append('text')
      .attr('class', 'languages-text')
      .attr('x', width / 2)
      .attr('y', height / 3)
      .text(languages.Java)
      .attr('opacity', 0);
      

    g.append('text')
      .attr('class', 'end-text')
      .attr('x', width / 2)
      .attr('y', height / 3)
      .text('END')
      .attr('opacity', 0);
      
  };

  /**
   * setupSections - each section is activated
   * by a separate function. Here we associate
   * these functions to the sections based on
   * the section's index.
   *
   */
  var setupSections = function () {
    // activateFunctions are called each
    // time the active section changes
    activateFunctions[0] = showTitle;
    activateFunctions[1] = showLanguageComposition;
    activateFunctions[2] = showTopContributors;
    activateFunctions[3] = showStarGazersAndForks;
    activateFunctions[4] = showSize;
    activateFunctions[5] = showMaintenance;
    activateFunctions[6] = showEnd;

        // updateFunctions are called while
    // in a particular section to update
    // the scroll progress in that section.
    // Most sections do not need to be updated
    // for all scrolling and so are set to
    // no-op functions.
    for (var i = 0; i < 7; i++) {
      updateFunctions[i] = function () {};
    }


  /**
   * ACTIVATE FUNCTIONS
   *
   * These will be called their
   * section is scrolled to.
   *
   * General pattern is to ensure
   * all content for the current section
   * is transitioned in, while hiding
   * the content for the previous section
   * as well as the next section (as the
   * user may be scrolling up or down).
   *
   */



  
}


  /**
   * showTitle - initial title
   *
   * hides: count title
   * (no previous step to hide)
   * shows: intro title
   *
   */
  function showTitle() {
    g.selectAll('.openvis-title')
      .transition()
      .duration(600)
      .attr('opacity', 1.0);

      g.selectAll('.languages-text')
      .transition()
      .duration(0)
      .attr('opacity', 0);
  }

    /**
   * showLanguageComposition - show language composition
   *
   * hides: initial title
   * hides: showTopContributors
   * (no previous step to hide)
   * shows: languageComposition
   *
   */

function showLanguageComposition() {
    g.selectAll('.languages-text')
    .transition()
    .duration(600)
    .attr('opacity', 1.0);

    g.selectAll('.openvis-title')
    .transition()
    .duration(0)
    .attr('opacity', 0);

    g.selectAll('.top-contributors-text')
    .transition()
    .duration(0)
    .attr('opacity', 0);

  }


    /**
   * showTopContributors - show top contributors
   *
   * hides: showLanguageComposition
   * hides: showstarsandforks
   * (no previous step to hide)
   * shows: topContributors
   *
   */

   function showTopContributors() {

      g.selectAll('.top-contributors-text')
      .transition()
      .duration(600)
      .attr('opacity', 1.0);
  
      g.selectAll('.languages-text')
      .transition()
      .duration(0)
      .attr('opacity', 0);


      g.selectAll('.stargazers-and-forks-text')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    }


    /**
   * show - showStargazersAndForks 
   *
   * hides: showTopContributors
   * hides: showSize
   * (no previous step to hide)
   * shows stargazersAndForks
   *
   */

   function showStarGazersAndForks() {

      g.selectAll('.stargazers-and-forks-text')
      .transition()
      .duration(600)
      .attr('opacity', 1.0);
  
      g.selectAll('.top-contributors-text')
      .transition()
      .duration(0)
      .attr('opacity', 0);


      g.selectAll('.size-text')
      .transition()
      .duration(0)
      .attr('opacity', 0);
    }

   /**
   * showSize - show size
   *
   * hides: show stargazersAndForks
   * hides: showMaitenance
   * (no previous step to hide)
   * shows: size
   *
   */

   function showSize() {
        g.selectAll('.size-text')
        .transition()
        .duration(600)
        .attr('opacity', 1.0);

        g.selectAll('.maintenance-text')
        .transition()
        .duration(0)
        .attr('opacity', 0);

        g.selectAll('.stargazers-and-forks-text')
        .transition()
        .duration(0)
        .attr('opacity', 0);
   }

   /**
   * showMaintenance - show maintenance
   *
   * hides: showEnd
   * (no previous step to hide)
   * shows: Maintenance
   *
   */

 function showMaintenance() {

    g.selectAll('.maintenance-text')
    .transition()
    .duration(600)
    .attr('opacity', 1.0);

    g.selectAll('.size-text')
    .transition()
    .duration(0)
    .attr('opacity', 0);

    g.selectAll('.end-text')
    .transition()
    .duration(0)
    .attr('opacity', 0);
   }


   /**
   * showEnd - show end
   *
   * hides: showMaintenance
   * (no previous step to hide)
   * shows: End
   *
   */

function showEnd() {

    g.selectAll('.end-text')
    .transition()
    .duration(600)
    .attr('opacity', 1.0);

    g.selectAll('.maintenance-text')
    .transition()
    .duration(0)
    .attr('opacity', 0);
   }
   /**
   * activate -
   *
   * @param index - index of the activated section
   */
   chart.activate = function (index) {
    activeIndex = index;

    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
// if activateFunctions[i] is a function, then activateFunctions[i]() is a function call.
    scrolledSections.forEach(function (i) {
      activateFunctions[i]();
    });
    lastIndex = activeIndex;
  };

  chart.deactivate = function (index) {
    activeIndex = index;

    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    // if activateFunctions[i] is a function, then activateFunctions[i]() is a function call.
        scrolledSections.forEach(function (i) {
          activateFunctions[i]() = null;
        });
  }

  /**
   * update
   *
   * @param index
   * @param progress
   */
  chart.update = function (index, progress) {
    updateFunctions[index](progress);
  };

  // return chart function
  return chart;
}
/**
 * display - called once data
 * has been loaded.
 * sets up the scroller and
 * displays the visualization.
 *
 * @param data - loaded tsv data
 */


function display(data) {

  
 let plot = scrollVis();

  d3.select('#vis')
    .datum(data)
    .call(plot);

  // setup scroll functionality
  var scroll = scroller()
    .container(d3.select('#graphic'));

  // pass in .step selection as the steps
  scroll(d3.selectAll('.step'));

  // setup event handling
  scroll.on('active', function (index) {
    // highlight current step text
    d3.selectAll('.step')
      .style('opacity', function (d, i) { return i === index ? 1 : 0.1; });

    // activate current section
    plot.activate(index);
  });

  scroll.on('progress', function (index, progress) {
    plot.update(index, progress);
  });
}

async function createDataArray() {
  let languages = await responseData.getLanguages(owner, repo);
  let topTenContributors = await responseData.getTopTenContributors(owner, repo);
  let starGazersAndForks = await responseData.getStargazersAndForks(owner, repo);
  let maintenance = await responseData.getLengthActive(owner, repo);
  let size = await responseData.getSize(owner, repo);


  return [languages, topTenContributors, starGazersAndForks, maintenance, size]
}

