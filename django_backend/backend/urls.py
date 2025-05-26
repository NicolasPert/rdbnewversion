from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import (
    UserViewSet, ColorViewSet, 
    MovieViewSet, UniversViewSet, CharacterViewSet, To_likeViewSet, PictureViewSet, LoginView, register_view, ArticleViewSet, UserDetailAPIView, CurrentUserView)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static




router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'colors', ColorViewSet, basename="color")
router.register(r'movies', MovieViewSet, basename="movie")
router.register(r'pictures', PictureViewSet, basename='picture')
router.register(r'univers', UniversViewSet, basename="univers")
router.register(r'characters', CharacterViewSet, basename="character")
router.register(r'to_like', To_likeViewSet, basename="to_like")
router.register(r'articles', ArticleViewSet, basename="article")


urlpatterns = [
    path('api/users/<int:id>/', UserDetailAPIView.as_view(), name='user-detail-id'),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/login/', LoginView.as_view(), name='login'),
    path('api/auth/register/', register_view, name="register"),
    path('api/users/me/', CurrentUserView.as_view(), name='current-user'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)