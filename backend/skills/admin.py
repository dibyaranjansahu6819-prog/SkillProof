from django.contrib import admin

from .models import Skill, StudentSkill


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "is_active",
        "created_at",
    )

    search_fields = (
        "name",
        "description",
    )

    list_filter = (
        "category",
        "is_active",
    )

    ordering = (
        "name",
    )


@admin.register(StudentSkill)
class StudentSkillAdmin(admin.ModelAdmin):
    list_display = (
        "student",
        "skill",
        "proficiency",
        "self_assessment_score",
        "created_at",
    )

    search_fields = (
        "student__username",
        "student__email",
        "skill__name",
    )

    list_filter = (
        "proficiency",
        "skill__category",
    )

    ordering = (
        "-updated_at",
    )