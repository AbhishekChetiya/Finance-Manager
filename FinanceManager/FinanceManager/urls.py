
from django.contrib import admin
from django.urls import path,include
from MainApp.views import CreateUserView 
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/register/', CreateUserView.as_view(), name='create_user'),
    path('token/', TokenObtainPairView.as_view(), name='get_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('auth/', include('rest_framework.urls')),
    path('main/',include('MainApp.urls'))
]
