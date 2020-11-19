#Ben Coxford, 189006196

print("Program starting...")

#Classes
import DHT22 as dht
import I2CDisplay as oled
import HX711Sensor as hx
import Client as client

#Other Modules
import time
import random
import time
import json
import os
import datetime
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)

#Formatting
degreesCelsius = chr(176) + "C"
messageFormat = '{{"deviceID": {deviceID}, "datetime": {datetime}, "temperature": {temperature}, "humidity": {humidity}, "productCount": {productCount}}}'

#I2C Multiplexer
import board
import busio
import adafruit_tca9548a as tca9548a
i2c = busio.I2C(board.SCL, board.SDA)
tca = tca9548a.TCA9548A(i2c)

client = client.Socket()

#HX711 Sensors
#Top Left [4, 5] Works
#Top Right [17, 27] Does not work
#Bottom Left [22, 6] Does not work
#Bottom Right [13, 9]

#DHT22 Sensors
#Top 24
#Bottom 18 

#OLED Displays
#Top 1
#Bottom 0

#Add Multiple Devices
devices = [{
        "deviceID": 2,
        "dht": 24,          
        "display": 1,
        "hx711": [4, 17], 
        "productWeightGrams": 150,
        "ratio": 46},
        {
        "deviceID": 1,
        "dht": 24,          
        "display": 1,
        "hx711": [27, 22], 
        "productWeightGrams": 150,
        "ratio": 46},
        {
        "deviceID": 3,
        "dht": 18,          
        "display": 0,
        "hx711": [13, 19], 
        "productWeightGrams": 150,
        "ratio": 46},
        {
        "deviceID": 4,
        "dht": 18,          
        "display": 0,
        "hx711": [5, 6], 
        "productWeightGrams": 150,
        "ratio": 46}]

def main():
    
    for i in devices:
        dhtSensor = dht.DHT22(i["dht"])
        display = oled.I2CDisplay(tca, i["display"])
        weightSensor = hx.createNew(i["hx711"][0], i["hx711"][1], i["ratio"], i["productWeightGrams"])
        i["hx711"] = weightSensor
        i["dht"] = dhtSensor
        i["display"] = display
    print("Sensors initialised...")
    
    minuteBoolean = False
    while True:
        
        currentDatetime = datetime.datetime.now()
        currentMinute = currentDatetime.minute
                
        for i in devices:
            humidity, temperature = i["dht"].read()
            i["display"].changeText(str(temperature) + degreesCelsius)
        
        if(currentMinute % 5 == 0 and minuteBoolean == False):
            minuteBoolean = True
            for i in devices:
                productCount = i["hx711"].getProductCount()
                datetimeString = str(currentDatetime.strftime('%Y-%m-%dT%H:%M:%S.%f%z'))
                datetimeJSON = json.dumps(datetimeString)
                message = messageFormat.format(deviceID = i["deviceID"], datetime = datetimeJSON, temperature = temperature, humidity = humidity, productCount = productCount)
                client.sendMessage(message)
        
        if(currentMinute % 5 != 0):
            minuteBoolean = False

        time.sleep(1)
    
if __name__ == '__main__':
    try:
        print("System started...")
        main()
    except KeyboardInterrupt:
        GPIO.cleanup()
        print ("System stopped...")
        
        
        
        