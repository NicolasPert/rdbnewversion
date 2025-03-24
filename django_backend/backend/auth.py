import jwt
from django.conf import settings
from datetime import datetime, timedelta

def create_jwt(user):
    payload = {
        "user_id": user.id,
        "exp": datetime.utcnow() + timedelta(days=1),
        "iat": datetime.utcnow(),
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    
    print(f"Token généré: {token}")
    return token
