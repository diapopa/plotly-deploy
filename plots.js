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


function buildCharts(idVal) {
        d3.json("samples.json").then((data) => {
            var samplesFromData = data.samples;
            //console.log(samplesFromData)
            var resultArray = samplesFromData.filter(sampleObj => sampleObj.id == idVal);
                    
            // Sort the cities by growth. Can only sort an array not a dictionary. 
            var sortedBacteria = resultArray.sort((a,b) =>
            a.sample_values - b.sample_values).reverse(); 

            //Grab the first value in the sorted array
            //var topTenOtuLabels = sortedBacteria[0].otu_labels.slice(0,10);

            //Grabbing the first 10 records in the array.
            var topTenBacteriaNames = sortedBacteria[0].otu_ids.slice(0,10); 
             
            //Adding otu to the names. 
            var i
            for (i=0;i< topTenBacteriaNames.length;i++){
                topTenBacteriaNames[i] = "OTU " + (topTenBacteriaNames[i].toString())  
            }

            var topTenBacteriaValues = sortedBacteria[0].sample_values.slice(0,10); 
            //console.log(topTenBacteriaNames);
            //console.log(topTenBacteriaValues);
            
            // Create bar chart
            var trace = {
                y: topTenBacteriaNames,
                x: topTenBacteriaValues,
                type: "bar",
                orientation: "h"
                };
            var data = [trace];
            var layout = {
                title: "title",
                xaxis: { title: "City" },
                yaxis: { title: "Population Growth, 2016-2017"}
            };
            Plotly.newPlot("bar-plot", data, layout);
            })
    }

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}

