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
            var resultArray = samplesFromData.filter(sampleObj => sampleObj.id == idVal);
                    
            // Sort the cities by growth. Can only sort an array not a dictionary. 
            var sortedBacteria = resultArray.sort((a,b) =>
            a.sample_values - b.sample_values); 

            var topTenOtuLabels = sortedBacteria[0].otu_labels.slice(0,10);

            var topTenBacteriaNames = sortedBacteria[0].otu_ids.slice(0,10).reverse(); 

            var i
            for (i=0;i< topTenBacteriaNames.length;i++){
                topTenBacteriaNames[i] = "OTU " + (topTenBacteriaNames[i].toString())  
            }

            var topTenBacteriaValues = sortedBacteria[0].sample_values.slice(0,10).reverse(); 
            
            // Create bar chart
            var trace = {
                x: topTenBacteriaValues,
                y: topTenBacteriaNames,
                type: "bar",
                orientation: "h",
                text: topTenOtuLabels
                };
            var data = [trace];
            var layout = {
                title: "OTU"
            };
            Plotly.newPlot("bar-plot", data, layout);

            // Create bubble chart
            var trace1 = {
                x: sortedBacteria[0].otu_ids,
                y: sortedBacteria[0].sample_values,
                text: sortedBacteria[0].otu_labels,
                mode: 'markers',
                marker: {
                  color: sortedBacteria[0].otu_ids,
                  size: sortedBacteria[0].sample_values
                }
              };
              
              var data = [trace1];
              
              var layout = {
                showlegend: false
              };
              
              Plotly.newPlot('bubble-plot', data, layout);
            })


    }

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}

