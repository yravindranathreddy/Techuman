from django.db import models

# Create your models here.
# models.py

from django.db import models

class UserLogin(models.Model):
    login_time = models.DateTimeField(auto_now_add=True)
    user_ip = models.GenericIPAddressField()

