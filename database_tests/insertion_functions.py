import psycopg2
import json

"""
* db_commit : Commits values to the PostgreSQL database using the specified SQL code and database values
* 
* INPUTS
* conn : A database connection object
* sql (String) : SQL code to be exectuted
* values (Tuple or list[tuple]) : The value(s) to be inserted into the database
* Optional many (bool) : Specifies whether there are multiple values to be inputted into the database
*
* OUPTUTS
* None
"""
def db_commit(conn, sql, values, many=False):
    cur = conn.cursor()

    try:
        # Execute the SQL code
        if not many:
            cur.execute(sql, values)
        else:
            cur.executemany(sql, values)
        
        # Commit the changes to the database
        conn.commit()

    except (Exception, psycopg2.DatabaseError) as error:
        print("Error:", error)

    finally:
        cur.close()
        print("Cursor closed:", cur.closed)


def sqlite_db_commit(conn, sql, values, many=False):
    cur = conn.cursor()

    try:
        # Execute the SQL code
        if not many:
            cur.execute(sql, values)
        else:
            cur.executemany(sql, values)
        
        # Commit the changes to the database
        conn.commit()

    except Exception as error:
        print(error, type(error).__name__)

    finally:
        cur.close()
        print("Cursor closed")

"""
* insert_lesson : Inserts a new lesson into the PostgreSQL database
*
* INPUTS
* conn : A database connection object
* values (tuple or list[tuple]) : The value(s) to be inserted into the database
* Optional many (bool) : Specifies whether there are multiple values to be inputted into the database
*
* OUTPUTS
* None
"""
def insert_lesson(conn, values, many=False, paid=False):
    # Insert a new lesson in the lessons table
    sql = None
    if paid == True:
        sql = """INSERT INTO api_paidlesson(lesson_title) VALUES(%s)""" # Syntax for Postgresql
    else:
       sql = """INSERT INTO api_freelesson(lesson_title) VALUES(%s)"""
    
    db_commit(conn, sql, values, many=many)


"""
* insert_task : Inserts a new task into the PostgreSQL database
*
* INPUTS
* conn : A database connection object
* values (tuple or list[tuple]) : The value(s) to be inserted into the database
* Optional many (bool) : Specifies whether there are multiple values to be inputted into the database
*
* OUTPUTS
* None
"""
def insert_task(conn, values, many=False, paid=False):
    # Insert a new lesson in the lessons table
    sql = None
    if paid == True:
        sql = """
        INSERT INTO api_paidtask (lesson_id, task_title, content)
        VALUES (%s, %s, %s)
        ON CONFLICT (task_title)
        DO UPDATE SET
            task_title = EXCLUDED.task_title,
            content = EXCLUDED.content;
        """
    else:
        sql = """
        INSERT INTO api_freetask (lesson_id, task_title, content)
        VALUES (%s, %s, %s)
        ON CONFLICT (task_title)
        DO UPDATE SET
            task_title = EXCLUDED.task_title,
            content = EXCLUDED.content;
        """

    db_commit(conn, sql, values, many=many)

