// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Clear any existing metadata
    panel.html("");

    // Loop through each key-value pair in the metadata and append
    // new tags for each key-value in the filtered metadata
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
      
      let samples = data.samples;
  
      
      let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      let result = resultArray[0];
  
      let otu_ids = result.otu_ids;
      let otu_labels = result.otu_labels;
      let sample_values = result.sample_values;
  
      let bubbleData = [
        {
          x: otu_ids, // otu_ids as x-values
          y: sample_values, // sample_values as y-values
          text: otu_labels, // otu_labels as hovertext
          mode: 'markers', // setting the chart type to bubble
          marker: {
            size: sample_values, // sample_values as marker size
            color: otu_ids, // otu_ids as marker colors
            colorscale: 'Earth' // a colormap for better visualization
          }
        }
      ];
  
      let bubbleLayout = {
        title: "Bacteria Cultures Per Sample", // chart title
        margin: { t: 0 }, // minimal margin at the top
        hovermode: "closest", // hover mode for the markers
        xaxis: { title: "OTU ID" }, // x-axis label
        margin: { t: 30 }
      };
  
      // Render the bubble chart using Plotly
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
      let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(); // get top 10 OTUs, reversing for descending order
  
      let barData = [
        {
          y: yticks, // top 10 otu_ids as labels
          x: sample_values.slice(0, 10).reverse(), // top 10 sample_values
          text: otu_labels.slice(0, 10).reverse(), // top 10 otu_labels as hovertext
          type: "bar", // bar chart type
          orientation: "h" // horizontal orientation
        }
      ];
  
      let barLayout = {
        title: "Top 10 Bacteria Cultures Found", // chart title
        margin: { t: 30, l: 150 } // layout adjustments
      };
  
      
      Plotly.newPlot("bar", barData, barLayout);
    });
  }
  

  function init() {
    // Select the dropdown menu
    let selector = d3.select("#selDataset");
  
    // Load the data
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
      let sampleNames = data.names;
  
 
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Build the charts and metadata panel with the first sample
      let firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  

// Function for event listener
function optionChanged(newSample) {
  
    buildCharts(newSample);
    buildMetadata(newSample);
  }

// Initialize the dashboard
init();
