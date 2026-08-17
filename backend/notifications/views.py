from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(
    generics.ListAPIView
):

    permission_classes = [
        IsAuthenticated
    ]

    serializer_class = (
        NotificationSerializer
    )

    def get_queryset(self):

        return (
            Notification.objects
            .filter(
                recipient=self.request.user
            )
            .select_related(
                "application",
                "application__opportunity",
            )
            .order_by(
                "-created_at"
            )
        )


class UnreadNotificationCountView(
    generics.GenericAPIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        count = (
            Notification.objects
            .filter(
                recipient=request.user,
                is_read=False,
            )
            .count()
        )

        return Response(
            {
                "count": count
            }
        )


class NotificationMarkReadView(
    generics.GenericAPIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def patch(
        self,
        request,
        pk
    ):

        try:

            notification = (
                Notification.objects
                .get(
                    id=pk,
                    recipient=request.user,
                )
            )

        except Notification.DoesNotExist:

            return Response(
                {
                    "detail":
                        "Notification not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        notification.is_read = True

        notification.save(
            update_fields=[
                "is_read"
            ]
        )

        return Response(
            {
                "detail":
                    "Notification marked as read.",
                "id":
                    notification.id,
                "is_read":
                    notification.is_read,
            }
        )


class NotificationMarkAllReadView(
    generics.GenericAPIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def patch(
        self,
        request
    ):

        updated_count = (
            Notification.objects
            .filter(
                recipient=request.user,
                is_read=False,
            )
            .update(
                is_read=True
            )
        )

        return Response(
            {
                "detail":
                    "All notifications marked as read.",
                "updated_count":
                    updated_count,
            }
        )