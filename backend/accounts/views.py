from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

User = get_user_model()

# 🔐 LOGIN
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# 📝 REGISTER
@api_view(["POST"])
def register_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({"error": "Champs requis"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Utilisateur existe déjà"}, status=400)

    user = User.objects.create_user(
        username=username,
        password=password,
        role="viewer"  # défaut
    )

    return Response({
        "message": "Compte créé",
        "role": user.role
    }, status=201)