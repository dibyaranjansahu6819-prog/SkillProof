from rest_framework import serializers

from .models import Skill, StudentSkill


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = [
            "id",
            "name",
            "category",
            "description",
            "is_active",
        ]


class StudentSkillSerializer(serializers.ModelSerializer):
    skill_name = serializers.CharField(
        source="skill.name",
        read_only=True,
    )

    skill_category = serializers.CharField(
        source="skill.category",
        read_only=True,
    )

    class Meta:
        model = StudentSkill
        fields = [
            "id",
            "skill",
            "skill_name",
            "skill_category",
            "proficiency",
            "self_assessment_score",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "skill_name",
            "skill_category",
            "created_at",
            "updated_at",
        ]

class SkillProofGraphSerializer(serializers.Serializer):
    skills = serializers.SerializerMethodField()
    evidence = serializers.SerializerMethodField()

    def get_skills(self, obj):
        return [
            {
                "id": skill.id,
                "name": skill.name,
                "category": skill.category,
            }
            for skill in obj["skills"]
        ]

    def get_evidence(self, obj):
        return [
            {
                "id": item.id,
                "title": item.title,
                "type": item.evidence_type,
                "verification_status": item.verification_status,
                "verification_score": item.verification_score,
                "skills": list(
                    item.skills.values_list(
                        "id",
                        flat=True,
                    )
                ),
            }
            for item in obj["evidence"]
        ]