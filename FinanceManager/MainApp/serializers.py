from rest_framework import serializers
from .models import FinancialTracker  # Replace with your model name
from django.utils import timezone
from .models import CustomUser

class FinancialTrackerSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialTracker
        fields = '__all__'

        def validate_created_at(self, value):
        # Ensure the datetime is aware
            if value and timezone.is_naive(value):
                value = timezone.make_aware(value)
            return value


  # Replace with your model name

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
