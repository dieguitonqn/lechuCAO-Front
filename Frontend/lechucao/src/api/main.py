from passlib.hash import pbkdf2_sha256, bcrypt
from fastapi import FastAPI, HTTPException, Form, Depends, Request
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import JSONResponse
import crud
from sqlalchemy import MetaData, Table
from database import SessionLocal, engine, Base
from pydantic import BaseModel
from typing import Annotated
from datetime import timedelta, datetime, timezone
import jwt




SECRET_KEY = "36242a399f9e66c990d68a7051871b1b870a14953a64767ddff6e7ace22f6bd438284a34164c4d6f2df6b70335d0539080353478a45fecca65e1c4e152c5efd52cb4898a1717366736e36d258c487fc6206574c28a78a4d573a5f91f8e9ebd4fb9763a4edd3e17e4d0d940460d43888443ee42e33963819fb7329b574676cf1889d3c224d88b0a49442d80a9df4c31fdbbf663fa9450ea066f24fef6d0f87fa7cd02ce5c8d113d93c0ce33702e16170335b6ad09131dee038ea8ebbc1be48e9c20b3dc7b1e3273ec6527872f31ce43dd9165025c20c711632758526beb3af96f6f51e1462813be0db4a611ad5d5d60e37204198a06e05ce23d475d9e363d81d9"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
metadata = MetaData()

app = FastAPI()



def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2 = OAuth2PasswordBearer(tokenUrl="login")

# # Function to hash the user-provided password
# def hash_password(password):
#     password_hash = pbkdf2_sha256.hash(password)
#     return password_hash


# Function to compare the passwords
def compare_passwords(plain_pwd, stored_hash):
    is_match = bcrypt.verify(plain_pwd, stored_hash)
    return is_match

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

class LoginRequest(BaseModel):
    name: str
    password: str

class Token(BaseModel):
    token: str
    token_type : str

class ETRequest(BaseModel):
    et: str

@app.post("/api/login", response_model=Token)
async def verify_password(login_request: LoginRequest):
    db  = SessionLocal()
    user = crud.get_user(db, login_request.name)

    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")

    is_match = compare_passwords(login_request.password, user.pwd)
    if is_match:
        token_exp = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        token = create_access_token(data={'sub' : user.mail, 'name':user.nombre}, expires_delta=token_exp)
        return Token(token=token, token_type ="bearer")
    else:
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")


@app.get("/api/t_check")
async def verify_token(token: Annotated[str, Depends(oauth2)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # Check if token has expired
        current_time = datetime.now(timezone.utc)
        
        if payload.get("exp") is None or payload.get("exp") < current_time.timestamp():
            raise HTTPException(status_code=401, detail="Token has expired")
        # Token is valid, return a success message (optional)
        token = create_access_token(data={'sub':payload.get("sub"), 'name':payload.get('name')}, expires_delta=timedelta(5))
        return {"message": "Token is valid", "token":token}

    except jwt.DecodeError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")

@app.post("/api/docs", dependencies=[Depends(oauth2)])
async def docs(request: ETRequest, token: str = Depends(oauth2)):
    # Validate the token using the tokenUrl provided in oauth2_scheme
    et = request.et
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # Check if token has expired
        current_time = datetime.now(timezone.utc)
        if payload.get("exp") is None or payload.get("exp") < current_time.timestamp():
            raise HTTPException(status_code=401, detail="Token has expired")
        
        # Fetch documents based on the et value
    
        db = SessionLocal()
        
        try:
            # Check if the table exists in the database
            tabla = Table(et, metadata, autoload_with=engine)
            filtered_docs = crud.get_docs(db, tabla)

            # print(filtered_docs)
            # Convert documents to JSON-compatible format
        # Convertir los resultados a diccionario
            resultados = [dict(row._mapping) for row in filtered_docs]
        
            return resultados

            # json_docs = []

            # for doc in filtered_docs:
            #     json_docs.append(dict(doc))

            # return JSONResponse({"docs": json_docs})
        except KeyError:
            raise HTTPException(status_code=404, detail=f"Table '{et}' not found")

            
    except jwt.DecodeError:
            raise HTTPException(status_code=401, detail="Invalid token")
    # except jwt.ExpiredSignatureError:
    #     raise HTTPException(status_code=401, detail="Token has expired")


    # print (token)
    # if token.token == '123456':
    #     return {"token":"789012"}
    # else:
    #     raise HTTPException(status_code=401)
