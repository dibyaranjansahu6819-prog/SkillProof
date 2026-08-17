from django.urls import path

from .views import (
    MyEvidenceListCreateView,
    MyEvidenceDetailView,
)


urlpatterns = [
    path(
        "",
        MyEvidenceListCreateView.as_view(),
        name="my-evidence",
    ),

    path(
        "<int:pk>/",
        MyEvidenceDetailView.as_view(),
        name="my-evidence-detail",
    ),
]