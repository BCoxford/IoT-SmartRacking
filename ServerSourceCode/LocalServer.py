import socket
import os
from _thread import *
import AzureHub as azure
from azure.iot.device import IoTHubDeviceClient, Message
   
HOST = '192.168.1.107' #Server IP Address
PORT = 1234 #Port Number above 1024
MAX_CONNECTIONS = 5 #Set to maximum number of devices.

#Socket server listens to all devices.
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM) 
server.bind((HOST, PORT)) 
server.listen(MAX_CONNECTIONS)

#Azure IoT Hub Class
hub = azure.AzureHub()

def clientMessage(client):
    while True:
        data = client.recv(1024) #Retrieve the data from the client
        if data: #If data has been sent.
            data = data.decode('utf8') #Decode it to utf8.
            if (len(data) > 1): #If the data lenth is freater than 1.
                hub.sendMessage(Message(data)) #Send the data to the hub.
                print("Sent: " + data)
        else:
            break
    client.close() #On break, close the connection.
    
def Main():
    while True:
        client, address = server.accept() #Listen for new client and accept the connection.
        print("Device connected on " + str(address)) #Notify of device connection.
        start_new_thread(clientMessage ,(client,)) #Start new thread for each client.
    
if __name__ == '__main__':
    Main()
