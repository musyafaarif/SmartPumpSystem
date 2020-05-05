from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.renderers import JSONRenderer

from location.models import Province, Regency, District, Village
from location.serializers import ProvinceSerializer, RegencySerializer, DistrictSerializer, VillageSerializer

class ProvinceView(ListAPIView):
    queryset = Province.objects.all()
    serializer_class = ProvinceSerializer
    renderer_classes = [JSONRenderer]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class RegencyView(ListAPIView):
    queryset = Regency.objects.all()
    serializer_class = RegencySerializer
    renderer_classes = [JSONRenderer]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        if 'province_id' in request.GET:
            queryset = queryset.filter(province_id=request.GET['province_id'])

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class DistrictView(ListAPIView):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer
    renderer_classes = [JSONRenderer]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        if 'regency_id' in request.GET:
            queryset = queryset.filter(regency_id=request.GET['regency_id'])
        elif 'province_id' in request.GET:
            queryset = queryset.filter(regency_id__gte=(int(request.GET['province_id']) * 100), regency_id__lt=((int(request.GET['province_id']) + 1) * 100))

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class VillageView(ListAPIView):
    queryset = Village.objects.all()
    serializer_class = VillageSerializer
    renderer_classes = [JSONRenderer]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        if 'district_id' in request.GET:
            queryset = queryset.filter(district_id=request.GET['district_id'])
        elif 'regency_id' in request.GET:
            queryset = queryset.filter(district_id__gte=(int(request.GET['regency_id']) * 1000), district_id__lt=((int(request.GET['regency_id']) + 1) * 1000))
        elif 'province_id' in request.GET:
            queryset = queryset.filter(district_id__gte=(int(request.GET['province_id']) * 100000), district_id__lt=((int(request.GET['province_id']) + 1) * 100000))

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
