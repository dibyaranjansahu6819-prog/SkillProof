from django.urls import path

from .views import (
    SkillListView,
    MySkillListCreateView,
    MySkillProofGraphView,
    MySkillConfidenceView,
)

urlpatterns = [
    path(
        "",
        SkillListView.as_view(),
        name="skill-list",
    ),

    path(
        "mine/",
        MySkillListCreateView.as_view(),
        name="my-skills",
    ),
    
    path(
    "proof-graph/",
    MySkillProofGraphView.as_view(),
    name="my-proof-graph",
    ),
    
    path(
    "<int:pk>/confidence/",
    MySkillConfidenceView.as_view(),
    name="skill-confidence",
    ),
]