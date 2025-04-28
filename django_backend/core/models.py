from django.db import models
from django.conf import settings

# ==============================
# Modèles liés aux personnages
# ==============================
class Picture(models.Model):
    name = models.CharField(max_length=255)
    size = models.IntegerField()
    description = models.CharField(max_length=255)
    mimetype = models.CharField(max_length=255)
    
    
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
    
    def __str__(self):
        return f"{self.name} (Picture: {self.picture.name})"
    
    
class Belong(models.Model):
    character = models.ForeignKey(Character, on_delete=models.CASCADE, related_name="belongs")
    univers = models.ForeignKey(Univers, on_delete=models.CASCADE)


    def __str__(self):
        return f"{self.character.name} - {self.univers.name}"
    
class ToOwn(models.Model):
    character = models.ForeignKey(Character, on_delete=models.CASCADE, related_name="to_own")
    color = models.ForeignKey(Color, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.character.name} - {self.color.name}"

class ToIn(models.Model):
    character = models.ForeignKey(Character, on_delete=models.CASCADE, related_name="to_in")
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)


    def __str__(self):
        return f"{self.character.name} - {self.movie.name}"



class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="favorites")
    character = models.ForeignKey(Character, on_delete=models.CASCADE, related_name="favorited_by")
    
    class Meta:
        unique_together = ('user', 'character')
        
        
#----------------------------
# Partie Article 
#----------------------------

class Article(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
  # L'auteur de l'article (admin)
    published_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=False)  # Un article peut être brouillon avant d'être publié
    image = models.ImageField(upload_to='articles/', null=True, blank=True)  # Ajout de l'image

    def __str__(self):
        return self.title

