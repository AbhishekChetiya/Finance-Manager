from django.contrib import admin

# Register your models here.
from .models import FinancialTracker
from .models import CustomUser

admin.site.register(FinancialTracker)
admin.site.register(CustomUser)