#Ben Coxford, SN: 189006196

#This code has been moved to the server side.

#Azure IoTHub
from azure.iot.device import IoTHubDeviceClient, Message
import asyncio

CONNECTION_STRING = "HostName=VehicleManagement.azure-devices.net;DeviceId=VehicleTest;SharedAccessKey=vl45RfSx8JFenyKhKqhRdxYUJvFf/BNAlNjjsjM7r14="

class AzureHub():
    def __init__(self):
        self.client = IoTHubDeviceClient.create_from_connection_string(CONNECTION_STRING)
        
    def sendMessage(self, msg):
        self.client.send_message(msg)
        return "Message sent: " + msg
