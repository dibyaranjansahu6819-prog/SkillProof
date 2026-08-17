from django.contrib import admin

from .models import Evidence


@admin.register(Evidence)
class EvidenceAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "student",
        "evidence_type",
        "verification_status",
        "verification_score",
        "created_at",
    )

    search_fields = (
        "title",
        "student__username",
        "student__email",
        "issuing_organization",
    )

    list_filter = (
        "evidence_type",
        "verification_status",
    )

    filter_horizontal = (
        "skills",
    )

    ordering = (
        "-created_at",
    )