from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, SAFE_METHODS, BasePermission, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import User, Picture, Color, Movie, Universe, Character, Favorite
from .serializers import (
    UserSerializer, PictureSerializer, ColorSerializer, 
    MovieSerializer, UniverseSerializer, CharacterSerializer, 
    FavoriteSerializer
)
from django.contrib.auth import authenticate
from backend.auth import create_jwt 


@api_view(["POST"])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)
    if user:
        token = create_jwt(user)
        return Response({"token": token})
    return Response({"error": "Invalid credentials"}, status=400)

class IsAdminOrReadOnly(BasePermission):
    """
    Autorise tout le monde à lire, mais seules les actions d'écriture sont réservées aux admins.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:  # GET, HEAD, OPTIONS sont autorisés pour tous
            return True
        return request.user and request.user.is_staff  # Seuls les admins peuvent POST, PUT, DELETE

class UserViewSet(viewsets.ReadOnlyModelViewSet):  
    """Seuls les admins peuvent voir tous les utilisateurs, chaque user ne voit que son profil."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return User.objects.all()  # Un admin peut voir tous les utilisateurs
        return User.objects.filter(id=self.request.user.id)  # Un utilisateur normal ne voit que son propre profil

class PictureViewSet(viewsets.ModelViewSet):
    queryset = Picture.objects.all()
    serializer_class = PictureSerializer

class ColorViewSet(viewsets.ModelViewSet):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

class UniverseViewSet(viewsets.ModelViewSet):
    queryset = Universe.objects.all()
    serializer_class = UniverseSerializer

class CharacterViewSet(viewsets.ModelViewSet):
    queryset = Character.objects.all()
    serializer_class = CharacterSerializer
    permission_classes = [IsAdminOrReadOnly]  

class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]  # Seuls les utilisateurs connectés peuvent interagir

    def get_queryset(self):
        """Un utilisateur ne voit que ses propres favoris"""
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Assigne automatiquement l'utilisateur connecté lors de la création"""
        serializer.save(user=self.request.user)
