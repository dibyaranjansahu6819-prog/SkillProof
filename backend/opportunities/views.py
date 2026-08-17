from rest_framework import generics

from rest_framework.permissions import IsAuthenticated

from rest_framework.response import Response


from .models import (
    Opportunity,
    Application,
)


from .services import (
    OpportunityMatchingService
)


from skills.models import Skill

from notifications.models import Notification


from .roadmap import (
    SkillGrowthRoadmapService
)


from .serializers import (
    RecruiterOpportunityCreateSerializer,
    ApplicationCreateSerializer,
    RecruiterApplicationSerializer,
    RecruiterApplicationStatusSerializer,
    StudentApplicationSerializer,
    StudentApplicationDetailSerializer,
)


class OpportunityListView(
    generics.ListAPIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):

        return (
            Opportunity.objects
            .filter(
                is_active=True
            )
            .prefetch_related(
                "skill_requirements__skill"
            )
        )

    def list(
        self,
        request,
        *args,
        **kwargs
    ):

        opportunities = self.get_queryset()

        results = []

        for opportunity in opportunities:

            match = (
                OpportunityMatchingService
                .calculate_match(
                    request.user,
                    opportunity,
                )
            )

            results.append({

                "id": opportunity.id,

                "title": opportunity.title,

                "organization": (
                    opportunity.organization
                ),

                "opportunity_type": (
                    opportunity.opportunity_type
                ),

                "description": (
                    opportunity.description
                ),

                "remote": opportunity.remote,

                "location": (
                    opportunity.location
                ),

                "deadline": (
                    opportunity.deadline
                ),

                **match,

            })

        results.sort(
            key=lambda item:
                item["match_score"],
            reverse=True,
        )

        return Response(
            results
        )


class OpportunityMatchDetailView(
    generics.RetrieveAPIView
):

    permission_classes = [
        IsAuthenticated
    ]

    queryset = (
        Opportunity.objects
        .filter(
            is_active=True
        )
        .prefetch_related(
            "skill_requirements__skill"
        )
    )

    def retrieve(
        self,
        request,
        *args,
        **kwargs
    ):

        opportunity = self.get_object()

        match = (
            OpportunityMatchingService
            .calculate_match(
                request.user,
                opportunity,
            )
        )

        return Response({

            "opportunity": {

                "id": opportunity.id,

                "title": opportunity.title,

                "organization": (
                    opportunity.organization
                ),

                "opportunity_type": (
                    opportunity.opportunity_type
                ),

                "description": (
                    opportunity.description
                ),

                "remote": opportunity.remote,

                "location": (
                    opportunity.location
                ),

                "deadline": (
                    opportunity.deadline
                ),

                "application_url": (
                    opportunity.application_url
                ),

            },

            **match,

        })


class OpportunitySkillGapView(
    generics.RetrieveAPIView
):

    permission_classes = [
        IsAuthenticated
    ]

    queryset = (
        Opportunity.objects
        .filter(
            is_active=True
        )
        .prefetch_related(
            "skill_requirements__skill"
        )
    )

    def retrieve(
        self,
        request,
        *args,
        **kwargs
    ):

        opportunity = self.get_object()

        match = (
            OpportunityMatchingService
            .calculate_match(
                request.user,
                opportunity,
            )
        )

        development_skills = []

        for skill in match[
            "missing_skills"
        ]:

            development_skills.append({

                "skill_id": (
                    skill["skill_id"]
                ),

                "skill": (
                    skill["skill"]
                ),

                "required": (
                    skill["required"]
                ),

                "importance": (
                    skill["importance"]
                ),

                "reason": (
                    "This skill is required or "
                    "preferred by the opportunity "
                    "but is not currently supported "
                    "by your SkillProof passport."
                ),

            })

        for gap in match[
            "confidence_gaps"
        ]:

            development_skills.append({

                "skill_id": (
                    gap["skill_id"]
                ),

                "skill": (
                    gap["skill"]
                ),

                "required": (
                    gap["required_confidence"]
                ),

                "importance": (
                    gap["importance"]
                ),

                "current_confidence": (
                    gap["confidence"]
                ),

                "target_confidence": (
                    gap["required_confidence"]
                ),

                "reason": (
                    "You have this skill, but your "
                    "current evidence confidence is "
                    "below the opportunity's target."
                ),

            })

        return Response({

            "opportunity_id": (
                opportunity.id
            ),

            "opportunity": (
                opportunity.title
            ),

            "current_match": (
                match["match_score"]
            ),

            "development_skills": (
                development_skills
            ),

        })


class OpportunityRoadmapView(
    generics.RetrieveAPIView
):

    permission_classes = [
        IsAuthenticated
    ]

    queryset = (
        Opportunity.objects
        .filter(
            is_active=True
        )
        .prefetch_related(
            "skill_requirements__skill"
        )
    )

    def retrieve(
        self,
        request,
        *args,
        **kwargs
    ):

        opportunity = self.get_object()

        roadmap = (
            SkillGrowthRoadmapService
            .generate(
                request.user,
                opportunity,
            )
        )

        return Response(
            roadmap
        )


class RecruiterDashboardView(
    generics.GenericAPIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def get(
        self,
        request,
        *args,
        **kwargs
    ):

        if request.user.role != "recruiter":

            return Response(
                {
                    "detail": (
                        "Only recruiters can access "
                        "the recruiter dashboard."
                    )
                },
                status=403,
            )

        opportunities = (
            Opportunity.objects.filter(
                recruiter=request.user
            )
        )

        active_opportunities = (
            opportunities
            .filter(
                is_active=True
            )
            .count()
        )

        total_opportunities = (
            opportunities.count()
        )

        recruiter_applications = (
            Application.objects.filter(
                opportunity__recruiter=request.user
            )
        )

        candidates = (
            recruiter_applications.count()
        )

        shortlisted = (
            recruiter_applications
            .filter(
                status="shortlisted"
            )
            .count()
        )

        pending_review = (
            recruiter_applications
            .filter(
                status="applied"
            )
            .count()
        )

        return Response({

            "active_opportunities": (
                active_opportunities
            ),

            "total_opportunities": (
                total_opportunities
            ),

            "candidates": (
                candidates
            ),

            "shortlisted": (
                shortlisted
            ),

            "pending_review": (
                pending_review
            ),

        })


class RecruiterOpportunityListView(
    generics.ListAPIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):

        if self.request.user.role != "recruiter":

            return Opportunity.objects.none()

        return (
            Opportunity.objects
            .filter(
                recruiter=self.request.user
            )
            .prefetch_related(
                "skill_requirements__skill"
            )
            .order_by(
                "-created_at"
            )
        )

    def list(
        self,
        request,
        *args,
        **kwargs
    ):

        if request.user.role != "recruiter":

            return Response(
                {
                    "detail": (
                        "Only recruiters can access "
                        "recruiter opportunities."
                    )
                },
                status=403,
            )

        opportunities = (
            self.get_queryset()
        )

        results = []

        for opportunity in opportunities:

            results.append({

                "id": opportunity.id,

                "title": opportunity.title,

                "organization": (
                    opportunity.organization
                ),

                "opportunity_type": (
                    opportunity.opportunity_type
                ),

                "description": (
                    opportunity.description
                ),

                "location": (
                    opportunity.location
                ),

                "remote": (
                    opportunity.remote
                ),

                "application_url": (
                    opportunity.application_url
                ),

                "deadline": (
                    opportunity.deadline
                ),

                "is_active": (
                    opportunity.is_active
                ),

                "created_at": (
                    opportunity.created_at
                ),

                "updated_at": (
                    opportunity.updated_at
                ),

                "skills": [

                    {

                        "id": (
                            requirement.skill.id
                        ),

                        "name": (
                            requirement.skill.name
                        ),

                        "required": (
                            requirement.is_required
                        ),

                        "importance": (
                            requirement.importance
                        ),

                        "minimum_confidence": (
                            requirement.minimum_confidence
                        ),

                    }

                    for requirement
                    in opportunity
                    .skill_requirements
                    .all()

                ],

            })

        return Response(
            results
        )


class RecruiterOpportunityCreateView(
    generics.CreateAPIView
):

    serializer_class = (
        RecruiterOpportunityCreateSerializer
    )

    permission_classes = [
        IsAuthenticated
    ]

    def create(
        self,
        request,
        *args,
        **kwargs
    ):

        if request.user.role != "recruiter":

            return Response(
                {
                    "detail": (
                        "Only recruiters can create "
                        "opportunities."
                    )
                },
                status=403,
            )

        return super().create(
            request,
            *args,
            **kwargs
        )


class OpportunityApplyView(
    generics.CreateAPIView
):

    permission_classes = [
        IsAuthenticated
    ]

    serializer_class = (
        ApplicationCreateSerializer
    )

    def get_opportunity(self):

        return (
            Opportunity.objects
            .filter(
                id=self.kwargs["pk"],
                is_active=True,
            )
            .first()
        )

    def create(
        self,
        request,
        *args,
        **kwargs
    ):

        opportunity = (
            self.get_opportunity()
        )

        if opportunity is None:

            return Response(
                {
                    "detail": (
                        "Opportunity not found "
                        "or is no longer active."
                    )
                },
                status=404,
            )

        serializer = (
            self.get_serializer(
                data=request.data,
                context={
                    "request": request,
                    "opportunity": opportunity,
                },
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        application = (
            serializer.save()
        )

        return Response(
            {
                "id": application.id,

                "opportunity_id": (
                    application.opportunity_id
                ),

                "status": (
                    application.status
                ),

                "cover_message": (
                    application.cover_message
                ),

                "applied_at": (
                    application.applied_at
                ),

            },
            status=201,
        )
        
class StudentApplicationListView(
    generics.ListAPIView
):

    permission_classes = [
        IsAuthenticated
    ]

    serializer_class = (
        StudentApplicationSerializer
    )

    def get_queryset(self):

        if self.request.user.role != "student":

            return Application.objects.none()

        return (
            Application.objects
            .filter(
                student=self.request.user
            )
            .select_related(
                "student",
                "opportunity",
            )
            .prefetch_related(
                "opportunity__skill_requirements__skill"
            )
            .order_by(
                "-applied_at"
            )
        )

    def list(
        self,
        request,
        *args,
        **kwargs
    ):

        if request.user.role != "student":

            return Response(
                {
                    "detail": (
                        "Only students can access "
                        "their applications."
                    )
                },
                status=403,
            )

        return super().list(
            request,
            *args,
            **kwargs
        )

class StudentApplicationDetailView(
    generics.RetrieveAPIView
):

    permission_classes = [
        IsAuthenticated
    ]

    serializer_class = (
        StudentApplicationDetailSerializer
    )

    def get_queryset(self):

        if self.request.user.role != "student":

            return Application.objects.none()

        return (
            Application.objects
            .filter(
                student=self.request.user
            )
            .select_related(
                "student",
                "opportunity",
            )
            .prefetch_related(
                "opportunity__skill_requirements__skill"
            )
        )

    def retrieve(
        self,
        request,
        *args,
        **kwargs
    ):

        if request.user.role != "student":

            return Response(
                {
                    "detail": (
                        "Only students can access "
                        "their applications."
                    )
                },
                status=403,
            )

        return super().retrieve(
            request,
            *args,
            **kwargs
        )


class RecruiterApplicationListView(
    generics.ListAPIView
):

    permission_classes = [
        IsAuthenticated
    ]

    serializer_class = (
        RecruiterApplicationSerializer
    )

    def get_queryset(self):

        if self.request.user.role != "recruiter":

            return Application.objects.none()

        return (
            Application.objects
            .filter(
                opportunity__recruiter=(
                    self.request.user
                )
            )
            .select_related(
                "student",
                "opportunity",
            )
            .prefetch_related(
                "opportunity__skill_requirements__skill"
            )
            .order_by(
                "-applied_at"
            )
        )

    def list(
        self,
        request,
        *args,
        **kwargs
    ):

        if request.user.role != "recruiter":

            return Response(
                {
                    "detail": (
                        "Only recruiters can access "
                        "candidate applications."
                    )
                },
                status=403,
            )

        return super().list(
            request,
            *args,
            **kwargs
        )


class RecruiterApplicationDetailView(
    generics.RetrieveUpdateAPIView
):

    permission_classes = [
        IsAuthenticated
    ]

    serializer_class = (
        RecruiterApplicationSerializer
    )

    def get_queryset(self):

        if self.request.user.role != "recruiter":

            return Application.objects.none()

        return (
            Application.objects
            .filter(
                opportunity__recruiter=(
                    self.request.user
                )
            )
            .select_related(
                "student",
                "opportunity",
            )
            .prefetch_related(
                "opportunity__skill_requirements__skill"
            )
        )

    def get_serializer_class(self):

        if self.request.method in [
            "PUT",
            "PATCH",
        ]:

            return (
                RecruiterApplicationStatusSerializer
            )

        return (
            RecruiterApplicationSerializer
        )

    def retrieve(
        self,
        request,
        *args,
        **kwargs
    ):

        if request.user.role != "recruiter":

            return Response(
                {
                    "detail": (
                        "Only recruiters can access "
                        "candidate applications."
                    )
                },
                status=403,
            )

        return super().retrieve(
            request,
            *args,
            **kwargs
        )

    def update(
        self,
        request,
        *args,
        **kwargs
    ):

        if request.user.role != "recruiter":

            return Response(
                {
                    "detail": (
                        "Only recruiters can update "
                        "candidate applications."
                    )
                },
                status=403,
            )

        partial = kwargs.pop(
            "partial",
            False
        )

        application = self.get_object()

        previous_status = (
            application.status
        )

        serializer = self.get_serializer(
            application,
            data=request.data,
            partial=partial,
        )

        serializer.is_valid(
            raise_exception=True
        )

        updated_application = (
            serializer.save()
        )

        new_status = (
            updated_application.status
        )

        # Create a notification only when the
        # application status actually changes.
        if new_status != previous_status:

            status_labels = {
                "applied": "Applied",
                "under_review": "Under Review",
                "shortlisted": "Shortlisted",
                "interview": "Interview",
                "selected": "Selected",
                "rejected": "Rejected",
            }

            status_label = status_labels.get(
                new_status,
                str(new_status)
                .replace("_", " ")
                .title(),
            )

            opportunity_title = (
                updated_application
                .opportunity
                .title
            )

            notification_messages = {

                "under_review":
                    (
                        f"Your application for "
                        f"'{opportunity_title}' "
                        f"is now under review."
                    ),

                "shortlisted":
                    (
                        f"Great news! Your application "
                        f"for '{opportunity_title}' "
                        f"has been shortlisted."
                    ),

                "interview":
                    (
                        f"Your application for "
                        f"'{opportunity_title}' "
                        f"has moved to the interview "
                        f"stage."
                    ),

                "selected":
                    (
                        f"Congratulations! You have "
                        f"been selected for "
                        f"'{opportunity_title}'."
                    ),

                "rejected":
                    (
                        f"Your application for "
                        f"'{opportunity_title}' "
                        f"was not selected."
                    ),

                "applied":
                    (
                        f"Your application for "
                        f"'{opportunity_title}' "
                        f"is now active."
                    ),
            }

            message = notification_messages.get(
                new_status,
                (
                    f"Your application for "
                    f"'{opportunity_title}' "
                    f"is now "
                    f"{status_label.lower()}."
                ),
            )

            Notification.objects.create(

                recipient=(
                    updated_application.student
                ),

                notification_type=(
                    "application_status"
                ),

                title=(
                    f"Application {status_label}"
                ),

                message=message,

                application=(
                    updated_application
                ),
            )

        return Response(
            serializer.data
        )