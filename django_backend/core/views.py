import os
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from rest_framework.generics import RetrieveAPIView
from rest_framework import viewsets
from rest_framework.permissions import SAFE_METHODS, BasePermission, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Picture, Color, Movie, Univers, Character, To_like, Article, To_own, To_in, Belong
from .serializers import (
    UserSerializer, PictureSerializer, ColorSerializer, 
    MovieSerializer, UniversSerializer, CharacterSerializer, 
    To_likeSerializer, ArticleSerializer
)
from django.contrib.auth import authenticate, get_user_model
from backend.auth import create_jwt 
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
import logging

User = get_user_model()

logger = logging.getLogger(__name__)

@api_view(["POST"])
def register_view(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    logger.info(f"Creating user: {username}, {email}")

    if User.objects.filter(username=username).exists():
        logger.warning(f"Username {username} already taken.")
        return Response({"error": "Ce nom d'utilisateur est déjà pris."}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        logger.warning(f"Email {email} already used.")
        return Response({"error": "Cet email est déjà utilisé."}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    user.save()
    logger.info(f"User {username} created successfully.")

    token = create_jwt(user)
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

        return Response({
            "refresh": str(refresh),
            "access": str(access_token),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            }
        })

class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return request.user and request.user.is_authenticated
        print(f"User: {request.user}, Is Staff: {request.user.is_staff}")
        return request.user and request.user.is_authenticated and request.user.is_staff

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.all()

class PictureViewSet(viewsets.ModelViewSet):
    queryset = Picture.objects.all()
    serializer_class = PictureSerializer

    def create(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file uploaded"}, status=400)

        picture = Picture.objects.create(
            name=file.name,
            mimetype=file.content_type,
            size=file.size,
            description=request.data.get('description', ''),
            file=file
        )

        serializer = PictureSerializer(picture)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class CharacterViewSet(viewsets.ModelViewSet):
    queryset = Character.objects.all()
    serializer_class = CharacterSerializer
    permission_classes = [IsAdminOrReadOnly]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})  # Ajout du contexte
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

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

class To_likeViewSet(viewsets.ModelViewSet):
    serializer_class = To_likeSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        return To_like.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAdminOrReadOnly]

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
