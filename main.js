// SET GLOBAL VARIABLES
const margin = { top: 50, right: 30, bottom: 60, left: 70 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create the SVG container and group element for the chart
const svgLine = d3.select("#lineChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


// LOAD AND TRANSFORM DATA
d3.csv("weather.csv").then(data => {
    // --- CASE 1: FLATTEN ---
    // 1.1: Rename and reformat
    data.forEach(d => {
        d.year = new Date(d.date).getFullYear(); // Parse date and get year
        d.precip = +d.average_precipitation; // Convert precipitation to numeric
    }); 

    console.log("=== CASE 1: FLATTEN ===");
    console.log("Raw data:", data);

    // 1.2: Filter (no filter needed)
    const filteredData1 = data;

    console.log("Filtered data 1:", filteredData1);

    // 1.3: GROUP AND AGGREGATE
    const groupedData1 = d3.groups(filteredData1, d => d.city, d => d.year)
        .map(([city, yearGroups]) => ({
            city,
            values: yearGroups.map(([year, entries]) => ({
                year,
                avgPrecipitation: d3.mean(entries, e => e.precip)
            }))
        }));

    console.log("Grouped data 1:", groupedData1);

    // 1.4: FLATTEN
    const flattenedData = groupedData1.flatMap(({ city, values }) =>
        values.map(({ year, avgPrecipitation }) => ({
            year,
            avgPrecipitation,
            city
        }))
    );

    console.log("Final flattened data:", flattenedData);
    console.log("---------------------------------------------------------------------");


// 2.2: Filter 
/*
    Filter the data to just the year of 2014.
*/
const filteredData2 = data.filter(d => new Date(d.date).getFullYear() === 2014);

// Check your work:
console.log("Filtered data 2:", filteredData2);

// 2.3: Group and aggregate
/*
    "For each [MONTH], I want the {average of} [AVERAGE], [ACTUAL], and [RECORD PRECIPITATION]."
*/
const groupedData2 = d3.groups(filteredData2, d => new Date(d.date).getMonth() + 1)
    .map(([month, entries]) => ({
        month,
        avgPrecip: d3.mean(entries, e => +e.average_precipitation),
        actualPrecip: d3.mean(entries, e => +e.actual_precipitation),
        recordPrecip: d3.mean(entries, e => +e.record_precipitation)
    }));

// Check your work:
console.log("Grouped data 2:", groupedData2);

// 2.4: FLATTEN (PIVOT)
const pivotedData = groupedData2.flatMap(({ month, avgPrecip, actualPrecip, recordPrecip }) => [
    { month, precip: avgPrecip, type: "Average" },
    { month, precip: actualPrecip, type: "Actual" },
    { month, precip: recordPrecip, type: "Record" }
]);

// Check your work:
console.log("Final pivoted data:", pivotedData);

});