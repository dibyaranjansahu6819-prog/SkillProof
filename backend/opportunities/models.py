from django.conf import settings
from django.db import models


class OpportunityType(models.TextChoices):
    INTERNSHIP = "internship", "Internship"
    TEAM = "team", "Team Opportunity"


class Opportunity(models.Model):
    title = models.CharField(
        max_length=200
    )

    organization = models.CharField(
        max_length=200
    )

    opportunity_type = models.CharField(
        max_length=20,
        choices=OpportunityType.choices,
        default=OpportunityType.INTERNSHIP,
    )
    
    recruiter = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name="recruiter_opportunities",
    limit_choices_to={"role": "recruiter"},
    null=True,
    blank=True,
    )

    description = models.TextField()

    location = models.CharField(
        max_length=200,
        blank=True,
    )

    remote = models.BooleanField(
        default=False
    )

    application_url = models.URLField(
        blank=True
    )

    deadline = models.DateField(
        null=True,
        blank=True
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.title


class OpportunitySkill(models.Model):
    opportunity = models.ForeignKey(
        Opportunity,
        on_delete=models.CASCADE,
        related_name="skill_requirements",
    )

    skill = models.ForeignKey(
        "skills.Skill",
        on_delete=models.CASCADE,
        related_name="opportunity_requirements",
    )

    is_required = models.BooleanField(
        default=True
    )

    importance = models.PositiveIntegerField(
        default=50,
        help_text="Importance from 1 to 100.",
    )

    minimum_confidence = models.PositiveIntegerField(
        default=50,
        help_text="Minimum desired skill confidence.",
    )

    class Meta:
        unique_together = (
            "opportunity",
            "skill",
        )

    def __str__(self):
        return (
            f"{self.opportunity.title} - "
            f"{self.skill.name}"
        )

class ApplicationStatus(models.TextChoices):
    APPLIED = "applied", "Applied"
    UNDER_REVIEW = "under_review", "Under Review"
    SHORTLISTED = "shortlisted", "Shortlisted"
    INTERVIEW = "interview", "Interview"
    SELECTED = "selected", "Selected"
    REJECTED = "rejected", "Rejected"


class Application(models.Model):

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="opportunity_applications",
        limit_choices_to={"role": "student"},
    )

    opportunity = models.ForeignKey(
        Opportunity,
        on_delete=models.CASCADE,
        related_name="applications",
    )

    status = models.CharField(
        max_length=30,
        choices=ApplicationStatus.choices,
        default=ApplicationStatus.APPLIED,
    )

    cover_message = models.TextField(
        blank=True,
    )

    applied_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "student",
                    "opportunity",
                ],
                name="unique_student_opportunity_application",
            ),
        ]

        ordering = [
            "-applied_at",
        ]

    def __str__(self):

        return (
            f"{self.student.username} - "
            f"{self.opportunity.title}"
        )