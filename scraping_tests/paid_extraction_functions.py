from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

from dotenv import load_dotenv
from os import getenv



"""
* access_blocked_content : This function creates a selenium driver so to use for scraping of paid content
* 
* INPUTS
* None
* 
* OUTPUTS
* None
"""
def access_blocked_content():
    login_url = 'https://www.speechmodification.com/apps/member/login'

    load_dotenv()

    login_email = getenv("LOGIN_EMAIL")
    login_password = getenv("LOGIN_PASSWORD")

    print("EMAIL:", login_email)
    print("PASSWORD:", login_password)

    ## Configure Selenium
    options = Options()
    options.add_argument("--headless")  # Run without a browser window
    # service = Service("chromedriver_path")  # Replace with actual path

    driver = webdriver.Chrome(options=options)
    driver.get(login_url)

    # Enter login credentials
    username = driver.find_element(By.NAME, "login-email")
    password = driver.find_element(By.NAME, "login-password")

    username.send_keys(login_email)
    password.send_keys(login_password)
    password.send_keys(Keys.RETURN)

    time.sleep(5)  # Give time for authentication

    return driver