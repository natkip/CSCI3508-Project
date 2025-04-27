from abc import ABC, abstractmethod
import json
import requests
import time
from selenium import webdriver
from selenium.webdriver.safari.options import Options
from selenium.webdriver.common.by import By

class WebsiteStrategy(ABC):
    driver_options = Options()
    driver_options.headless = True

    try:
        driver = webdriver.Safari(options=driver_options)
        print("Safari WebDriver initialized successfully!")
    except Exception as e:
        print(f"Error initializing Safari WebDriver: {e}")
        exit()

    driver.implicitly_wait(10)

    @abstractmethod
    def scrape(self):
        raise NotImplementedError("Subclasses must implement the scrape method!")

class ArrCOAnimalShelter(WebsiteStrategy):
    def __init__(self):
        self.links = ["https://arrcolorado.org/dogs/", "https://arrcolorado.org/cats/"]
        self.api_url = "http://localhost:8080/api/pets"  # Update if you deploy

    def scrape(self):
        for link in self.links:
            print(f"Scraping: {link}")
            self.driver.get(link)
            time.sleep(3)

            pets_elements = self.driver.find_elements(By.CSS_SELECTOR, "table tr")
            print(f"Found {len(pets_elements)} pet entries on page.")

            for row in pets_elements:
                try:
                    columns = row.find_elements(By.TAG_NAME, "td")
                    if len(columns) >= 2:
                        img_element = columns[0].find_element(By.TAG_NAME, "img")
                        image_url = img_element.get_attribute("src")

                        text_block = columns[1].text.strip()
                        lines = text_block.split("\n")

                        if len(lines) >= 1:
                            name = lines[0].strip()
                            breed = lines[1].strip() if len(lines) > 1 else "Unknown"

                            if name:
                                species = "Dog" if "dogs" in link else "Cat"

                                pet_data = {
                                    "name": name,
                                    "species": species,
                                    "breed": breed,
                                    "gender": "Unknown",
                                    "description": "No description available",
                                    "imageUrl": image_url,
                                    "available": True,
                                    "shelter": {
                                        "name": "Animal Rescue of the Rockies",
                                        "location": "Colorado",
                                        "contactEmail": "info@arrcolorado.org"
                                    }
                                }

                                print(f"Uploading {species}: {name} ({breed})")

                                response = requests.post(self.api_url, json=pet_data)
                                if response.status_code == 201:
                                    print(f"Uploaded {species} {name}: {response.status_code}")
                                else:
                                    print(f"Failed to upload {species} {name}: {response.status_code}")
                            else:
                                print("Skipping pet: Missing name (empty text)")
                        else:
                            print("Skipping pet: No text block found")
                except Exception as e:
                    print(f"Error processing a pet row: {e}")
                    continue

        print("Finished uploading pets.")
        self.driver.quit()

class WebsiteProcessor:
    def __init__(self, strategy: WebsiteStrategy):
        self._strategy = strategy

    def set_strategy(self, strategy: WebsiteStrategy):
        self._strategy = strategy

    def scrape_website(self):
        self._strategy.scrape()

def main():
    print("Start scraping program...")
    ArrCO_scraper = WebsiteProcessor(ArrCOAnimalShelter())
    ArrCO_scraper.scrape_website()

if __name__ == "__main__":
    main()
