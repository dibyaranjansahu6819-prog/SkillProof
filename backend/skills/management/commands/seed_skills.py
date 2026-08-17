from django.core.management.base import BaseCommand

from skills.models import Skill, SkillCategory


SKILLS = [
    # Programming
    ("Python", SkillCategory.PROGRAMMING),
    ("Java", SkillCategory.PROGRAMMING),
    ("C", SkillCategory.PROGRAMMING),
    ("C++", SkillCategory.PROGRAMMING),
    ("JavaScript", SkillCategory.PROGRAMMING),
    ("TypeScript", SkillCategory.PROGRAMMING),

    # Web Development
    ("HTML", SkillCategory.WEB_DEVELOPMENT),
    ("CSS", SkillCategory.WEB_DEVELOPMENT),
    ("React", SkillCategory.WEB_DEVELOPMENT),
    ("Django", SkillCategory.WEB_DEVELOPMENT),
    ("Django REST Framework", SkillCategory.WEB_DEVELOPMENT),
    ("Node.js", SkillCategory.WEB_DEVELOPMENT),
    ("REST API", SkillCategory.WEB_DEVELOPMENT),

    # Database
    ("SQL", SkillCategory.DATABASE),
    ("PostgreSQL", SkillCategory.DATABASE),
    ("MySQL", SkillCategory.DATABASE),
    ("MongoDB", SkillCategory.DATABASE),
    ("Database Design", SkillCategory.DATABASE),

    # AI / ML
    ("Machine Learning", SkillCategory.AI_ML),
    ("Deep Learning", SkillCategory.AI_ML),
    ("Natural Language Processing", SkillCategory.AI_ML),
    ("Computer Vision", SkillCategory.AI_ML),
    ("Data Analysis", SkillCategory.AI_ML),

    # Cloud / DevOps
    ("Git", SkillCategory.CLOUD),
    ("GitHub", SkillCategory.CLOUD),
    ("Docker", SkillCategory.CLOUD),
    ("AWS", SkillCategory.CLOUD),
    ("Linux", SkillCategory.CLOUD),
    ("CI/CD", SkillCategory.CLOUD),

    # Design
    ("UI/UX Design", SkillCategory.DESIGN),
    ("Figma", SkillCategory.DESIGN),
    ("Prototyping", SkillCategory.DESIGN),

    # Soft Skills
    ("Communication", SkillCategory.SOFT_SKILL),
    ("Leadership", SkillCategory.SOFT_SKILL),
    ("Teamwork", SkillCategory.SOFT_SKILL),
    ("Problem Solving", SkillCategory.SOFT_SKILL),
    ("Critical Thinking", SkillCategory.SOFT_SKILL),
]


class Command(BaseCommand):
    help = "Populate the SkillProof skill catalog"

    def handle(self, *args, **options):
        created_count = 0
        existing_count = 0

        for name, category in SKILLS:
            skill, created = Skill.objects.get_or_create(
                name=name,
                defaults={
                    "category": category,
                },
            )

            if created:
                created_count += 1
            else:
                existing_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Skill catalog ready. "
                f"Created: {created_count}, "
                f"Already existed: {existing_count}"
            )
        )