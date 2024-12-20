from django.shortcuts import render
from datetime import datetime, timedelta
from django.utils import timezone
from .models import CustomUser
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import UserSerializer, FinancialTrackerSerializer
from .models import FinancialTracker

# Get the custom user model
User = CustomUser

class FinancialTrackerListCreateView(generics.ListCreateAPIView):
    serializer_class = FinancialTrackerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return FinancialTracker.objects.filter(user=user)
    
    def post(self, request):
        data = request.data
        data['user'] = request.user.id
        # Check if the data is valid
        serializer = FinancialTrackerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteDataView(generics.DestroyAPIView):
    serializer_class = FinancialTrackerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return FinancialTracker.objects.filter(user=user)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class FinancialRecordView(APIView):
    def get(self, request):
        # Fetch query parameters
        time_period = request.query_params.get('time_period', 'month')
        base_date = request.query_params.get('date', datetime.now().strftime('%Y-%m-%d'))
        limit = request.query_params.get('limit', None)
        offset = request.query_params.get('offset', None)

        try:
            base_date = datetime.strptime(base_date, '%Y-%m-%d')
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)

        # Make base_date timezone-aware
        base_date = timezone.make_aware(base_date, timezone.get_current_timezone())

        # Filter based on time_period
        if time_period == 'year':
            start_date = base_date - timedelta(days=365)  # 365 days back from the base date
            end_date = base_date
        elif time_period == 'month':
            start_date = base_date - timedelta(days=30)  # 365 days back from the base date
            end_date = base_date
        elif time_period == 'week':
            start_date = base_date - timedelta(days=7)  # 365 days back from the base date
            end_date = base_date  # Sunday of the current week
        else:
            return Response({"error": "Invalid time_period. Use 'year', 'month', or 'week'."}, status=400)
       
        try:
            limit = int(limit) if limit is not None else None
            offset = int(offset) if offset is not None else 0
        except ValueError:
            return Response({"error": "Limit and offset must be integers."}, status=400)
            
        # Query the filtered records
        if (limit != None and offset != None):
            records = FinancialTracker.objects.filter(
                created_at__gte=start_date, created_at__lte=end_date, user=request.user
            )[offset:limit+offset]
        else:
            records = FinancialTracker.objects.filter(
             created_at__gte=start_date, created_at__lte=end_date, user=request.user
            )

        serializer = FinancialTrackerSerializer(records, many=True)

        return Response(serializer.data)
