import psycopg2
from psycopg2 import pool

def connect_one(config):
    """ Connect to the PostgreSQL database server """

    try:
        # connecting to the PostgreSQL server
        with psycopg2.connect(**config) as conn:
            print('Connected to the PostgreSQL server.')
            return conn
        
    except (psycopg2.DatabaseError, Exception) as error:
        print("Error:", error)


def connect_pool(config):
    """ Connect to the PostgreSQL database server """
    
    try:
        
        connection_pool = pool.SimpleConnectionPool(1, 10, **config)
        if connect_pool:
            print("Connection pool created successfully")
            return connection_pool

    except (psycopg2.DatabaseError, Exception) as error:
        print(error)


