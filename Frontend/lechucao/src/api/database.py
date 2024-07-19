from sqlalchemy import create_engine, MetaData 
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# db_host = "localhost"
db_host = "192.168.200.95"
db_user = "diego"
db_password = "Dslyparg23"
db_name = "LechuzaCore"

# Database connection details
SQLALCHEMY_DATABASE_URL = f"mariadb+pymysql://{db_user}:{db_password}@{db_host}/{db_name}"

# Define database models
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
metadata =MetaData()
