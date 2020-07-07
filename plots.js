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


function buildCharts(idVal) {
    d3.json("samples.json").then((data) => {
        var samplesFromData = data.samples;
        //console.log(samplesFromData)
        var resultArray = samplesFromData.filter(sampleObj => sampleObj.id == idVal);
        
        //console.log(result)
    
        // Sort the cities by growth. Can only sort an array not a dictionary. 
        var sortedBacteria = resultArray.sort((a,b) =>
        a.sample_values - b.sample_values).reverse(); 

        //Grab the first value in the sorted array
        //var resultSorted = sortedBacteria[0];
        //console.log(resultSorted);

        // Select top five cities by population growth
        var topTenOtuLabels = sortedBacteria.slice(0,10);
        console.log("top ten vals")
        //console.log(topTenOtuLabels[0]);

        // Create arrays for top five city names and top five growth figures
        var topTenBacteriaNames = topTenOtuLabels.map(bacteria => bacteria.otu_labels);
        var topTenBacteriaValues = topTenOtuLabels.map(bacteria => parseInt(bacteria.sample_values));

        console.log(topTenBacteriaNames);
        console.log(topTenBacteriaValues);
    })

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

