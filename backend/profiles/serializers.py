from rest_framework import serializers

from .models import StudentProfile


class StudentProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    email = serializers.EmailField(
        source="user.email",
        read_only=True,
    )

    class Meta:
        model = StudentProfile
        fields = [
            "id",
            "username",
            "email",
            "full_name",
            "headline",
            "bio",
            "university",
            "degree",
            "graduation_year",
            "github_url",
            "linkedin_url",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "username",
            "email",
            "created_at",
            "updated_at",
        ]