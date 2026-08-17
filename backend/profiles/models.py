from django.conf import settings
from django.db import models


class StudentProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="student_profile",
    )

    full_name = models.CharField(max_length=150)
    headline = models.CharField(
        max_length=200,
        blank=True,
    )
    bio = models.TextField(
        blank=True,
    )
    university = models.CharField(
        max_length=200,
        blank=True,
    )
    degree = models.CharField(
        max_length=150,
        blank=True,
    )
    graduation_year = models.PositiveIntegerField(
        null=True,
        blank=True,
    )
    github_url = models.URLField(
        blank=True,
    )
    linkedin_url = models.URLField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )
    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return self.full_name