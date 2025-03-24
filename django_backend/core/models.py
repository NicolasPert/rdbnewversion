from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

# ==============================
# Utilisateurs
# ==============================
class User(AbstractUser):
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="custom_user_set",
        blank=True,
        help_text="The groups this user belongs to.",
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="custom_user_permissions",
        blank=True,
        help_text="Specific permissions for this user.",
    )

# ==============================
# Modèles liés aux personnages
# ==============================
class Picture(models.Model):
    name = models.CharField(max_length=255)
    size = models.IntegerField()
    description = models.CharField(max_length=255)
    mimetype = models.CharField(max_length=255)

class Color(models.Model):
    name = models.CharField(max_length=255, unique=True)

class Movie(models.Model):
    name = models.CharField(max_length=255, unique=True)

class Universe(models.Model):
    name = models.CharField(max_length=255, unique=True)

class Character(models.Model):
    name = models.CharField(max_length=255)
    picture = models.OneToOneField(Picture, on_delete=models.CASCADE, related_name="character")
    colors = models.ManyToManyField(Color, related_name="characters")
    movies = models.ManyToManyField(Movie, related_name="characters")
    universes = models.ManyToManyField(Universe, related_name="characters")

class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="favorites")
    character = models.ForeignKey(Character, on_delete=models.CASCADE, related_name="favorited_by")
    
    class Meta:
        unique_together = ('user', 'character')

