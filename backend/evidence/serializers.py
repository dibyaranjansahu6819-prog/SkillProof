from rest_framework import serializers

from .models import Evidence


class EvidenceSerializer(serializers.ModelSerializer):
    skill_names = serializers.SerializerMethodField()

    class Meta:
        model = Evidence
        fields = [
            "id",
            "title",
            "evidence_type",
            "description",
            "issuing_organization",
            "evidence_url",
            "verification_status",
            "verification_score",
            "verification_details",
            "issued_date",
            "skills",
            "skill_names",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "verification_status",
            "verification_score",
            "verification_details",
            "skill_names",
            "created_at",
            "updated_at",
        ]

    def get_skill_names(self, obj):
        return list(
            obj.skills.values_list(
                "name",
                flat=True,
            )
        )