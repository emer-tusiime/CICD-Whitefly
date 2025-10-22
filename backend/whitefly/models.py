from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Image(models.Model): 
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    name = models.CharField(max_length=524, blank=True)
    images = models.FileField(upload_to='whitefly_uploads/')
    upload_date = models.DateTimeField(auto_now_add=True, null=True) 
    last_modified = models.DateTimeField(auto_now=True, null=True) 

class Result(models.Model):
    image = models.ForeignKey(Image, on_delete=models.CASCADE) 
    annotated_coordinates = models.JSONField()  # Store annotated coordinates as a JSON field  
    upload_date = models.DateTimeField(auto_now_add=True, null=True) 
    last_modified = models.DateTimeField(auto_now=True, null=True) 