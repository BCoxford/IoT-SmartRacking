#Ben Coxford, SN: 189006196

#SSD1306 OLED Displays
#Import modules
import board
import busio
import adafruit_tca9548a as tca9548a #I2C Multiplexer
import adafruit_ssd1306 as ssd1306 #I2C Display
from PIL import Image, ImageDraw, ImageFont

i2c = busio.I2C(board.SCL, board.SDA)

class I2CDisplay():
    def __init__(self, tca, index):
        self.display = ssd1306.SSD1306_I2C(128, 32, tca[index]) #Initialise the display.
        self.display.fill(0) #Clear the display
        self.display.show() #Update the display
        self.width = self.display.width
        self.height = self.display.height
        self.image = Image.new("1", (self.width, self.height)) #Create a new image
        self.draw = ImageDraw.Draw(self.image) #Draw the image
        #Set the font type
        self.font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 15)

        #draw the text and update the display with new image
    def changeText(self, text):
        self.draw.rectangle((0,0, self.width, self.height), outline=0, fill=0)
        self.draw.text((self.width/4, self.height/2), text, font=self.font, fill=255)
        self.display.image(self.image)
        self.display.show()
