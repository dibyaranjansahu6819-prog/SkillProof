from skills.models import StudentSkill
from skills.services import SkillConfidenceService

from .models import Opportunity


class OpportunityMatchingService:

    @classmethod
    def calculate_match(cls, student, opportunity):

        requirements = (
            opportunity.skill_requirements
            .select_related("skill")
        )

        if not requirements.exists():
            return {
                "match_score": 0,
                "match_level": "insufficient_data",
                "matched_skills": [],
                "missing_skills": [],
                "confidence_gaps": [],
                "explanation": (
                    "This opportunity does not have "
                    "enough skill requirements."
                ),
            }

        total_weight = 0
        achieved_weight = 0

        matched_skills = []
        missing_skills = []
        confidence_gaps = []

        for requirement in requirements:

            skill = requirement.skill

            importance = max(
                1,
                requirement.importance,
            )

            total_weight += importance

            try:
                student_skill = (
                    StudentSkill.objects
                    .select_related("skill")
                    .get(
                        student=student,
                        skill=skill,
                    )
                )

            except StudentSkill.DoesNotExist:

                missing_skills.append({
                    "skill_id": skill.id,
                    "skill": skill.name,
                    "required": requirement.is_required,
                    "importance": importance,
                })

                continue

            confidence = (
                SkillConfidenceService.calculate(
                    student,
                    skill,
                )
            )

            confidence_score = (
                confidence["confidence_score"]
            )

            minimum_confidence = (
                requirement.minimum_confidence
            )

            # Calculate how much of the requirement
            # has actually been satisfied.
            requirement_score = min(
                confidence_score,
                100,
            )

            achieved_weight += (
                importance *
                requirement_score /
                100
            )

            if (
                confidence_score
                >= minimum_confidence
            ):

                matched_skills.append({
                    "skill_id": skill.id,
                    "skill": skill.name,
                    "confidence": confidence_score,
                    "required": requirement.is_required,
                    "importance": importance,
                    "evidence_count": (
                        confidence[
                            "evidence_count"
                        ]
                    ),
                    "explanation": (
                        confidence[
                            "explanation"
                        ]
                    ),
                })

            else:

                confidence_gaps.append({
                    "skill_id": skill.id,
                    "skill": skill.name,
                    "confidence": confidence_score,
                    "required_confidence": (
                        minimum_confidence
                    ),
                    "required": requirement.is_required,
                    "importance": importance,
                })

        if total_weight == 0:
            match_score = 0
        else:
            match_score = round(
                (
                    achieved_weight /
                    total_weight
                ) * 100
            )

        required_missing = [
            item
            for item in missing_skills
            if item["required"]
        ]

        required_gaps = [
            item
            for item in confidence_gaps
            if item["required"]
        ]

        if match_score >= 85:
            match_level = "excellent"

        elif match_score >= 70:
            match_level = "strong"

        elif match_score >= 50:
            match_level = "moderate"

        else:
            match_level = "low"

        explanation_parts = []

        if matched_skills:
            explanation_parts.append(
                f"{len(matched_skills)} required or "
                f"preferred skill(s) are supported "
                f"by your evidence."
            )

        if required_missing:
            explanation_parts.append(
                f"{len(required_missing)} required "
                f"skill(s) are missing."
            )

        if required_gaps:
            explanation_parts.append(
                f"{len(required_gaps)} required "
                f"skill(s) have insufficient "
                f"evidence confidence."
            )

        if not explanation_parts:
            explanation_parts.append(
                "There is not enough evidence "
                "to explain this match."
            )

        return {
            "match_score": match_score,
            "match_level": match_level,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "confidence_gaps": confidence_gaps,
            "explanation": " ".join(
                explanation_parts
            ),
        }