from rest_framework import serializers

from .models import (
    Opportunity,
    OpportunitySkill,
    Application,
    ApplicationStatus,
)

from .services import OpportunityMatchingService


class OpportunitySkillCreateSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = OpportunitySkill

        fields = [
            "skill",
            "is_required",
            "importance",
            "minimum_confidence",
        ]


class RecruiterOpportunityCreateSerializer(
    serializers.ModelSerializer
):

    skills = OpportunitySkillCreateSerializer(
        many=True,
        write_only=True,
        required=False,
    )

    class Meta:

        model = Opportunity

        fields = [
            "title",
            "organization",
            "opportunity_type",
            "description",
            "location",
            "remote",
            "application_url",
            "deadline",
            "is_active",
            "skills",
        ]

    def create(self, validated_data):

        skills_data = validated_data.pop(
            "skills",
            []
        )

        recruiter = self.context[
            "request"
        ].user

        opportunity = Opportunity.objects.create(
            recruiter=recruiter,
            **validated_data,
        )

        for skill_data in skills_data:

            OpportunitySkill.objects.create(
                opportunity=opportunity,
                **skill_data,
            )

        return opportunity


class ApplicationCreateSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Application

        fields = [
            "cover_message",
        ]

        extra_kwargs = {
            "cover_message": {
                "required": False,
                "allow_blank": True,
            },
        }

    def validate(self, attrs):

        request = self.context[
            "request"
        ]

        student = request.user

        opportunity = self.context[
            "opportunity"
        ]

        if student.role != "student":

            raise serializers.ValidationError(
                "Only students can apply "
                "to opportunities."
            )

        if not opportunity.is_active:

            raise serializers.ValidationError(
                "This opportunity is no longer active."
            )

        if (
            opportunity.deadline
            and opportunity.deadline
            < __import__("datetime").date.today()
        ):

            raise serializers.ValidationError(
                "The application deadline has passed."
            )

        if Application.objects.filter(
            student=student,
            opportunity=opportunity,
        ).exists():

            raise serializers.ValidationError(
                "You have already applied "
                "to this opportunity."
            )

        return attrs

    def create(self, validated_data):

        request = self.context[
            "request"
        ]

        opportunity = self.context[
            "opportunity"
        ]

        return Application.objects.create(
            student=request.user,
            opportunity=opportunity,
            status=ApplicationStatus.APPLIED,
            **validated_data,
        )


class RecruiterApplicationSerializer(
    serializers.ModelSerializer
):

    student = serializers.SerializerMethodField()

    opportunity = serializers.SerializerMethodField()

    match_score = serializers.SerializerMethodField()

    match_level = serializers.SerializerMethodField()

    matched_skills = serializers.SerializerMethodField()

    missing_skills = serializers.SerializerMethodField()

    confidence_gaps = serializers.SerializerMethodField()

    class Meta:

        model = Application

        fields = [
            "id",
            "student",
            "opportunity",
            "status",
            "cover_message",
            "applied_at",
            "updated_at",
            "match_score",
            "match_level",
            "matched_skills",
            "missing_skills",
            "confidence_gaps",
        ]

    def get_student(self, obj):

        return {
            "id": obj.student.id,
            "username": obj.student.username,
            "email": obj.student.email,
        }

    def get_opportunity(self, obj):

        return {
            "id": obj.opportunity.id,
            "title": obj.opportunity.title,
            "organization": obj.opportunity.organization,
            "opportunity_type": (
                obj.opportunity.opportunity_type
            ),
        }

    def get_match_data(self, obj):

        return (
            OpportunityMatchingService
            .calculate_match(
                obj.student,
                obj.opportunity,
            )
        )

    def get_match_score(self, obj):

        return self.get_match_data(
            obj
        )["match_score"]

    def get_match_level(self, obj):

        return self.get_match_data(
            obj
        )["match_level"]

    def get_matched_skills(self, obj):

        return self.get_match_data(
            obj
        )["matched_skills"]

    def get_missing_skills(self, obj):

        return self.get_match_data(
            obj
        )["missing_skills"]

    def get_confidence_gaps(self, obj):

        return self.get_match_data(
            obj
        )["confidence_gaps"]


class RecruiterApplicationStatusSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Application

        fields = [
            "status",
        ]

        extra_kwargs = {
            "status": {
                "required": True,
            },
        }

    def validate_status(self, value):

        allowed_statuses = {
            choice[0]
            for choice in ApplicationStatus.choices
        }

        if value not in allowed_statuses:

            raise serializers.ValidationError(
                "Invalid application status."
            )

        return value
    
class StudentApplicationSerializer(
    serializers.ModelSerializer
):

    opportunity = serializers.SerializerMethodField()

    match_score = serializers.SerializerMethodField()

    match_level = serializers.SerializerMethodField()

    matched_skills = serializers.SerializerMethodField()

    missing_skills = serializers.SerializerMethodField()

    confidence_gaps = serializers.SerializerMethodField()

    class Meta:

        model = Application

        fields = [
            "id",
            "opportunity",
            "status",
            "cover_message",
            "applied_at",
            "updated_at",
            "match_score",
            "match_level",
            "matched_skills",
            "missing_skills",
            "confidence_gaps",
        ]

    def get_opportunity(self, obj):

        return {
            "id": obj.opportunity.id,

            "title": obj.opportunity.title,

            "organization": (
                obj.opportunity.organization
            ),

            "opportunity_type": (
                obj.opportunity.opportunity_type
            ),

            "description": (
                obj.opportunity.description
            ),

            "location": (
                obj.opportunity.location
            ),

            "remote": (
                obj.opportunity.remote
            ),

            "deadline": (
                obj.opportunity.deadline
            ),
        }

    def get_match_data(self, obj):

        return (
            OpportunityMatchingService
            .calculate_match(
                obj.student,
                obj.opportunity,
            )
        )

    def get_match_score(self, obj):

        return self.get_match_data(
            obj
        )["match_score"]

    def get_match_level(self, obj):

        return self.get_match_data(
            obj
        )["match_level"]

    def get_matched_skills(self, obj):

        return self.get_match_data(
            obj
        )["matched_skills"]

    def get_missing_skills(self, obj):

        return self.get_match_data(
            obj
        )["missing_skills"]

    def get_confidence_gaps(self, obj):

        return self.get_match_data(
            obj
        )["confidence_gaps"]

class StudentApplicationDetailSerializer(
    serializers.ModelSerializer
):

    opportunity = serializers.SerializerMethodField()

    match_score = serializers.SerializerMethodField()

    match_level = serializers.SerializerMethodField()

    matched_skills = serializers.SerializerMethodField()

    missing_skills = serializers.SerializerMethodField()

    confidence_gaps = serializers.SerializerMethodField()

    class Meta:

        model = Application

        fields = [
            "id",
            "opportunity",
            "status",
            "cover_message",
            "applied_at",
            "updated_at",
            "match_score",
            "match_level",
            "matched_skills",
            "missing_skills",
            "confidence_gaps",
        ]

    def get_opportunity(self, obj):

        return {
            "id": obj.opportunity.id,

            "title": obj.opportunity.title,

            "organization": (
                obj.opportunity.organization
            ),

            "opportunity_type": (
                obj.opportunity.opportunity_type
            ),

            "description": (
                obj.opportunity.description
            ),

            "location": (
                obj.opportunity.location
            ),

            "remote": (
                obj.opportunity.remote
            ),

            "application_url": (
                obj.opportunity.application_url
            ),

            "deadline": (
                obj.opportunity.deadline
            ),

        }

    def get_match_data(self, obj):

        return (
            OpportunityMatchingService
            .calculate_match(
                obj.student,
                obj.opportunity,
            )
        )

    def get_match_score(self, obj):

        return self.get_match_data(
            obj
        )["match_score"]

    def get_match_level(self, obj):

        return self.get_match_data(
            obj
        )["match_level"]

    def get_matched_skills(self, obj):

        return self.get_match_data(
            obj
        )["matched_skills"]

    def get_missing_skills(self, obj):

        return self.get_match_data(
            obj
        )["missing_skills"]

    def get_confidence_gaps(self, obj):

        return self.get_match_data(
            obj
        )["confidence_gaps"]