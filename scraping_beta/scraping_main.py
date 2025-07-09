import bs4
from bs4 import BeautifulSoup
import requests
import json

from scraping_beta import extraction_functions
from scraping_beta import paid_extraction_functions

"""
* get_links : This function goes through the given document and extracts the links and names of different pages on the website
* 
* INPUTS
* doc : a Beautifulsoup HTML document object
* 
* OUTPUTS
* lesson_object (dict) : A dictionary containing two arrays: An array of lesson names and then an array of links
* -> Each index of both arrays matach a lesson name to their corresponding link
"""
def get_links(doc):
    # Iterate through the different links to other blogs
    blog_links = doc.find(class_="blog-category-list")
    blog_links = blog_links.find_all("a", "blog-link")

    lesson_object = {'lesson_names' : [], 'lesson_extensions' : []}

    for link in blog_links:
        # Extract the name of the lesson and corresponding link form the link
        name_data = (link.text,)
        extension_data = link['href']

        # Add those two data to their corresponding arrays 
        lesson_object['lesson_names'].append(name_data)
        lesson_object['lesson_extensions'].append(extension_data)
     
    # Return the lesson object
    return lesson_object

"""
* get_free_links : This function extracts all of the (free) lesson names and links from the home page of the website
* 
* INPUTS
* None
* 
* OUTPUTS
* lesson_object (dict) : A dictionary containing two arrays: An array of lesson names and then an array of links
* -> Each index of both arrays matach a lesson name to their corresponding link
"""
def get_free_links():
    # Extract the HTML from the main lesson page of the website
    extension = "/free"
    url = f"https://www.speechmodification.com{extension}"
    page = requests.get(url)
    doc = BeautifulSoup(page.text, "html.parser")

    return get_links(doc)

"""
* get_paid_links : This function extracts all of the (paid) lesson names and links from the home page of the website
* 
* INPUTS
* None
* 
* OUTPUTS
* lesson_object (dict) : A dictionary containing two arrays: An array of lesson names and then an array of links
* -> Each index of both arrays matach a lesson name to their corresponding link
"""
def get_paid_links():
    driver = paid_extraction_functions.access_blocked_content()
    driver.get("https://www.speechmodification.com/online-practice")
    doc = BeautifulSoup(driver.page_source, "html.parser")

    return get_links(doc), driver



"""
* scrape_lessons : This scrapes all of the lessons from the web page and formats their respective tasks for database insertion
* 
* INPUTS
* None
* 
* OUTPUTS
* lesson_array (List) : This is a list of tuples where each tuple contains the lesson name, task title and task content extracted from the website
"""
def scrape_lessons(paid=False):
    """
    Example return object:
    [
        ('All', 'Learning P Sounds', [{...}, {...}]),
        ('All', 'Learning /z/ Sounds', [{...}, {...}]),
        ('French', 'The r Sounds, [{...}, {...}])
    ]
    """
    # Get the names of the lessons from the website and their corresponding links
    lesson_object = None
    driver = None
    if paid == True:
        lesson_object, driver = get_paid_links()
    else:
        lesson_object = get_free_links()

    lesson_extensions = lesson_object['lesson_extensions']
    lesson_names = lesson_object['lesson_names']    

    # This is the list that will be returned
    # It will hold tuples each representing a task associated with a specific lesson
    lesson_array = []

    # Go through the different links and scrape their content
    for i in range(len(lesson_names)):
        extension = lesson_extensions[i]
        lesson_title = lesson_names[i][0]

        url = f"https://www.speechmodification.com{extension}"
        doc = None
        if paid == True:
            driver.get(url)
            doc = BeautifulSoup(driver.page_source, "html.parser")
        else:
            page = requests.get(url)
            doc = BeautifulSoup(page.text, "html.parser")


        # Get each of the blog posts from the page
        blog_posts = doc.find_all(class_="blog-post")

        ## *** Iterate through each of the blog posts on the page ***
        for task in blog_posts:
            # Get the HTML of the specific blog post
            content = task.find(class_='blog-content')

            # Extract the title of the task from the blog post
            task_title = task.find(class_='blog-title').text.strip()
            task_content = []

            for child in content.children:
                if isinstance(child, bs4.Tag):
                    # Try to extract each kind of data from each div
                    # If one returns something, then I don't want to try to extract any other kinds of data

                    # # Extract table content
                    table_content = extraction_functions.extract_table(child)
                    if table_content != None:
                        task_content.append(table_content)
                        continue

                    # Extract a video link
                    video_content = extraction_functions.extract_videos(child)
                    if video_content != None:
                        task_content.append(video_content)
                        continue

                    # Extract an image link
                    image_content = extraction_functions.extract_image(child)
                    if image_content != None:
                        task_content.append(image_content)
                        continue

                    # Extract an audio link (of type class = 'wsite-button wsite-button-small wsite-button-normal')
                    audio_content_1 = extraction_functions.extract_audio_type_1(child)
                    if audio_content_1 != None:
                        task_content.append(audio_content_1)
                        continue

                    # Extract an audio link (of type 'audio')
                    audio_content_2 = extraction_functions.extract_audio_type_2(child)
                    if audio_content_2 != None:
                        task_content.append(audio_content_2)
                        continue

                    # Extract a paragraph
                    paragraph_content = extraction_functions.extract_paragraphs(child)
                    if paragraph_content != None:
                        task_content.append(paragraph_content)
                        continue
            
            # Append a tuple representing a specific task to the overall lesson array
            lesson_array.append((lesson_title, task_title, json.dumps(task_content),))
    
    # Return the array of lessons / tasks
    return lesson_array