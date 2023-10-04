import re
from rest_framework import serializers
from .models import Task
from django.contrib.auth.models import User
from .__init__ import Status, Priority


class UserExistsValidator:
    def __call__(self, value):
        try:
            User.objects.get(pk=value)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                "User with this ID does not exist.")


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

        title = serializers.CharField(max_length=255, required=True)

        description = serializers.CharField(max_length=5000, required=True)

        due_date = serializers.DateField(allow_null=True)

        status = serializers.ChoiceField(choices=[(
            status.name, status.value) for status in Status], default=Status.TO_DO.value)

        priority = serializers.ChoiceField(choices=[(
            priority.name, priority.value) for priority in Priority], default=Priority.LOW.value)

        user = serializers.PrimaryKeyRelatedField(
            queryset=User.objects.all(),
            validators=[UserExistsValidator()],
            required=False
        )

        def validate_due_date(self, value):
            # Validate date format 'YYYY-MM-DD'
            date_pattern = re.compile(r'^\d{4}-\d{2}-\d{2}$')
            if not date_pattern.match(value):
                raise serializers.ValidationError(
                    "Due date must be in the format 'YYYY-MM-DD'.")
            return value
