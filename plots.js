function init() {
    var selector = d3.select("#selDataset");
    
    d3.json("samples.json").then((data) => {
        console.log(data);
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
            .append("option")
            .text(sample)
            .property("value", sample);
        });
    })}
  
init();

function optionChanged(newSample) {
    console.log(newSample);
}

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");

        PANEL.html("");
        for (const [key, value] of Object.entries(result)) {

            PANEL.append("h6").text(key + ": " + value);
        }

        });
}

function buildCharts(sample) {
    //d3.json("samples.json").then((data) => {
    //var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // Sort the cities by growth
    var sortedBacteria = result.sort((a,b) =>
    a.sample_values - b.sample_values).reverse(); 

    // Select top five cities by population growth
    var topTenBacteria = sortedBacteria.slice(0,10);

    // Create arrays for top five city names and top five growth figures
    var topTenBacteriaNames = topTenBacteria.map(bacteria => bacteria.otu_labels);
    var topTenBacteriaValues = topTenBacteria.map(city => parseInt(bacteria.sample_values));

    // Create bar chart
    var trace = {
    x: topTenBacteriaNames,
    y: topTenBacteriaValues,
    type: "bar"
    };
    var data = [trace];
    var layout = {
        title: "Most Rapidly Growing Cities",
        xaxis: { title: "City" },
        yaxis: { title: "Population Growth, 2016-2017"}
    };
    Plotly.newPlot("bar-plot", data, layout);
    //})
}

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}

