from django.urls import path, include
from rest_framework.routers import DefaultRouter
from system import views

# Create a router and register our viewsets with it.
class Router(DefaultRouter):
    APIRootView     = views.IndexView
    root_view_name  = 'index'

router = Router()
router.register(r'hosts', views.SystemHostViewSet)
router.register(r'pumps', views.PumpViewSet)

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
]
