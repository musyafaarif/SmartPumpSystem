from rest_framework import serializers

from location.models import Province, Regency, District, Village

class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = '__all__'
        read_only_fields = ['__all__']

class RegencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Regency
        fields = '__all__'
        read_only_fields = ['__all__']


class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = '__all__'
        read_only_fields = ['__all__']


class VillageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Village
        fields = '__all__'
        read_only_fields = ['__all__']
