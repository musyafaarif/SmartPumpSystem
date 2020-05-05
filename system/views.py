from system.models import SystemHost, Pump
from system.serializers import SystemHostSerializer, PumpSerializer
from system.permissions import IsOwnerOrReadOnly, IsOwnerHostOrReadOnly, SuperUserPass
from system.negotiation import RestrictApiView

from rest_framework import permissions, renderers, viewsets, routers, filters, pagination
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.reverse import reverse

from django.views.generic import View
from django.contrib.auth.models import User
from django_filters import rest_framework as django_filters

class IndexView(routers.APIRootView):
    template_name       = 'index.html'

    renderer_classes            = [renderers.JSONRenderer,
                                   renderers.TemplateHTMLRenderer,
                                   renderers.BrowsableAPIRenderer]
    content_negotiation_class   = RestrictApiView

class SystemHostViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset                    = SystemHost.objects.all()
    filter_backends             = [django_filters.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields            = ['province', 'regency', 'district', 'village', 'warning_level', 'owner__username']
    ordering_fields             = ['id', 'warning_level']
    ordering                    = ['warning_level']
    search_fields               = ['province__name', 'regency__name', 'district__name', 'village__name', 'warning_level']

    serializer_class            = SystemHostSerializer
    permission_classes          = [IsOwnerOrReadOnly|SuperUserPass,]
    renderer_classes            = [renderers.JSONRenderer,
                                   renderers.TemplateHTMLRenderer,
                                   renderers.BrowsableAPIRenderer]
    content_negotiation_class   = RestrictApiView

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class PumpViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset                    = Pump.objects.all()
    filter_backends             = [django_filters.DjangoFilterBackend]
    filterset_fields            = ['host__id']
    pagination_class            = None
    serializer_class            = PumpSerializer
    permission_classes          = [IsOwnerHostOrReadOnly|SuperUserPass,]
    renderer_classes            = [renderers.JSONRenderer,
                                   renderers.TemplateHTMLRenderer,
                                   renderers.BrowsableAPIRenderer]
    content_negotiation_class   = RestrictApiView
