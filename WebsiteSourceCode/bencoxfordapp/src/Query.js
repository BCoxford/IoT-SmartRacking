/* Import Libraries */
import React, {Component} from 'react';
import './App.css';
import Chart from 'chart.js';

/* Import CosmosDB and Config File */
const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./config");

/* Create a client using configurations. */
const { endpoint, key, databaseId, containerId } = config;
const client = new CosmosClient({ endpoint, key });

/* Access the container. */
const database = client.database(databaseId);
const container = database.container(containerId);

/* SQL Queries. */
const queryA = {
    query: 'SELECT c.deviceID, c.datetime, c.productCount FROM c'
}; 

const queryD = {
    query: 'SELECT c.deviceID, c.datetime, c.humidity FROM c'
}; 

const queryC = {
    query: 'SELECT c.deviceID, c.datetime, c.temperature FROM c'
}; 

class Query extends Component {

    constructor() {
        super();
        this.chartA = React.createRef();
        this.chartB = React.createRef();
        this.chartC = React.createRef();
        this.chartD = React.createRef();
        this.state = {
            error : null
        }
    }

    getRandomInt() {
        /* Return Random Integer (Random Colours). */
        var val = Math.floor(Math.random() * 256);
        return val;
    }

    async componentDidMount() {
        try {
            /* Fetch the data*/
            const { resources: itemsA } = await container.items
            .query(queryA)
            .fetchAll();

            const { resources: itemsD } = await container.items
            .query(queryD)
            .fetchAll();

            const { resources: itemsC } = await container.items
            .query(queryC)
            .fetchAll();

            /* Temporary Datastore*/
            let tmpA = []
            let tmpB = []
            let tmpC = []
            let tmpD = []

            /* Add all items to the array*/
            itemsA.forEach(itemA => {
                let date = new Date(itemA.datetime);
                let quantity = itemA.productCount;
                let currentData = {x: date, y: quantity};
                tmpA.push(currentData);
            });

            /* Set the line colour to a random value and create a dictionary for the graph */
            let color = "rgb(" + this.getRandomInt() + "," + this.getRandomInt() + "," + this.getRandomInt() + ")";
            let dataFormattedA = [{
                label: "All Stock",
                fill: false,
                backgroundColor: color,
                borderColor: color,
                data: tmpA
            }]

            /* Separate the values by deviceID */
            itemsA.forEach(itemB => {
                let date = new Date(itemB.datetime);
                let dataTmp = {x: date, y: itemB.productCount}
                if(tmpB.length === 0) {
                    let newArray = []
                    newArray.push(dataTmp)
                    tmpB.push([itemB.deviceID, newArray])
                }
                else {
                    let index = -1
                    for(let i = 0; i < tmpB.length; i++){
                        if(tmpB[i][0] === itemB.deviceID) {
                            index = i;
                        }
                    }
                    if(index !== -1) {
                        tmpB[index][1].push(dataTmp)
                    }
                    else {
                        let newArray = []
                        newArray.push(dataTmp)
                        tmpB.push([itemB.deviceID, newArray])
                    }
                }
            });

            /* Format the data and assign a random colour value. */
            let dataFormattedB = []
            for(let i=0; i < tmpB.length; i++) {
                let color = "rgb(" + this.getRandomInt() + "," + this.getRandomInt() + "," + this.getRandomInt() + ")";
                let current = {
                    label: tmpB[i][0],
                    fill: false,
                    backgroundColor: color,
                    borderColor: color,
                    data: tmpB[i][1]
                }
                dataFormattedB.push(current);
            }

            /* Separate the values by deviceID */
            itemsC.forEach(itemC => {
                let date = new Date(itemC.datetime);
                let dataTmp = {x: date, y: itemC.temperature.toFixed(2)}
                if(tmpC.length === 0) {
                    let newArray = []
                    newArray.push(dataTmp)
                    tmpC.push([itemC.deviceID, newArray])
                }
                else {
                    let index = -1
                    for(let i = 0; i < tmpC.length; i++){
                        if(tmpC[i][0] === itemC.deviceID) {
                            index = i;
                        }
                    }
                    if(index !== -1) {
                        tmpC[index][1].push(dataTmp)
                    }
                    else {
                        let newArray = []
                        newArray.push(dataTmp)
                        tmpC.push([itemC.deviceID, newArray])
                    }
                }
            });

            /* Format the data and assign a random colour value. */
            let dataFormattedC = []
            for(let i=0; i < tmpC.length; i++) {
                let color = "rgb(" + this.getRandomInt() + "," + this.getRandomInt() + "," + this.getRandomInt() + ")";
                let current = {
                    label: tmpC[i][0],
                    fill: false,
                    backgroundColor: color,
                    borderColor: color,
                    data: tmpC[i][1]
                }
                dataFormattedC.push(current);
            }

            /* Separate the values by deviceID */
            itemsD.forEach(itemD => {
                let date = new Date(itemD.datetime);
                let dataTmp = {x: date, y: itemD.humidity.toFixed(2)}
                if(tmpD.length === 0) {
                    let newArray = []
                    newArray.push(dataTmp)
                    tmpD.push([itemD.deviceID, newArray])
                }
                else {
                    let index = -1
                    for(let i = 0; i < tmpD.length; i++){
                        if(tmpD[i][0] === itemD.deviceID) {
                            index = i;
                        }
                    }
                    if(index !== -1) {
                        tmpD[index][1].push(dataTmp)
                    }
                    else {
                        let newArray = []
                        newArray.push(dataTmp)
                        tmpD.push([itemD.deviceID, newArray])
                    }
                }
            });

            /* Format the data and assign a random colour value. */
            let dataFormattedD = []
            for(let i=0; i < tmpD.length; i++) {
                let color = "rgb(" + this.getRandomInt() + "," + this.getRandomInt() + "," + this.getRandomInt() + ")";
                let current = {
                    label: tmpD[i][0],
                    fill: false,
                    backgroundColor: color,
                    borderColor: color,
                    data: tmpD[i][1]
                }
                dataFormattedD.push(current);
            }

            /* Create chart canvas and apply datasets */
            const canvasA = this.chartA.current.getContext("2d");
            const chartA = new Chart(canvasA, {
                type: 'line',
                data: { 
                    datasets: dataFormattedA
                },
                options: {
                    responsive: true,
                    scales: {
                        xAxes: [{
                            type: 'time',
                            distribution: 'linear',
                            time: {
                                unit: 'day', 
                                stepSize: 1
                            },
                            scaleLabel: {
                                display: true,
                                labelString: "Day"
                            }
                        }],
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: "Stock Levels (All Stock)"
                            }
                        }]
                    },
                    title: {
                        display: true,
                        text: 'Stock-Time Series Graph',
                        fontColor: 'black'
                    }
                }
            });

            /* Create chart canvas and apply datasets */
            const canvasB = this.chartB.current.getContext("2d");
            const chartB = new Chart(canvasB, {
                type: 'line',
                data: { 
                    datasets: dataFormattedB
                },
                options: {
                    responsive: true,
                    scales: {
                        xAxes: [{
                            type: 'time',
                            distribution: 'linear',
                            time: {
                                unit: 'day', 
                                stepSize: 1
                            },
                            scaleLabel: {
                                display: true,
                                labelString: "Day"
                            }
                        }],
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: "Product Quantity (Individual)"
                            }
                        }]
                    },
                    title: {
                        display: true,
                        text: 'Product-Time Series Graph',
                        fontColor: 'black'
                    }
                }
            });

            /* Create chart canvas and apply datasets */
            const canvasC = this.chartC.current.getContext("2d");
            const chartC = new Chart(canvasC, {
                type: 'line',
                data: { 
                    datasets: dataFormattedC
                },
                options: {
                    responsive: true,
                    scales: {
                        xAxes: [{
                            type: 'time',
                            distribution: 'linear',
                            time: {
                                unit: 'day', 
                                stepSize: 1
                            },
                            scaleLabel: {
                                display: true,
                                labelString: "Day"
                            }
                        }],
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: "Temeprature (C)"
                            }
                        }]
                    },
                    title: {
                        display: true,
                        text: 'Temperature-Time Series Graph',
                        fontColor: 'black'
                    }
                }
            });

            /* Create chart canvas and apply datasets */
            const canvasD = this.chartD.current.getContext("2d");
            const chartD = new Chart(canvasD, {
                type: 'line',
                data: { 
                    datasets: dataFormattedD
                },
                options: {
                    responsive: true,
                    scales: {
                        xAxes: [{
                            type: 'time',
                            distribution: 'linear',
                            time: {
                                unit: 'day', 
                                stepSize: 1
                            },
                            scaleLabel: {
                                display: true,
                                labelString: "Day"
                            }
                        }],
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: "Humidity"
                            }
                        }]
                    },
                    title: {
                        display: true,
                        text: 'Humidity-Time Series Graph',
                        fontColor: 'black'
                    }
                }
            });

        } catch(error){
            this.setState({error: error.response });
        }
    }

    render() {
        return (
            <div style={{display: 'flex', flexFlow: 'row wrap', justifyContent: 'center', marginBottom: '5vh'}}>
                <div style={{float: 'left', boxShadow: '5px 5px #1D2023', backgroundColor: '#F8F9FA', padding: '5px', border: '5px solid #F8F9FA', borderRadius: '5px', marginTop: '5vh', marginRight: '2.5vw', position: 'relative', maxHeight: '50vh', width: '40vw'}}>
                    <canvas ref={this.chartA}/>
                </div>
                <div style={{float: 'right', boxShadow: '5px 5px #1D2023', backgroundColor: '#F8F9FA', padding: '5px', border: '5px solid #F8F9FA', borderRadius: '5px', marginTop: '5vh', marginLeft: '2.5vw', position: 'relative', maxHeight: '50vh', width: '40vw'}}>
                    <canvas ref={this.chartB}/>
                </div>

                <br></br>

                <div style={{float: 'left', boxShadow: '5px 5px #1D2023', backgroundColor: '#F8F9FA', padding: '5px', border: '5px solid #F8F9FA', borderRadius: '5px', marginTop: '5vh', marginRight: '2.5vw', position: 'relative', maxHeight: '50vh', width: '40vw'}}>
                    <canvas ref={this.chartC}/>
                </div>
                <div style={{float: 'right', boxShadow: '5px 5px #1D2023', backgroundColor: '#F8F9FA', padding: '5px', border: '5px solid #F8F9FA', borderRadius: '5px', marginTop: '5vh', marginLeft: '2.5vw', position: 'relative', maxHeight: '50vh', width: '40vw'}}>
                    <canvas ref={this.chartD}/>
                </div>
            </div>
        );
    } 
}

export default Query;
