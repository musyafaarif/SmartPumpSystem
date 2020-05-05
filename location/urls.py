from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns

from location import views

# The API URLs are now determined automatically by the router.
urlpatterns = format_suffix_patterns([
    path('province/', views.ProvinceView.as_view(), name='province'),
    path('regency/', views.RegencyView.as_view(), name='regency'),
    path('district/', views.DistrictView.as_view(), name='district'),
    path('village/', views.VillageView.as_view(), name='village'),
])
