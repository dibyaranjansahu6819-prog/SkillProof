from django.contrib import admin

from .models import (
    Opportunity,
    OpportunitySkill,
)


class OpportunitySkillInline(
    admin.TabularInline
):
    model = OpportunitySkill
    extra = 1


@admin.register(Opportunity)
class OpportunityAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "organization",
        "opportunity_type",
        "remote",
        "deadline",
        "is_active",
    )

    list_filter = (
        "opportunity_type",
        "remote",
        "is_active",
    )

    search_fields = (
        "title",
        "organization",
        "description",
    )

    inlines = [
        OpportunitySkillInline
    ]


@admin.register(OpportunitySkill)
class OpportunitySkillAdmin(admin.ModelAdmin):
    list_display = (
        "opportunity",
        "skill",
        "is_required",
        "importance",
        "minimum_confidence",
    )

    list_filter = (
        "is_required",
        "skill",
    )