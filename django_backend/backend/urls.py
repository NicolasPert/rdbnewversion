from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import (
    UserViewSet, PictureViewSet, ColorViewSet, 
    MovieViewSet, UniverseViewSet, CharacterViewSet, FavoriteViewSet, LoginView, register_view, ArticleViewSet)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static




router = DefaultRouter()
router.register(r'users', UserViewSet, basename="user")
router.register(r'pictures', PictureViewSet, basename="picture")
router.register(r'colors', ColorViewSet, basename="color")
router.register(r'movies', MovieViewSet, basename="movie")
router.register(r'universes', UniverseViewSet, basename="universe")
router.register(r'characters', CharacterViewSet, basename="character")
router.register(r'favorites', FavoriteViewSet, basename="favorite")
router.register(r'articles', ArticleViewSet, basename="article")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/login/', LoginView.as_view(), name='login'),
    path('api/auth/register/', register_view, name="register"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)