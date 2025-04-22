from abc import ABC, abstractmethod
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
        
        animal_table = self.driver.find_elements(By.XPATH, "/html/body/div/div[2]/div/article/div/div/div/div/div/div/div[2]/div/div/div[1]/table/tbody")

        '''for this website -
             every first row is the animal's personal info (name, picture)
             and second row is the breed information'''

        counter = 1

        for animal_string in animal_table:
            animal_list = animal_string.text.split('\n')

            for animals in animal_list:
                if counter % 2 == 1:
                    name = animals
                else:
                    breed = animals
                    print(f"Name: {name} Breed: {breed}")

                counter += 1

        print("Finished scraping process for Dogs")

        self.driver.get(self.link[1])
        
        animal_table = self.driver.find_elements(By.XPATH, "/html/body/div/div[2]/div/article/div/div/div/div/div/div/div[2]/div/div/div[1]/table/tbody")

        '''for this website -
             every first row is the animal's personal info (name, picture)
             and second row is the breed information'''

        counter = 1

        for animal_string in animal_table:
            animal_list = animal_string.text.split('\n')

            for animals in animal_list:
                if counter % 2 == 1:
                    name = animals
                else:
                    breed = animals
                    print(f"Name: {name} Breed: {breed}")

                counter += 1

        print("Finished scraping process for Cats")
        
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