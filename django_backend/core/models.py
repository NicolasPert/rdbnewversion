from django.db import models
from django.conf import settings
import uuid
import os

def generate_unique_filename(instance, filename):
    ext = filename.split('.')[-1]
    unique_filename = f'{uuid.uuid4().hex}.{ext}'
    return os.path.join('uploads', unique_filename)

class Picture(models.Model):
    name = models.CharField(max_length=255)
    size = models.IntegerField()
    description = models.TextField()
    mimetype = models.CharField(max_length=50)
    file = models.FileField(upload_to=generate_unique_filename)
    
    def __str__(self):
        return self.name

class Color(models.Model):
    name = models.CharField(max_length=255)
    
    def __str__(self):
        return self.name

class Movie(models.Model):
    name = models.CharField(max_length=255)
    
    def __str__(self):
        return self.name

class Univers(models.Model):
    name = models.CharField(max_length=255)
    
    def __str__(self):
        return self.name

class Character(models.Model):
    name = models.CharField(max_length=255)
    picture = models.OneToOneField(Picture, on_delete=models.CASCADE, related_name="character")
    colors = models.ManyToManyField('Color', through='To_own', related_name="characters")
    movies = models.ManyToManyField('Movie', through='To_in', related_name="characters")
    univers = models.ManyToManyField('Univers', through='Belong', related_name="characters")
    
    def __str__(self):
        return f"{self.name} (Picture: {self.picture.name})"

class To_own(models.Model):
    character = models.ForeignKey(Character, on_delete=models.CASCADE)
    color = models.ForeignKey(Color, on_delete=models.CASCADE)

class To_in(models.Model):
    character = models.ForeignKey(Character, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)

class Belong(models.Model):
    character = models.ForeignKey(Character, on_delete=models.CASCADE)
    univers = models.ForeignKey(Univers, on_delete=models.CASCADE)

class To_like(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="to_like")
    character = models.ForeignKey(Character, on_delete=models.CASCADE, related_name="favorited_by")
    
    class Meta:
        unique_together = ('user', 'character')

class Article(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    published_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=False)
    image = models.ImageField(upload_to='articles/', null=True, blank=True)

    def __str__(self):
        return self.title