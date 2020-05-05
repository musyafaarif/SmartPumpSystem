from django.db import models
from location import models as location

# Create your models here.
class SystemHost(models.Model):
    # Owner auth
    owner = models.ForeignKey('auth.User', related_name='hosts', on_delete=models.PROTECT)

    # Registered Date and Time
    est_date    = models.DateTimeField(auto_now_add=True)

    # System Host Connections
    next_host   = models.ForeignKey('self', models.SET_NULL, blank=True, null=True, related_name='next')
    prev_host   = models.ForeignKey('self', models.SET_NULL, blank=True, null=True, related_name='prev')

    # Location
    province    = models.ForeignKey(location.Province,  models.PROTECT)                             # Provinsi
    regency     = models.ForeignKey(location.Regency,   models.PROTECT)                             # Kota
    district    = models.ForeignKey(location.District,  models.SET_NULL,    null=True)              # Kecamatan
    village     = models.ForeignKey(location.Village,   models.SET_NULL,    null=True)              # Kelurahan / Desa
    latitude    = models.DecimalField(max_digits=10,    decimal_places=7)                           # Cannot Null, default to Indonesia
    longitude   = models.DecimalField(max_digits=10,    decimal_places=7)                           # Cannot Null, default to Indonesia

    # System Host Water Level Condition, measured in Metres
    water_level                     = models.DecimalField(decimal_places=4, max_digits=6, default=0.0)  # Current Water Level
    water_levels                    = models.CharField(max_length=350, default="")

    water_level_delimiter_upper     = models.DecimalField(decimal_places=4, max_digits=6)  # Delimiter for Siaga 1 ( above )
    water_level_delimiter_middle    = models.DecimalField(decimal_places=4, max_digits=6)  # Delimiter for Siaga 2 ( above )
    water_level_delimiter_lower     = models.DecimalField(decimal_places=4, max_digits=6)  # Delimiter for Siaga 3 ( above ), Siaga 4 ( under )

    # Warning Level
    class WarningLevel(models.IntegerChoices):
        SIAGA_1     = 1     # Highest Warning
        SIAGA_2     = 2
        SIAGA_3     = 3
        SIAGA_4     = 4     # Lowest Warning
    warning_level   = models.IntegerField(choices=WarningLevel.choices, default=WarningLevel.SIAGA_4)     # Default to lowest warning

    def __str__(self):
        # Return the name from location
        return '%s_%s_%s_%s' % (self.province, self.regency, self.district, self.village)

    def save(self, *args, **kwargs):
        # Calculate Warning Level
        if self.water_level > self.water_level_delimiter_upper:
            self.warning_level = self.WarningLevel.SIAGA_1
        elif self.water_level > self.water_level_delimiter_middle:
            self.warning_level = self.WarningLevel.SIAGA_2
        elif self.water_level > self.water_level_delimiter_lower:
            self.warning_level = self.WarningLevel.SIAGA_3
        else:
            self.warning_level = self.WarningLevel.SIAGA_4

        # Save
        super(SystemHost, self).save(*args, **kwargs)

class Pump(models.Model):
    # Host / Owner of the pump
    host        = models.ForeignKey(SystemHost, models.CASCADE, related_name='pumps')     # Cascade, delete when Host deleted
    # Established Date / Tanggal pemasangan pompa
    est_date    = models.DateTimeField(auto_now_add=True)
    # Last Maintenance Date / Tanggal perbaikan terakhir
    last_maintenance_date = models.DateTimeField()

    # Status Level, semakin tinggi maka prioritas semakin tinggi
    class StatusLevel(models.IntegerChoices):
        OFF         = 1 # Mati
        TURNING_OFF = 2
        TURNING_ON  = 3
        ON          = 4 # Menyala
        MAINTENANCE = 5 # Dalam perbaikan
        BROKEN      = 6 # Rusak dan perlu perbaikan
        FAILURE     = 7 # Sistem gagal ( saat menyala / perlu menyala )
    status_level = models.IntegerField(choices=StatusLevel.choices, default=StatusLevel.OFF)

    def __str__(self):
        return str(self.host) + '_' + str(id % 101)
