from django.db import models

# Create your models here.
class Province(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Regency(models.Model):
    id = models.AutoField(primary_key=True)
    province = models.ForeignKey(Province, models.PROTECT)

    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class District(models.Model):
    id = models.AutoField(primary_key=True)
    regency = models.ForeignKey(Regency, models.PROTECT)

    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Village(models.Model):
    id = models.BigAutoField(primary_key=True)
    district = models.ForeignKey(District, models.PROTECT)

    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
