#Ben Coxford, SN: 189006196

#HX711 Weight Sensor
from hx711 import HX711
import RPi.GPIO as GPIO
import time

#Set pin mode to BCM e.g. GPIO17
GPIO.setmode(GPIO.BCM)

#Set ratio for the HX711 Sensor to calibrate the scales.
ratio = None

class createNew():
    #Initialise the sensor and setup.
    def __init__(self, data, clock, ratio, weight):
        self.hx711 = None
        self.dataPin = data
        self.clockPin = clock
        self.ratio = ratio
        self.productWeight = weight
        self.setup()
        
    def setup(self):
        try:
            self.hx711 = HX711(dout_pin=self.dataPin, pd_sck_pin=self.clockPin)
            self.hx711.zero() #Tare the scales
            self.hx711.reset() #Reset by powering the sensor to HIGH then LOW>
            self.hx711.set_scale_ratio(self.ratio) #Set the ratio
        except Exception as e:
            print(e)
            GPIO.cleanup() #On exception cleanup the GPIO pins.
            
    def getProductCount(self):
        weight = -1 * self.hx711.get_weight_mean() #Return the mean weight in grams.
        if(weight > self.productWeight): #If the scale weight is above the product weight (avoid zero error) 
            productCount = round(weight, 0) // round(self.productWeight, 0) #Calculate the product count using division operation
            return productCount
        else:
            return 0
