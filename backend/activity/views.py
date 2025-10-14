from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from django.core.paginator import Paginator
from django.db.models import Q
from .models import Activity
from .serializers import ActivitySerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def activity_list(request):
    """
    Get list of all activities (read-only)
    Only accessible by admin users

    Query Parameters:
    - page: Page number (default: 1)
    - page_size: Number of items per page (default: 20, max: 100)
    - task: Filter by task ID
    - user: Filter by user ID
    - action: Filter by action type
    - search: Search in description
    """
    # Check if user is admin
    if not hasattr(request.user, 'role') or request.user.role != 'admin':
        return Response(
            {'detail': 'Only admin users can view activity logs.'},
            status=status.HTTP_403_FORBIDDEN
        )

    # Get all activities
    activities = Activity.objects.all().select_related(
        'task', 'user').order_by('-timestamp')

    # Apply filters
    task_id = request.query_params.get('task', None)
    if task_id:
        activities = activities.filter(task_id=task_id)

    user_id = request.query_params.get('user', None)
    if user_id:
        activities = activities.filter(user_id=user_id)

    action = request.query_params.get('action', None)
    if action:
        activities = activities.filter(action=action)

    search = request.query_params.get('search', None)
    if search:
        activities = activities.filter(
            Q(description__icontains=search) |
            Q(task__title__icontains=search)
        )

    # Pagination
    page_number = request.query_params.get('page', 1)
    page_size = min(int(request.query_params.get('page_size', 20)), 100)

    paginator = Paginator(activities, page_size)
    page_obj = paginator.get_page(page_number)

    serializer = ActivitySerializer(page_obj, many=True)

    return Response({
        'count': paginator.count,
        'total_pages': paginator.num_pages,
        'current_page': page_obj.number,
        'page_size': page_size,
        'next': page_obj.has_next(),
        'previous': page_obj.has_previous(),
        'results': serializer.data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def activity_detail(request, pk):
    """
    Get a single activity by ID (read-only)
    Only accessible by admin users
    """
    # Check if user is admin
    if not hasattr(request.user, 'role') or request.user.role != 'admin':
        return Response(
            {'detail': 'Only admin users can view activity logs.'},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        activity = Activity.objects.select_related('task', 'user').get(pk=pk)
    except Activity.DoesNotExist:
        return Response(
            {'detail': 'Activity not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = ActivitySerializer(activity)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def task_activity_list(request, task_id):
    """
    Get all activities for a specific task (read-only)
    Accessible by admin and staff users
    """
    # Check if user is admin or staff
    if not hasattr(request.user, 'role') or request.user.role not in ['admin', 'staff']:
        return Response(
            {'detail': 'Only admin and staff users can view activity logs.'},
            status=status.HTTP_403_FORBIDDEN
        )

    activities = Activity.objects.filter(
        Q(task_id=task_id) | Q(changes__task_id=task_id)
    ).select_related('task', 'user').order_by('-timestamp')

    # Pagination
    page_number = request.query_params.get('page', 1)
    page_size = min(int(request.query_params.get('page_size', 20)), 100)

    paginator = Paginator(activities, page_size)
    page_obj = paginator.get_page(page_number)

    serializer = ActivitySerializer(page_obj, many=True)

    return Response({
        'count': paginator.count,
        'total_pages': paginator.num_pages,
        'current_page': page_obj.number,
        'page_size': page_size,
        'next': page_obj.has_next(),
        'previous': page_obj.has_previous(),
        'results': serializer.data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_activity_list(request, user_id):
    """
    Get all activities performed by a specific user (read-only)
    Only accessible by admin users
    """
    # Check if user is admin
    if not hasattr(request.user, 'role') or request.user.role != 'admin':
        return Response(
            {'detail': 'Only admin users can view activity logs.'},
            status=status.HTTP_403_FORBIDDEN
        )

    activities = Activity.objects.filter(
        user_id=user_id
    ).select_related('task', 'user').order_by('-timestamp')

    # Pagination
    page_number = request.query_params.get('page', 1)
    page_size = min(int(request.query_params.get('page_size', 20)), 100)

    paginator = Paginator(activities, page_size)
    page_obj = paginator.get_page(page_number)

    serializer = ActivitySerializer(page_obj, many=True)

    return Response({
        'count': paginator.count,
        'total_pages': paginator.num_pages,
        'current_page': page_obj.number,
        'page_size': page_size,
        'next': page_obj.has_next(),
        'previous': page_obj.has_previous(),
        'results': serializer.data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def activity_stats(request):
    """
    Get activity statistics
    Only accessible by admin users
    """
    # Check if user is admin
    if not hasattr(request.user, 'role') or request.user.role != 'admin':
        return Response(
            {'detail': 'Only admin users can view activity statistics.'},
            status=status.HTTP_403_FORBIDDEN
        )

    from django.db.models import Count

    stats = {
        'total_activities': Activity.objects.count(),
        'by_action': dict(Activity.objects.values('action').annotate(count=Count('id')).values_list('action', 'count')),
        'recent_activities': ActivitySerializer(
            Activity.objects.select_related(
                'task', 'user').order_by('-timestamp')[:10],
            many=True
        ).data
    }

    return Response(stats)
