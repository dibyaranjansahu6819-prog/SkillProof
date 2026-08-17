from django.conf import settings
from django.db import models


class EvidenceType(models.TextChoices):
    COURSEWORK = "coursework", "Coursework"
    PROJECT = "project", "Project"
    COMPETITION = "competition", "Competition"
    CREDENTIAL = "credential", "Micro-Credential"
    ASSESSMENT = "assessment", "Practical Assessment"
    OTHER = "other", "Other"


class VerificationStatus(models.TextChoices):
    SELF_DECLARED = "self_declared", "Self Declared"
    PENDING = "pending", "Pending Verification"
    VERIFIED = "verified", "Verified"
    PARTIALLY_VERIFIED = "partially_verified", "Partially Verified"
    REJECTED = "rejected", "Rejected"


class Evidence(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="evidence",
    )

    title = models.CharField(
        max_length=200,
    )

    evidence_type = models.CharField(
        max_length=30,
        choices=EvidenceType.choices,
    )

    description = models.TextField(
        blank=True,
    )

    issuing_organization = models.CharField(
        max_length=200,
        blank=True,
    )

    evidence_url = models.URLField(
        blank=True,
    )

    verification_status = models.CharField(
        max_length=30,
        choices=VerificationStatus.choices,
        default=VerificationStatus.SELF_DECLARED,
    )

    verification_score = models.PositiveIntegerField(
        default=0,
        help_text="Verification confidence from 0 to 100.",
    )
    
    verification_details = models.JSONField(
    default=dict,
    blank=True,
    )

    issued_date = models.DateField(
        null=True,
        blank=True,
    )
    skills = models.ManyToManyField(
        "skills.Skill",
        related_name="evidence",
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return f"{self.title} - {self.student.username}"