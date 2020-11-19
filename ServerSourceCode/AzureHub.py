#Ben Coxford, SN: 189006196

#Azure IoTHub
from azure.iot.device import IoTHubDeviceClient, Message
import asyncio

#IOT Hub Connection String
CONNECTION_STRING = "HostName=VehicleManagement.azure-devices.net;DeviceId=VehicleTest;SharedAccessKey=vl45RfSx8JFenyKhKqhRdxYUJvFf/BNAlNjjsjM7r14="

class AzureHub():
    def __init__(self):
        #Create a new client to the IoT Hub.
        self.client = IoTHubDeviceClient.create_from_connection_string(CONNECTION_STRING)
        
    def sendMessage(self, msg):
        #Send message to hub.
        self.client.send_message(msg)
