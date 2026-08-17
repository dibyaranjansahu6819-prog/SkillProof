from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Evidence
from .serializers import EvidenceSerializer
from .services import EvidenceVerificationService


class MyEvidenceListCreateView(
    generics.ListCreateAPIView
):
    serializer_class = EvidenceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Evidence.objects.filter(
            student=self.request.user
        ).prefetch_related("skills")

    def perform_create(self, serializer):
        evidence = serializer.save(
            student=self.request.user
        )

        EvidenceVerificationService.verify(
            evidence
        )


class MyEvidenceDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = EvidenceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Evidence.objects.filter(
            student=self.request.user
        ).prefetch_related("skills")

    def perform_update(self, serializer):
        evidence = serializer.save()

        EvidenceVerificationService.verify(
            evidence
        )
