from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Picture, Color, Movie, Univers, Character, Favorite, Article
from rest_framework import serializers
from django.conf import settings


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class PictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Picture
        fields = ('name', 'size', 'description', 'mimetype')
        
class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields =  [ 'id', 'name']
        
class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = [ 'id', 'name'] 

class UniversSerializer(serializers.ModelSerializer):
    class Meta:
        model = Univers
        fields = [ 'id', 'name']

class CharacterSerializer(serializers.ModelSerializer):


    class Meta:
        model = Character
        fields = ['name', 'picture']

class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = '__all__'
        
        

class ArticleSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = ['id', 'title', 'content', 'published_at', 'image_url']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None
        
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
