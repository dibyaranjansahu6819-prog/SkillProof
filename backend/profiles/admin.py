from django.contrib import admin

from .models import StudentProfile


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = (
        "full_name",
        "university",
        "degree",
        "graduation_year",
        "created_at",
    )

    search_fields = (
        "full_name",
        "university",
        "degree",
    )

    list_filter = (
        "graduation_year",
    )