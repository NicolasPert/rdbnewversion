from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Picture, Character, To_like, Article, Color, Movie, Univers, To_own, To_in, Belong
from django.conf import settings

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class PictureSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Picture
        fields = ['id', 'name', 'file_url', 'description', 'size', 'mimetype']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file:
            return request.build_absolute_uri(obj.file.url) if request else obj.file.url
        return None


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ['id', 'name']

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ['id', 'name']

class UniversSerializer(serializers.ModelSerializer):
    class Meta:
        model = Univers
        fields = ['id', 'name']

class CharacterSerializer(serializers.ModelSerializer):
    picture = serializers.PrimaryKeyRelatedField(queryset=Picture.objects.all())
    picture_url = serializers.SerializerMethodField()
    colors = serializers.PrimaryKeyRelatedField(many=True, queryset=Color.objects.all())
    movies = serializers.PrimaryKeyRelatedField(many=True, queryset=Movie.objects.all())
    univers = serializers.PrimaryKeyRelatedField(many=True, queryset=Univers.objects.all())

    class Meta:
        model = Character
        fields = ['id', 'name', 'picture', 'picture_url', 'colors', 'movies', 'univers']

    def get_picture_url(self, obj):
        request = self.context.get('request')
        if obj.picture and obj.picture.file:
            return request.build_absolute_uri(obj.picture.file.url) if request else obj.picture.file.url
        return None

    def create(self, validated_data):
        colors = validated_data.pop('colors', [])
        movies = validated_data.pop('movies', [])
        univers = validated_data.pop('univers', [])

        character = Character.objects.create(**validated_data)

        for color in colors:
            To_own.objects.create(character=character, color=color)

        for movie in movies:
            To_in.objects.create(character=character, movie=movie)

        for univers_item in univers:
            Belong.objects.create(character=character, univers=univers_item)

        return character




class To_likeSerializer(serializers.ModelSerializer):
    class Meta:
        model = To_like
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
