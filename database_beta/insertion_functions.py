import psycopg2
import json

"""
* db_commit_lessons : Commits values to the PostgreSQL database using the specified SQL code and database values
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
def db_commit_lessons(conn, sql, values, many=False):
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


"""
* db_commit_tasks : Commits task values to the PostgreSQL database using the specified SQL code and database values
* 
* INPUTS
* conn : A database connection object
* sql (String) : SQL code to be exectuted
* values (Tuple or list[tuple]) : The value(s) to be inserted into the database
*
* OUPTUTS
* None
"""
def db_commit_tasks(conn, insert_sql, values, paid=False):
    cur = conn.cursor()

    lesson_counts = {}

    try:
        for row in values:
            lesson_id = row[0]
            cur.execute(insert_sql, row)
            lesson_counts[lesson_id] = lesson_counts.get(lesson_id, 0) + 1
        
        for lesson_id, count in lesson_counts.items():
            if not paid:
                cur.execute(
                    "UPDATE api_freelesson SET num_tasks = num_tasks + %s WHERE id = %s",
                    (count, lesson_id)
                )
            else:
                cur.execute(
                    "UPDATE api_paidlesson SET num_tasks = num_tasks + %s WHERE id = %s",
                    (count, lesson_id)
                )

        conn.commit()

    except (Exception, psycopg2.DatabaseError) as error:
        print("Error:", error)

    finally:
        cur.close()
        print("Cursor closed:", cur.closed)



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
        sql = """
        INSERT INTO api_paidlesson(lesson_title, num_tasks)
        VALUES(%s, %s)
        ON CONFLICT (lesson_title) DO NOTHING;
        """ 
    else:
       sql = """
        INSERT INTO api_freelesson(lesson_title, num_tasks)
        VALUES(%s, %s)
        ON CONFLICT (lesson_title) DO NOTHING;
        """ 
    
    db_commit_lessons(conn, sql, values, many=many)


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
        ON CONFLICT (lesson_id, task_title)
        DO UPDATE SET
            content = EXCLUDED.content;
        """
    else:
        sql = """
        INSERT INTO api_freetask (lesson_id, task_title, content)
        VALUES (%s, %s, %s)
        ON CONFLICT (lesson_id, task_title)
        DO UPDATE SET
            content = EXCLUDED.content;
        """

    db_commit_tasks(conn, sql, values, paid)

