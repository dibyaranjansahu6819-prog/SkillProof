from django.urls import path

from .views import (
    OpportunityListView,
    OpportunityMatchDetailView,
    OpportunitySkillGapView,
    OpportunityRoadmapView,
    RecruiterDashboardView,
    RecruiterOpportunityListView,
    RecruiterOpportunityCreateView,
    OpportunityApplyView,
    RecruiterApplicationListView,
    StudentApplicationListView,
    StudentApplicationDetailView,
)
urlpatterns = [
    path(
        "",
        OpportunityListView.as_view(),
        name="opportunity-list",
    ),

    path(
        "<int:pk>/match/",
        OpportunityMatchDetailView.as_view(),
        name="opportunity-match",
    ),
    
    path(
    "<int:pk>/skill-gaps/",
    OpportunitySkillGapView.as_view(),
    name="opportunity-skill-gaps",
    ),
    
    path(
    "<int:pk>/roadmap/",
    OpportunityRoadmapView.as_view(),
    name="opportunity-roadmap",
    ),  
    
    path(
    "recruiter/dashboard/",
    RecruiterDashboardView.as_view(),
    name="recruiter-dashboard",
    ),
    
    path(
    "recruiter/",
    RecruiterOpportunityListView.as_view(),
    name="recruiter-opportunity-list",
    ),
    
    path(
    "recruiter/create/",
    RecruiterOpportunityCreateView.as_view(),
    name="recruiter-opportunity-create",
    ),
    
    path(
    "<int:pk>/apply/",
    OpportunityApplyView.as_view(),
    name="opportunity-apply",
    ),
    
    path(
    "recruiter/applications/",
    RecruiterApplicationListView.as_view(),
    name="recruiter-applications",
    ),
    
    path(
    "my-applications/",
    StudentApplicationListView.as_view(),
    name="student-applications",
    ),
    
    path(
    "my-applications/<int:pk>/",
    StudentApplicationDetailView.as_view(),
    name="student-application-detail",
    ),
]