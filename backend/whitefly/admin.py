

# Register your models here.
#admin.site.register(Image)


from django.contrib import admin
from .models import Image, Result

@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'images', 'user', 'upload_date','last_modified')  # Add 'id' to display the ID in the admin panel

@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = ('id', 'image', 'annotated_coordinates', 'upload_date', 'last_modified')  # Add 'id' to display the ID in the admin panel

