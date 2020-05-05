from django.db import models
import ast

class NumberListField(models.IntegerField):
    description = "Stores a python list"

    def __init__(self, *args, **kwargs):
        super(NumberListField, self).__init__(*args, **kwargs)

    def db_type(self, connection):
        return 'NumberListField'
        
    def from_db_value(self, value, expression, connection):
        if value is None:
            return None

        return value.split("_")

    def to_python(self, value):
        if isinstance(value, NumberListField):
            return value

        if value is None:
            return value

        return value.split("_")

    def get_prep_value(self, value):
        return "_".join(value)

    def value_to_string(self, obj):
        value = self.value_from_object(obj)
        return self.get_prep_value(value)
