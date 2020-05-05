# Generated by Django 3.0.5 on 2020-05-05 13:59

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('location', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SystemHost',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('est_date', models.DateTimeField(auto_now_add=True)),
                ('latitude', models.DecimalField(decimal_places=7, max_digits=10)),
                ('longitude', models.DecimalField(decimal_places=7, max_digits=10)),
                ('water_level', models.DecimalField(decimal_places=4, default=0.0, max_digits=6)),
                ('water_levels', models.CharField(default='', max_length=350)),
                ('water_level_delimiter_upper', models.DecimalField(decimal_places=4, max_digits=6)),
                ('water_level_delimiter_middle', models.DecimalField(decimal_places=4, max_digits=6)),
                ('water_level_delimiter_lower', models.DecimalField(decimal_places=4, max_digits=6)),
                ('warning_level', models.IntegerField(choices=[(1, 'Siaga 1'), (2, 'Siaga 2'), (3, 'Siaga 3'), (4, 'Siaga 4')], default=4)),
                ('district', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='location.District')),
                ('next_host', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='next', to='system.SystemHost')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='hosts', to=settings.AUTH_USER_MODEL)),
                ('prev_host', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='prev', to='system.SystemHost')),
                ('province', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='location.Province')),
                ('regency', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='location.Regency')),
                ('village', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='location.Village')),
            ],
        ),
        migrations.CreateModel(
            name='Pump',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('est_date', models.DateTimeField(auto_now_add=True)),
                ('last_maintenance_date', models.DateTimeField()),
                ('status_level', models.IntegerField(choices=[(1, 'Off'), (2, 'Turning Off'), (3, 'Turning On'), (4, 'On'), (5, 'Maintenance'), (6, 'Broken'), (7, 'Failure')], default=1)),
                ('host', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pumps', to='system.SystemHost')),
            ],
        ),
    ]