#Ben Coxford, SN: 189006196

#DHT22 Temperature Sensors
import Adafruit_DHT as dht

class DHT22():
    #Initialise Pins and Sensor
    def __init__(self, pin):
        self.pin = pin
        self.sensor = dht.DHT22
        
    def read(self): ##Read the temperature and humidity values and return to 2 decimal places.
        humidity, temperature = dht.read_retry(self.sensor, self.pin)
        return round(humidity, 2), round(temperature, 2)
