from django.conf import settings
from django.db import models
from django.utils.timezone import now

from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)  # Make email unique

    # Remove unnecessary fields by overriding
    first_name = None
    last_name = None

class FinancialTracker(models.Model):
    # Reference to the User model
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="financial_records")
    
    # Predefined category options
    CATEGORY_CHOICES = models.CharField(max_length=50)
    type = models.CharField(max_length=50)
    
    # Amount field
    amount = models.IntegerField()

    # Timestamp fields
    created_at = models.DateTimeField(blank=True, null=True)
    
    def save(self, *args, **kwargs):
        if not self.created_at:  # Set to current time if not provided
            self.created_at = now()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} {self.user.email}- - {self.CATEGORY_CHOICES} - {self.amount} - {self.created_at}"


