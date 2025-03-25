import jwt
import os
import time
import requests
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, HTTPException
from pydantic import BaseModel
from typing import Dict, List
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = str(os.getenv("SECRET_KEY"))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_SECONDS = 600  # 10 min
REFRESH_TOKEN_EXPIRE_SECONDS = 86400  # 1 jour

app = FastAPI()
rooms: Dict[str, List[WebSocket]] = {}
fake_refresh_tokens = {}  # Stockage temporaire des refresh tokens (remplacez par une DB en prod)

class TokenSchema(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

def create_access_token(user_id: int):
    """Crée un access token avec expiration courte"""
    payload = {
        "user_id": user_id,
        "exp": time.time() + ACCESS_TOKEN_EXPIRE_SECONDS
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(user_id: int):
    """Crée un refresh token avec expiration plus longue"""
    payload = {
        "user_id": user_id,
        "exp": time.time() + REFRESH_TOKEN_EXPIRE_SECONDS
    }
    refresh_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    fake_refresh_tokens[user_id] = refresh_token  # Sauvegarde temporaire
    return refresh_token

def verify_jwt(token: str):
    """Vérifie et décode le JWT"""
    if not token:
        return None, "missing_token"
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["user_id"], None
    except jwt.ExpiredSignatureError:
        return None, "token_expired"
    except jwt.InvalidTokenError:
        return None, "invalid_token"

@app.post("/refresh-websocket-token/")
async def refresh_websocket_token(refresh_token: str):
    """Renvoie un nouveau access_token si le refresh_token est valide"""
    user_id, _ = verify_jwt(refresh_token)
    if not user_id or fake_refresh_tokens.get(user_id) != refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token invalide ou expiré")
    
    new_access_token = create_access_token(user_id)
    return {"access_token": new_access_token, "token_type": "bearer"}

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, token: str = Query(None)):
    """WebSocket avec gestion des salles et refresh token"""
    user_id, error = verify_jwt(token)

    if error == "token_expired":
        await websocket.send_json({"error": "token_expired", "message": "Votre session a expiré. Rafraîchissez le token."})
        await websocket.close(code=1008)
        return
    elif error:
        await websocket.close(code=1008)
        return

    await websocket.accept()
    rooms.setdefault(room_id, []).append(websocket)
    print(f"👤 Utilisateur {user_id} a rejoint la salle {room_id}")

    try:
        while True:
            data = await websocket.receive_json()
            message = {
                "user_id": user_id,
                "room_id": room_id,
                "content": data.get("content"),
                "type": data.get("type", "chat"),
            }
            print(f"📩 Message reçu dans {room_id} : {message}")
            for client in rooms[room_id]:
                await client.send_json({"status": "Message reçu", "data": message})
    except WebSocketDisconnect:
        print(f"❌ Utilisateur {user_id} déconnecté de {room_id}")
        rooms[room_id].remove(websocket)
        if not rooms[room_id]:  
            del rooms[room_id]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)
