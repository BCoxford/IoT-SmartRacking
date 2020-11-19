#Socket programming Python
import socket

class Socket():
    def __init__(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.connect(('192.168.1.107', 1234)) #IP Address and Port
        
    def sendMessage(self, data):
        dataEncoded = data.encode() #Encode the data
        try:
            self.sock.send(dataEncoded) #Send the data to the server
            print("Message: " + str(data) + " sent.")
        except:
            print("Message could not be sent.")
