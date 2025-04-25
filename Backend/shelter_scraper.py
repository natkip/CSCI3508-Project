from abc import ABC, abstractmethod
import json
import requests
import webbrowser
import httpx
from selectolax.parser import HTMLParser
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import pandas as pd
import time

''' Strategy Design interface as different websites
    require different behavior to successfully scrape
    information.
'''
class WebsiteStrategy(ABC):
    driver_options = Options() #allows for options to be used with the driver
    driver_options.headless = True  # Run in headless mode (no GUI)
    try:
        driver = webdriver.Firefox(options=driver_options)  # Use Firefox WebDriver
    except Exception as e:
        print(f"Error initializing WebDriver: {e}")
        exit() #driver failed to initialize, quit program
    
    # Define implicit waiting time for the page to load
    driver.implicitly_wait(360)

    @abstractmethod
    def scrape(self, driver):
        raise NotImplementedError("Subclasses should implement this!")


class ArrCOAnimalShelter(WebsiteStrategy):
    def __init__(self):
        self.link = ("https://arrcolorado.org/dogs/", "https://arrcolorado.org/cats/") #this website has different sections for dogs and cats


    def scrape(self):
        self.driver.get(self.link[0])
        
        #create a dictionary to store the animal information
        dog_dict = {}

        #find table rows with the animal information
        animal_table = self.driver.find_elements(By.CSS_SELECTOR, "td")
        td_counter = 0
        animal_id = 1
        for animal in animal_table:
            #the first two entries in the animal table are not animal information
            #so we skip them
            if (td_counter >= 2):
                animal_info = animal.text.split('\n')
                if (animal_info[0] == ""):
                    #if the first entry is empty, we skip it
                    continue
                else:
                    animal_key = f"arrco_dog_{animal_id}"
                    animal_id += 1
                    animal_name = animal_info[0]
                    animal_breed = animal_info[1]

                    #get src of the animal picture
                    animal_picture_link = animal.find_element(By.CSS_SELECTOR, "img").get_attribute("src")

                    #add the animal information to the dictionary
                    dog_dict[animal_key] = {
                        "name": animal_name,
                        "breed": animal_breed,
                        "picture": animal_picture_link
                    }

            #increment the animal table counter
            td_counter += 1
            
        print("Finished scraping process for Dogs")

        #turn the dictionary into a JSON object
        dog_json = json.dumps(dog_dict, indent=4)
        print("Dog JSON: ", dog_json)
        

        self.driver.get(self.link[1])
        
        animal_table = self.driver.find_elements(By.XPATH, "/html/body/div/div[2]/div/article/div/div/div/div/div/div/div[2]/div/div/div[1]/table/tbody")

        '''for this website -
             every first row is the animal's personal info (name, picture)
             and second row is the breed information'''

       #create a dictionary to store the animal information
        cat_dict = {}

        #find table rows with the animal information
        animal_table = self.driver.find_elements(By.CSS_SELECTOR, "td")
        td_counter = 0
        animal_id = 1
        for animal in animal_table:
            #the first two entries in the animal table are not animal information
            #so we skip them
            if (td_counter >= 2):
                animal_info = animal.text.split('\n')
                if (animal_info[0] == ""):
                    #if the first entry is empty, we skip it
                    continue
                else:
                    animal_key = f"arrco_cat_{animal_id}"
                    animal_id += 1
                    animal_name = animal_info[0]
                    animal_breed = animal_info[1]

                    #get src of the animal picture
                    animal_picture_link = animal.find_element(By.CSS_SELECTOR, "img").get_attribute("src")

                    #add the animal information to the dictionary
                    cat_dict[animal_key] = {
                        "name": animal_name,
                        "breed": animal_breed,
                        "picture": animal_picture_link
                    }

            #increment the animal table counter
            td_counter += 1
            
        print("Finished scraping process for Cats")

        #turn the dictionary into a JSON object
        cat_json = json.dumps(cat_dict, indent=4)
        print("Cat JSON: ", cat_json)
        
        #close the browser window
        self.driver.quit()

class DenverAnimalShelter(WebsiteStrategy):
    def scrape(self, driver, link):
        response = requests.get(link)
        soup = BeautifulSoup(response.text, 'html.parser')
        #print(soup.prettify())
        #animals = soup.find(class_='gridResultsContinerInner')
        #print(animals)
        # for animal in animals:
        #     for animal_info in animal:
        #         name = animal_info.find('line_Name')
        #         print(f"Name: {name}")

class PawsCoAnimalShelter(WebsiteStrategy):
    def scrape(self, link):
        response = requests.get(link)
        soup = BeautifulSoup(response.text, 'html.parser')
        print(soup.prettify())
        #animals = soup.find(class_='gridResultsContinerInner')
        #print(animals)
        # for animal in animals:
        #     for animal_info in animal:
        #         name = animal_info.find('line_Name')
        #         print(f"Name: {name}")

class WebsiteProcessor:
    def __init__(self, strategy: WebsiteStrategy):
        self._strategy = strategy
        
    def set_strategy(self, strategy: WebsiteStrategy):
        self._strategy = strategy

    def scrape_website(self):
        self._strategy.scrape()

def main():
    # URL of the Denver Animal Shelter adoptable pets page
    den_animal_url = "https://www.denvergov.org/Government/Agencies-Departments-Offices/Agencies-Departments-Offices-Directory/Animal-Shelter/Adopt-a-Pet/Adoptable-Pets-Online"
    
    #pawsco will be easier than denver animal shelter
    pawsco_url = "https://pawsco.org/adopt"
   
    print("Start scraping program")
    
    #start scraping Animal Rescue of the Rockies Shelter for information
    ArrCO_scraper = WebsiteProcessor(ArrCOAnimalShelter())
    ArrCO_scraper.scrape_website()

if __name__ == "__main__":
    main()