from .services import OpportunityMatchingService


class SkillGrowthRoadmapService:

    @classmethod
    def generate(cls, student, opportunity):

        match = (
            OpportunityMatchingService
            .calculate_match(
                student,
                opportunity,
            )
        )

        roadmap = []

        # Missing skills
        for skill in match["missing_skills"]:

            priority = (
                "high"
                if skill["required"]
                and skill["importance"] >= 80
                else "medium"
                if skill["importance"] >= 50
                else "low"
            )

            roadmap.append({
                "skill_id": skill["skill_id"],
                "skill": skill["skill"],
                "priority": priority,
                "importance": skill["importance"],
                "type": "missing",
                "action": (
                    f"Build evidence demonstrating "
                    f"{skill['skill']}."
                ),
                "reason": (
                    "This skill is not currently "
                    "supported by your passport."
                ),
            })

        # Confidence gaps
        for gap in match["confidence_gaps"]:

            difference = (
                gap["required_confidence"]
                - gap["confidence"]
            )

            priority = (
                "high"
                if difference >= 25
                else "medium"
                if difference >= 10
                else "low"
            )

            roadmap.append({
                "skill_id": gap["skill_id"],
                "skill": gap["skill"],
                "priority": priority,
                "importance": gap["importance"],
                "type": "confidence_gap",
                "current_confidence": gap["confidence"],
                "target_confidence": (
                    gap["required_confidence"]
                ),
                "gap": difference,
                "action": (
                    f"Add stronger evidence for "
                    f"{gap['skill']}."
                ),
                "reason": (
                    "You have this skill, but your "
                    "current evidence confidence is "
                    "below the opportunity requirement."
                ),
            })

        priority_order = {
            "high": 0,
            "medium": 1,
            "low": 2,
        }

        roadmap.sort(
            key=lambda item: (
                priority_order[
                    item["priority"]
                ],
                -item["importance"],
            )
        )

        return {
            "opportunity": {
                "id": opportunity.id,
                "title": opportunity.title,
                "organization": (
                    opportunity.organization
                ),
            },
            "current_match": (
                match["match_score"]
            ),
            "match_level": (
                match["match_level"]
            ),
            "roadmap": roadmap,
        }