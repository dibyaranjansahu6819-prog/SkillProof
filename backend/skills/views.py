from evidence.models import Evidence
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Skill, StudentSkill
from .serializers import (
    SkillSerializer,
    StudentSkillSerializer,
    SkillProofGraphSerializer,
)
from .services import SkillConfidenceService

class SkillListView(generics.ListAPIView):
    queryset = Skill.objects.filter(
        is_active=True
    ).order_by("name")

    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]


class MySkillListCreateView(
    generics.ListCreateAPIView
):
    serializer_class = StudentSkillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return StudentSkill.objects.filter(
            student=self.request.user
        ).select_related("skill")

    def perform_create(self, serializer):
        serializer.save(
            student=self.request.user
        )

class MySkillProofGraphView(
    generics.RetrieveAPIView
):
    permission_classes = [IsAuthenticated]
    serializer_class = SkillProofGraphSerializer

    def get_object(self):
        skills = Skill.objects.filter(
            student_skills__student=self.request.user,
            is_active=True,
        ).distinct()

        evidence = Evidence.objects.filter(
            student=self.request.user
        ).prefetch_related("skills")

        return {
            "skills": skills,
            "evidence": evidence,
        }

class MySkillConfidenceView(
    generics.RetrieveAPIView
):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        try:
            student_skill = (
                StudentSkill.objects
                .select_related("skill")
                .get(
                    student=request.user,
                    skill_id=pk,
                )
            )

        except StudentSkill.DoesNotExist:
            return Response(
                {
                    "detail": (
                        "This skill is not in "
                        "your passport."
                    )
                },
                status=404,
            )

        result = (
            SkillConfidenceService.calculate(
                request.user,
                student_skill.skill,
            )
        )

        return Response({
            "skill": {
                "id": student_skill.skill.id,
                "name": student_skill.skill.name,
                "category": student_skill.skill.category,
            },
            "self_assessment": (
                student_skill.self_assessment_score
            ),
            **result,
        })