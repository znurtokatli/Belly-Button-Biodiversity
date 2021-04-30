var dataset_link = "data/samples.json";

//demographic info panel
function buildMetadata(sample) {
    d3.json(dataset_link).then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        // `#sample-metadata` selected
        var panel = d3.select("#sample-metadata");

        // cleared existing data
        panel.html("");

        Object.entries(result).forEach(([key, value]) => {
            panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });

    });
};

// create charts
function buildCharts(sample) {
    d3.json(dataset_link).then((data) => {
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        var barData = [
            {
                y: yticks,
                x: sample_values.slice(0, 10).reverse(),
                text: otu_labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h",
            }
        ];

        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, l: 150 }
        };

        Plotly.newPlot("bar", barData, barLayout);

        // bubblechart
        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: { t: 0 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            margin: { t: 30 }
        };
        var bubbleData = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
            }
        ];

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
};

function initializePage() {
    var selector = d3.select("#selDataset");

    d3.json(dataset_link).then((data) => {
        var sampleNames = data.names;

        sampleNames.forEach((sampleName) => {
            selector
                .append("option")
                .text(sampleName)
                .property("value", sampleName);
        });

        var firstSample = sampleNames[0];
        buildMetadata(firstSample);
        buildGauge(firstSample)
        buildCharts(newSample);

    });
};

function optionChanged(newSample) { 
    buildMetadata(newSample);
    buildCharts(newSample);
    buildGauge(newSample)
};

function buildGauge(sample) {
    d3.json(dataset_link).then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];

        var freq = result.wfreq; 

        var data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: freq,
                title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs Per Week" },
                type: "indicator",
                mode: "gauge+number+delta",
                delta: { reference: 0 },
                gauge: {
                    axis: { range: [null, 10] },
                    steps: [
                        { range: [0, 250], color: "lightblue" },
                        { range: [250, 400], color: "gray" }
                    ],
                    threshold: {
                        line: { color: "red", width: 4 },
                        thickness: 0.75,
                        value: 490
                    }
                }
            }
        ];

        var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', data, layout);
    });
};

initializePage();