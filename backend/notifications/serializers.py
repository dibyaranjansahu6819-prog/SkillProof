from rest_framework import serializers

from .models import Notification


class NotificationSerializer(
    serializers.ModelSerializer
):

    application_id = serializers.IntegerField(
        source="application.id",
        allow_null=True,
        read_only=True,
    )

    class Meta:

        model = Notification

        fields = [
            "id",
            "notification_type",
            "title",
            "message",
            "application_id",
            "is_read",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "notification_type",
            "title",
            "message",
            "application_id",
            "created_at",
        ]