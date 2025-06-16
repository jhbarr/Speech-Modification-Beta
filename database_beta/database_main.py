import psycopg2
from database_beta.config import load_config
from database_beta import insertion_functions
from database_beta import query_functions
from database_beta.connect import connect_one, connect_pool

import json

# Now import the function
import scraping_beta.scraping_main as scrape

if __name__ == "__main__":
    paid = True

    # OPEN A CONNECTION (POOL)
    config = load_config()
    conn = connect_one(config)
   
    # lessons = None
    # lesson_names = None
    # if paid:
    #     lessons = scrape.get_paid_links()[0]
    #     lesson_names = lessons['lesson_names']
    # else:
    #     lessons = scrape.get_free_links()
    #     lesson_names = lessons['lesson_names']
    # insertion_functions.insert_lesson(conn, lesson_names, many=True, paid=paid)

    # Grab all of the tasks from the scraping module
    result = scrape.scrape_lessons(paid=paid)
    # Creat a cursor object to interact with the database
    cur = conn.cursor()
    # Instantiate a dictionary to hold all of the id's of the different lessons
    # So that we don't have to query the database everytime we add a task
    lesson_ids = {}
    task_array = []

    # Iterate through each task that we received
    for task in result:
        # Check if we have already found the id for the current lesson title
        lesson_title = task[0]
        id = lesson_ids.get(lesson_title, None)

        # Query the database for the lesson id if it has not yet been found
        if id == None:
            sql = None
            if paid == True:
                sql = "SELECT id FROM api_paidlesson WHERE lesson_title = (%s)"
            else:
                sql = "SELECT id FROM api_freelesson WHERE lesson_title = (%s)"

            try:
                # Execute the SQL code
                values = (lesson_title,)
                cur.execute(sql, values)

                # Add the id to the dictionary for later use
                id = cur.fetchone()[0]      
                lesson_ids[lesson_title] = id
            
            except (Exception, psycopg2.DatabaseError) as error:
                print("Error:", error)
        
        # Append the value tuple to the overall task array
        task_array.append((id, task[1], json.dumps(task[2])))

    cur.close()
    print("Cursor closed:", cur.closed)

    # Insert all of the found tasks to the database
    insertion_functions.insert_task(conn, task_array, many=True, paid=paid)

    # CLOSE THE CONNECTION (POOL)
    conn.close()
    print("Connection pool closed: ", conn.closed)

