from pydantic import BaseModel

class UserBase(BaseModel):
    mail: str

class UserCreate(UserBase):
    pwd:str

class User(UserBase):
    id: int
    mail: str
    nombre: str
    apellido : str
    rol : str
    obra : str
    enlinea : str
    lastlog :str 
    pwdR :str
    class Config:
        orm_mode = True

class ET(BaseModel):
    __tablename__ = None

    id :int
    codigo : str
    numero : str
    descripcion : str
    revision : str
    estado : str
    fecha_ingreso : str
    fecha_egreso : str
    N_informe : str
    NP : str
    file_url: str
    inf_url: str
    os : str
    OS_url : str