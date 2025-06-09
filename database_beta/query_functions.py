import psycopg2

def db_query(conn, sql):
    cur = conn.cursor()

    try:
        # Execute the SQL code
        cur.execute(sql)

        rows = cur.fetchall() 
        return rows
        
    except (Exception, psycopg2.DatabaseError) as error:
        print("Error:", error)

    finally:
        cur.close()
        # print("Cursor closed:", cur.closed)
        print("Cursor closed")


def query_tasks(conn, lesson_title):
    sql = f"""
    SELECT t.content
    FROM test.tasks t
    JOIN test.lessons l ON t.lesson_title=l.title
    WHERE l.title = '{lesson_title}'
    ORDER BY t.id;
    """

    sql_test =f"""
    SELECT t.content
    FROM api_task t
    JOIN api_lesson l ON t.lesson_id = l.id
    WHERE l.lesson_title = '{lesson_title}';
    """

    return db_query(conn, sql_test)