from django.db.models import QuerySet

from .models import StudentSkill
from evidence.models import Evidence


class SkillConfidenceService:

    @staticmethod
    def calculate(student, skill):
        evidence_queryset = Evidence.objects.filter(
            student=student,
            skills=skill,
        )

        if not evidence_queryset.exists():
            return {
                "confidence_score": 0,
                "confidence_level": "unverified",
                "evidence_count": 0,
                "explanation": (
                    "No supporting evidence has been "
                    "connected to this skill."
                ),
            }

        scores = list(
            evidence_queryset.values_list(
                "verification_score",
                flat=True,
            )
        )

        average_score = sum(scores) / len(scores)

        # More independent evidence increases confidence,
        # but with diminishing returns.
        evidence_bonus = min(
            len(scores) * 5,
            15,
        )

        confidence_score = min(
            round(
                average_score + evidence_bonus
            ),
            100,
        )

        if confidence_score >= 85:
            confidence_level = "strong"

        elif confidence_score >= 70:
            confidence_level = "high"

        elif confidence_score >= 50:
            confidence_level = "moderate"

        else:
            confidence_level = "low"

        return {
            "confidence_score": confidence_score,
            "confidence_level": confidence_level,
            "evidence_count": len(scores),
            "evidence_scores": scores,
            "explanation": (
                f"{len(scores)} piece(s) of evidence "
                f"support this skill with an average "
                f"verification score of "
                f"{round(average_score)}."
            ),
        }