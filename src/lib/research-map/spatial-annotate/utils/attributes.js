// Get attributes
export const getAttributes = (file) => {
    // Get Keys and unique values of the key if categorical assign data type
    // if continuous, get range
    try {
        let attributes = Object.entries(file.features[0].properties).map(([key, value]) => {
            let dataType;
            let range, numericValues;
            let uniqueValues = new Set();

            // Check for datatypes
            if (typeof value == 'number') {
                dataType = 'numeric';
                numericValues = file.features.map((feature) => feature.properties[key]);
                range = [
                    Math.round(Math.min(...numericValues) * 10) / 10,
                    Math.round(Math.max(...numericValues) * 10) / 10
                ];
            } else if (typeof value == 'string') {
                dataType = 'string';
                file.features.map((feature) => {
                    uniqueValues.add(feature.properties[key]);
                });
            } else if (typeof value == 'boolean') {
                dataType = 'boolean';
            }

            return {
                name: key,
                dataType: dataType,
                range: range,
                numericValues: numericValues,
                values: Array.from(uniqueValues)
            };
        });
        return attributes;
    } catch (error) {
        console.log(error);
    }
};