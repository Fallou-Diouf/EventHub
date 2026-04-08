from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('events/', include('events.urls')),
    path('participants/', include('participants.urls')),
    path('registrations/', include('registrations.urls')),

    # 🔐 Authentification personnalisée
    path('auth/', include('accounts.urls')),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
