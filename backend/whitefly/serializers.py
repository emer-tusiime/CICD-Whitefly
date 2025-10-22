from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Image, Result


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


class ImageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Image
        fields = ['id', 'name', 'images', 'user', 'upload_date', 'last_modified']
        read_only_fields = ['user', 'upload_date', 'last_modified']


class ResultSerializer(serializers.ModelSerializer):
    image = ImageSerializer(read_only=True)
    whitefly_count = serializers.SerializerMethodField()

    class Meta:
        model = Result
        fields = ['id', 'image', 'annotated_coordinates', 'whitefly_count', 'upload_date', 'last_modified']
        read_only_fields = ['upload_date', 'last_modified']

    def get_whitefly_count(self, obj):
        return len(obj.annotated_coordinates) if obj.annotated_coordinates else 0


class UploadResponseSerializer(serializers.Serializer):
    image_id = serializers.IntegerField()
    result_id = serializers.IntegerField()
    image_name = serializers.CharField()
    whitefly_count = serializers.IntegerField()
    annotated_image_url = serializers.CharField()
    original_image_url = serializers.CharField()
