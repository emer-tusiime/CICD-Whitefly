from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import Image, Result
from .serializers import (
    UserSerializer, SignUpSerializer, ImageSerializer, 
    ResultSerializer, UploadResponseSerializer
)
from .utilities import post_image, draw_annotations, save_img, save_results
import os
import time
from os.path import basename


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
csv_dir = os.path.normpath(BASE_DIR + "/media/csv/results.csv")


@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def get_csrf_token(request):
    """Get CSRF token"""
    return Response({'detail': 'CSRF cookie set'})


@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    """Register a new user"""
    serializer = SignUpSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # Auto-login after signup
        login(request, user)
        return Response({
            'user': UserSerializer(user).data,
            'message': 'User created successfully'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Login user"""
    from django.contrib.auth import authenticate
    
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'error': 'Please provide both username and password'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)
    
    if user is not None:
        login(request, user)
        return Response({
            'user': UserSerializer(user).data,
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)
    
    return Response({
        'error': 'Invalid credentials'
    }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout user"""
    logout(request)
    return Response({
        'message': 'Logout successful'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    """Get current logged in user"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_images_view(request):
    """Upload and process images for whitefly detection"""
    if request.method != 'POST':
        return Response({
            'error': 'Invalid request method'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    images = request.FILES.getlist('images')
    
    if not images:
        return Response({
            'error': 'No images provided'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Ensure media directories exist
    results_dir = os.path.join(BASE_DIR, 'media', 'whitefly_results')
    csv_dir_path = os.path.join(BASE_DIR, 'media', 'csv')
    os.makedirs(results_dir, exist_ok=True)
    os.makedirs(csv_dir_path, exist_ok=True)
    
    results = []
    current_user = request.user
    
    for f in images:
        try:
            # Extract filename
            filename = basename(f.name)
            
            # Read image data FIRST (before saving to database)
            f.seek(0)  # Ensure we're at the start of the file
            bin_data = f.read()
            
            # Reset file pointer for database save
            f.seek(0)
            
            # Save image to database
            instance = Image(images=f, user=current_user, name=filename)
            instance.save()
            
            # Send to detection API
            try:
                dets = post_image([("files", (f.name, bin_data))])
            except Exception as api_error:
                return Response({
                    'error': f'Detection API connection failed: {str(api_error)}. Make sure the detection server is running on localhost:5000'
                }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            
            if not dets or dets == "Failed to fetch results":
                return Response({
                    'error': f'Detection API failed for {filename}. Make sure the detection server is running on localhost:5000'
                }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            
            # Path to save annotated image
            f_path = os.path.normpath(
                BASE_DIR + "/media/whitefly_results/" + os.path.basename(instance.images.url)
            )
            
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(f_path), exist_ok=True)
            
            # Draw annotations and save
            annotated_img = draw_annotations(bin_data, dets[0]['result'])
            save_img(annotated_img, f_path)
            
            # Save results to CSV
            save_results(f.name, len(dets[0]['result']), csv_dir)
            
            # Save results to database
            results_instance = Result(
                image=instance, 
                annotated_coordinates=dets[0]['result']
            )
            results_instance.save()
            
            # Prepare response data
            results.append({
                'image_id': instance.id,
                'result_id': results_instance.id,
                'image_name': filename,
                'whitefly_count': len(dets[0]['result']),
                'annotated_image_url': f'/media/whitefly_results/{os.path.basename(instance.images.url)}',
                'original_image_url': instance.images.url
            })
            
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(f"Error processing {filename}: {error_details}")
            return Response({
                'error': f'Error processing {filename}: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({
        'message': f'Successfully processed {len(results)} image(s)',
        'results': results
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_images_view(request):
    """Get all images uploaded by current user"""
    images = Image.objects.filter(user=request.user).order_by('-upload_date')
    serializer = ImageSerializer(images, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_results_view(request):
    """Get all detection results for current user"""
    results = Result.objects.filter(
        image__user=request.user
    ).order_by('-upload_date')
    serializer = ResultSerializer(results, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_result_detail_view(request, result_id):
    """Get specific result details"""
    try:
        result = Result.objects.get(id=result_id, image__user=request.user)
        serializer = ResultSerializer(result)
        return Response(serializer.data)
    except Result.DoesNotExist:
        return Response({
            'error': 'Result not found'
        }, status=status.HTTP_404_NOT_FOUND)
