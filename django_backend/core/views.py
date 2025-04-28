from rest_framework.generics import RetrieveAPIView
from rest_framework import viewsets
from rest_framework.permissions import  SAFE_METHODS, BasePermission, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Picture, Color, Movie, Univers, Character, Favorite, Article
from .serializers import (
    UserSerializer, PictureSerializer, ColorSerializer, 
    MovieSerializer, UniversSerializer, CharacterSerializer, 
    FavoriteSerializer, ArticleSerializer
)
from django.contrib.auth import authenticate, get_user_model
from backend.auth import create_jwt 
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.exceptions import ValidationError
from rest_framework.parsers import MultiPartParser, FormParser

import logging

User = get_user_model()

logger = logging.getLogger(__name__)

@api_view(["POST"])
def register_view(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    # Log to see the incoming data
    logger.info(f"Creating user: {username}, {email}")

    if User.objects.filter(username=username).exists():
        logger.warning(f"Username {username} already taken.")
        return Response({"error": "Ce nom d'utilisateur est déjà pris."}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        logger.warning(f"Email {email} already used.")
        return Response({"error": "Cet email est déjà utilisé."}, status=status.HTTP_400_BAD_REQUEST)

    # Create user and log
    user = User.objects.create_user(username=username, email=email, password=password)
    user.save()
    logger.info(f"User {username} created successfully.")

    token = create_jwt(user)  # Génère un token JWT après l'inscription
    return Response({"message": "Compte créé avec succès", "token": token}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user is None:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        # Ajoute les informations utilisateur à la réponse
        return Response({
            "refresh": str(refresh),
            "access": str(access_token),
            "user": {
                "id": user.id,  # Ajoute l'ID de l'utilisateur
                "username": user.username,  # Ajoute le nom d'utilisateur
                "email": user.email,  # Ajoute l'email de l'utilisateur
            }
        })


class IsAdminOrReadOnly(BasePermission):
    """
    Autorise tout le monde à lire, mais seules les actions d'écriture sont réservées aux admins.
    """
    def has_permission(self, request, view):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return request.user and request.user.is_authenticated
        print(f"User: {request.user}, Is Staff: {request.user.is_staff}")  # Ajoutez ce log
        return request.user and request.user.is_authenticated and request.user.is_staff

class UserViewSet(viewsets.ReadOnlyModelViewSet):  
    """Seuls les admins peuvent voir tous les utilisateurs, chaque user ne voit que son profil."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
            return User.objects.all()  # Un admin peut voir tous les utilisateurs
          # Un utilisateur normal ne voit que son propre profil

class PictureViewSet(viewsets.ModelViewSet):
    queryset = Picture.objects.all()
    serializer_class = PictureSerializer
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        file_obj = request.data['file']
        name = request.data.get('name', file_obj.name)
        size = request.data.get('size', str(file_obj.size))
        description = request.data.get('description', f'Description for {name}')
        mimetype = request.data.get('mimetype', file_obj.content_type)

        picture_data = {
            'name': name,
            'size': size,
            'description': description,
            'mimetype': mimetype,
        }

        # Serialisation des données pour créer l'image
        file_serializer = PictureSerializer(data=picture_data)
        if file_serializer.is_valid():
            # Sauvegarde l'image et récupère l'ID
            picture = file_serializer.save()

            # Renvoie la réponse avec l'ID de l'image
            return Response({
                'id': picture.id,  # ID de l'image
                'name': picture.name,
                'size': picture.size,
                'description': picture.description,
                'mimetype': picture.mimetype,
            }, status=status.HTTP_201_CREATED)
        else:
            print(file_serializer.errors)  # Log des erreurs de validation
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ColorViewSet(viewsets.ModelViewSet):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAdminOrReadOnly]

class UniversViewSet(viewsets.ModelViewSet):
    queryset = Univers.objects.all()
    serializer_class = UniversSerializer

class CharacterViewSet(viewsets.ModelViewSet):
    queryset = Character.objects.all()
    serializer_class = CharacterSerializer
    permission_classes = [IsAdminOrReadOnly]  

class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAdminOrReadOnly]  # Seuls les utilisateurs connectés peuvent interagir

    def get_queryset(self):
        """Un utilisateur ne voit que ses propres favoris"""
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Assigne automatiquement l'utilisateur connecté lors de la création"""
        serializer.save(user=self.request.user)

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAdminOrReadOnly]  # Seuls les admins peuvent créer, mettre à jour ou supprimer des articles

def get_queryset(self):
    return Article.objects.all()



class UserDetailAPIView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "id"
    permission_classes = [IsAuthenticated]

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
