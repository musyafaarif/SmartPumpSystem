from system.models import SystemHost, Pump

from rest_framework import serializers
from django.contrib.auth.models import User

class SystemHostSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    pumps = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    province_name = serializers.ReadOnlyField(source='province.name')
    regency_name = serializers.ReadOnlyField(source='regency.name')
    district_name = serializers.ReadOnlyField(source='district.name')
    village_name = serializers.ReadOnlyField(source='village.name')

    class Meta:
        model   = SystemHost
        fields  = [
            'id', 'url', 'owner',
            'province', 'province_name',
            'regency', 'regency_name',
            'district', 'district_name',
            'village', 'village_name',
            'latitude', 'longitude',
            'next_host', 'prev_host',
            'water_level', 'water_levels', 'warning_level',
            'water_level_delimiter_upper', 'water_level_delimiter_middle', 'water_level_delimiter_lower',
            'pumps'
        ]

    def create(self, validated_data):
        validated_data['water_levels'] = validated_data.get('water_level')
        return SystemHost(**validated_data)

    def update(self, instance, validated_data):
        if "water_level" in validated_data:
            water_level = instance.water_levels.split(';')
            if len(water_level) >= 50:
                water_level.pop()
            validated_data['water_levels'] = str(validated_data.get('water_level')) + ";" + ";".join(water_level)
        return super(SystemHostSerializer, self).update(instance, validated_data)

class PumpSerializer(serializers.ModelSerializer):
    class Meta:
        model   = Pump
        fields  = ['url', 'id', 'host',
                   'status_level', 'last_maintenance_date']

#data={'id':1,'province':13,'regency':1305,'latitude':1,'longitude':1,'water_level':0,'warning_level':4,'water_level_delimiter_upper':1,'water_level_delimiter_middle':1,'water_level_delimiter_lower':1,'water_level_list':[]}