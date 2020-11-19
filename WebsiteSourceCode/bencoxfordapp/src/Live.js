/* Import Libraries */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Table from 'react-bootstrap/Table'

/* Import CosmosDB and Config File */
const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./config");

/* Create a client using configurations. */
const { endpoint, key, databaseId, containerId } = config;
const client = new CosmosClient({ endpoint, key });

/* Access the container. */
const database = client.database(databaseId);
const container = database.container(containerId);

/* Retrieve the current data and format to JSON ISO String */
var currentDate = new Date();
var minusDate = new Date();
minusDate.setMinutes(minusDate.getMinutes()-5);
currentDate.setHours(currentDate.getHours());
minusDate.setHours(minusDate.getHours());
var jsonDate = currentDate.toISOString();
var jsonMinusDate = minusDate.toISOString();

/* Retrieve all data in the last 5 minutes (Updates every 5 minutes). */
var statement = 'SELECT * FROM c WHERE c.datetime BETWEEN "' + jsonMinusDate + '" AND "' + jsonDate + '" ORDER BY c.datetime';

const querySpec = {
    query: statement
};

class Live extends Component {
    constructor() {
        super();
        this.state = {
            error : null,
            dataset: []
        }
    }

    async componentDidMount() {

        try {
            /* Fetch the data and push the items to an array. */
            const { resources: items } = await container.items.query(querySpec).fetchAll();

            let tmp = []

            items.forEach(item => {
                tmp.push(item);
            });

            this.setState({dataset: tmp});

        } catch(error){
            console.log(error.response);
        }
    }

    getDate(datetime) {
        /* Get the date from the datetime value */
        let date = datetime.substring(0,10);
        return date;
    }

    getTime(datetime) {
        /* Get the time from the datetime value */
        let time = datetime.substring(11,19);
        return time;
    }

    render() {
        const {error, dataset} = this.state;

        if(error){
            return <div>Error</div>
        } else if (typeof(dataset) !== undefined) {
            /* If any data has returned */
            return(
                    <Table table-responsive striped bordered hover variant="light">
                    <thead class="thead-dark">
                    <tr>
                        <th class="border border-dark text-center font-weight-light">Device ID</th>
                        <th class="border border-dark text-center font-weight-light">Date</th>
                        <th class="border border-dark text-center font-weight-light">Time</th>
                        <th class="border border-dark text-center font-weight-light">Temperature</th>
                        <th class="border border-dark text-center font-weight-light">Humidity</th>
                        <th class="border border-dark text-center font-weight-light">Product Quantity</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        //For each value, create a new row with the data formatted.
                        dataset.map(dataset => (
                            <tr>
                                <th class="text-center font-weight-light">{dataset.deviceID}</th>
                                <th class="text-center font-weight-light">{this.getDate(dataset.datetime)}</th>
                                <th class="text-center font-weight-light">{this.getTime(dataset.datetime)} BST</th>
                                <th class="text-center font-weight-light">{dataset.temperature.toFixed(2)}&#x2103;</th>
                                <th class="text-center font-weight-light">{dataset.humidity.toFixed(2)}</th>
                                <th class="text-center font-weight-light">{dataset.productCount}</th>
                            </tr>
                        ))
                    }
                    </tbody>
                    </Table>
            );
        }
        else {
            return <div>Loading data...</div>
        }   
    } 
}

export default Live;
