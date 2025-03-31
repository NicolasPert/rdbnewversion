from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Picture, Color, Movie, Universe, Character, Favorite, Article

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class PictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Picture
        fields = '__all__'

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = '__all__'

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'

class UniverseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Universe
        fields = '__all__'

class CharacterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Character
        fields = '__all__'

class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = '__all__'
        
        

class ArticleSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)  # Permet d'inclure l'URL de l'image

    class Meta:
        model = Article
        fields = ['id', 'title', 'content', 'author', 'published_at', 'updated_at', 'is_published', 'image']
