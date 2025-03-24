from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import (
    UserViewSet, PictureViewSet, ColorViewSet, 
    MovieViewSet, UniverseViewSet, CharacterViewSet, FavoriteViewSet)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView




router = DefaultRouter()
router.register(r'users', UserViewSet, basename="user")
router.register(r'pictures', PictureViewSet, basename="picture")
router.register(r'colors', ColorViewSet, basename="color")
router.register(r'movies', MovieViewSet, basename="movie")
router.register(r'universes', UniverseViewSet, basename="universe")
router.register(r'characters', CharacterViewSet, basename="character")
router.register(r'favorites', FavoriteViewSet, basename="favorite")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
