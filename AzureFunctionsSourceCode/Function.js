module.exports = function (context, IoTHubMessages) {
    context.log(`JavaScript eventhub trigger function called for message array: ${IoTHubMessages}`);

    var datetime = "";
    var temperature = 0;
    var humidity = 0;
    var deviceID = "";
    var productCount = 0;

    IoTHubMessages.forEach(message => {
        datetime = message.datetime;
        temperature = message.temperature;
        humidity = message.humidity;
        deviceID = message.deviceID;
        productCount = message.productCount;
    });

    var output = {
        "deviceID": deviceID,
        "datetime": datetime,
        "productCount": productCount,
        "temperature": temperature,
        "humidity": humidity
    };

    context.log(`Output content: ${output}`);

    context.bindings.outputDocument = output;

    context.done();
};