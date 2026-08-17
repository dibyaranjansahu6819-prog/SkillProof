from .models import (
    Evidence,
    VerificationStatus,
)


class EvidenceVerificationService:

    @staticmethod
    def evaluate(evidence):
        score = 0
        details = []

        # Evidence URL
        if evidence.evidence_url:
            score += 25

            details.append({
                "factor": "Evidence URL",
                "points": 25,
                "status": "present",
                "explanation": (
                    "A public evidence link was provided."
                ),
            })
        else:
            details.append({
                "factor": "Evidence URL",
                "points": 0,
                "status": "missing",
                "explanation": (
                    "No public evidence link was provided."
                ),
            })


        # Description
        if evidence.description:
            description_length = len(
                evidence.description
            )

            if description_length >= 100:
                score += 20

                details.append({
                    "factor": "Description",
                    "points": 20,
                    "status": "strong",
                    "explanation": (
                        "The evidence contains a detailed "
                        "description."
                    ),
                })

            elif description_length >= 50:
                score += 10

                details.append({
                    "factor": "Description",
                    "points": 10,
                    "status": "moderate",
                    "explanation": (
                        "The evidence has a basic "
                        "description."
                    ),
                })

            else:
                details.append({
                    "factor": "Description",
                    "points": 0,
                    "status": "weak",
                    "explanation": (
                        "The description is too short "
                        "to provide strong context."
                    ),
                })

        else:
            details.append({
                "factor": "Description",
                "points": 0,
                "status": "missing",
                "explanation": (
                    "No description was provided."
                ),
            })


        # Issuing organization
        if evidence.issuing_organization:
            score += 15

            details.append({
                "factor": "Issuing Organization",
                "points": 15,
                "status": "present",
                "explanation": (
                    "An organization associated with "
                    "the evidence was provided."
                ),
            })
        else:
            details.append({
                "factor": "Issuing Organization",
                "points": 0,
                "status": "missing",
                "explanation": (
                    "No issuing organization was provided."
                ),
            })


        # Date
        if evidence.issued_date:
            score += 10

            details.append({
                "factor": "Evidence Date",
                "points": 10,
                "status": "present",
                "explanation": (
                    "The evidence includes an issue date."
                ),
            })
        else:
            details.append({
                "factor": "Evidence Date",
                "points": 0,
                "status": "missing",
                "explanation": (
                    "No issue date was provided."
                ),
            })


        # Skills
        skill_count = evidence.skills.count()

        if skill_count >= 3:
            score += 20

            details.append({
                "factor": "Skill Connections",
                "points": 20,
                "status": "strong",
                "explanation": (
                    "The evidence is connected to "
                    "three or more skills."
                ),
            })

        elif skill_count >= 1:
            score += 10

            details.append({
                "factor": "Skill Connections",
                "points": 10,
                "status": "moderate",
                "explanation": (
                    "The evidence is connected to "
                    "at least one skill."
                ),
            })

        else:
            details.append({
                "factor": "Skill Connections",
                "points": 0,
                "status": "missing",
                "explanation": (
                    "The evidence is not connected "
                    "to any skills."
                ),
            })


        # Evidence type
        if evidence.evidence_type in [
            "credential",
            "competition",
            "assessment",
        ]:
            score += 10

            details.append({
                "factor": "Evidence Type",
                "points": 10,
                "status": "strong",
                "explanation": (
                    "This evidence type provides "
                    "additional verification context."
                ),
            })
        else:
            details.append({
                "factor": "Evidence Type",
                "points": 0,
                "status": "standard",
                "explanation": (
                    "This evidence type receives "
                    "no additional verification points."
                ),
            })


        score = min(score, 100)


        if score >= 80:
            status = VerificationStatus.VERIFIED

        elif score >= 50:
            status = (
                VerificationStatus.PARTIALLY_VERIFIED
            )

        else:
            status = VerificationStatus.PENDING


        return score, status, details


    @classmethod
    def verify(cls, evidence):

        score, status, details = cls.evaluate(
            evidence
        )

        evidence.verification_score = score

        evidence.verification_status = status

        evidence.verification_details = {
            "score": score,
            "factors": details,
        }

        evidence.save(
            update_fields=[
                "verification_score",
                "verification_status",
                "verification_details",
                "updated_at",
            ]
        )

        return evidence