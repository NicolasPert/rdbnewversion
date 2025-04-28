# admin.py
from django.contrib import admin
from .models import Article, Character, Color, Movie, Univers, Picture


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'published_at', 'is_published', 'image']
    search_fields = ['title', 'content']
    
    
admin.site.register(Character)
class CharacterAdmin(admin.ModelAdmin):
    list_display = ['name', 'picture', 'colors', 'movies', 'univers']
    search_fields = ['name']
    list_filter = ['colors', 'movies', 'univers']
    
admin.site.register(Color)
class ColorAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']
    
admin.site.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']
    
admin.site.register(Univers)
class UniversAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']
    
admin.site.register(Picture)
class PictureAdmin(admin.ModelAdmin):
    list_display = ['name', 'size', 'description', 'mimetype']
    search_fields = ['name', 'description']

