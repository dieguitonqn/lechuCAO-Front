import models, schemas
from sqlalchemy.orm import Session
from sqlalchemy.sql import select


# Function to retrieve user by username
def get_user(db: Session, username:str):
    return db.query(models.User).filter(models.User.mail == username).first()

def get_docs(db:Session, et:str):
    
        return db.query(et).all()
    