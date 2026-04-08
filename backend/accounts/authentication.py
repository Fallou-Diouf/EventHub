from rest_framework_simplejwt.authentication import JWTAuthentication

class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user = super().get_user(validated_token)

        # Injecter le rôle du token dans l'objet user
        role = validated_token.get("role")
        if role:
            user.role = role

        return user
