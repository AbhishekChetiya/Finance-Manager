from django.urls import path,include
from . import views

urlpatterns = [
  path('add-data/',views.FinancialTrackerListCreateView.as_view(),name='add_data'),
  path('data/delete/<int:pk>/',views.DeleteDataView.as_view(),name='delete_data'),
  path('financial-records/', views.FinancialRecordView.as_view(), name='financial-records'),
]
