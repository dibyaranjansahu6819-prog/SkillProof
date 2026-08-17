from django.db import models
from django.conf import settings


class SkillCategory(models.TextChoices):
    PROGRAMMING = "programming", "Programming"
    WEB_DEVELOPMENT = "web_development", "Web Development"
    DATABASE = "database", "Database"
    AI_ML = "ai_ml", "AI / Machine Learning"
    CLOUD = "cloud", "Cloud / DevOps"
    DESIGN = "design", "Design"
    SOFT_SKILL = "soft_skill", "Soft Skill"
    OTHER = "other", "Other"


class Skill(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
    )

    category = models.CharField(
        max_length=30,
        choices=SkillCategory.choices,
        default=SkillCategory.OTHER,
    )

    description = models.TextField(
        blank=True,
    )

    is_active = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return self.name


class StudentSkill(models.Model):
    PROFICIENCY_LEVELS = [
        ("beginner", "Beginner"),
        ("intermediate", "Intermediate"),
        ("advanced", "Advanced"),
        ("expert", "Expert"),
    ]

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="student_skills",
    )

    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name="student_skills",
    )

    proficiency = models.CharField(
        max_length=20,
        choices=PROFICIENCY_LEVELS,
        default="beginner",
    )

    self_assessment_score = models.PositiveIntegerField(
        default=0,
        help_text="Student's self-assessed score from 0 to 100.",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["student", "skill"],
                name="unique_student_skill",
            )
        ]

    def __str__(self):
        return f"{self.student.username} - {self.skill.name}"