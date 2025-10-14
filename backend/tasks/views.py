from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import TaskSerializer
from .models import Task
from rest_framework.permissions import IsAuthenticated


# ==================== LIST ALL TASKS ====================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def task_list(request):
    """
    List all tasks
    - Admin: sees all tasks
    - Staff: sees only tasks assigned to them
    """
    if request.user.role == 'admin':
        tasks = Task.objects.all()
    else:  # staff
        tasks = Task.objects.filter(assigned_user=request.user)
    
    serializer = TaskSerializer(tasks, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


# ==================== CREATE TASK ====================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_task(request):
    """
    Create a new task (Admin only)
    """
    if request.user.role != 'admin':
        return Response(
            {'detail': 'Only admin users can create tasks.'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = TaskSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==================== GET SINGLE TASK ====================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def task_detail(request, pk):
    """
    Get details of a single task
    - Admin: can view any task
    - Staff: can only view tasks assigned to them
    """
    task = get_object_or_404(Task, pk=pk)
    
    is_admin = request.user.role == 'admin'
    is_assigned_staff = request.user.role == 'staff' and task.assigned_user == request.user
    
    if not is_admin and not is_assigned_staff:
        return Response(
            {'detail': 'You do not have permission to view this task.'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = TaskSerializer(task, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


# ==================== UPDATE TASK STATUS ====================
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_task_status(request, pk):
    """
    Update only the status of a task
    - Admin: can update any task status
    - Staff: can update status of tasks assigned to them
    """
    task = get_object_or_404(Task, pk=pk)
    
    is_admin = request.user.role == 'admin'
    is_assigned_staff = request.user.role == 'staff' and task.assigned_user == request.user
    
    if not is_admin and not is_assigned_staff:
        return Response(
            {'detail': 'You do not have permission to update this task.'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Only allow status field
    if 'status' not in request.data:
        return Response(
            {'detail': 'Status field is required.'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    allowed_statuses = ['pending', 'in_progress', 'completed']
    if request.data['status'] not in allowed_statuses:
        return Response(
            {'detail': f'Invalid status. Must be one of: {", ".join(allowed_statuses)}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    task.status = request.data['status']
    task.save()
    
    serializer = TaskSerializer(task, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


# ==================== EDIT FULL TASK ====================
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def edit_task(request, pk):
    """
    Edit/Update a task (Admin only)
    - PUT: Full update (all fields required)
    - PATCH: Partial update (only provided fields)
    """
    task = get_object_or_404(Task, pk=pk)
    
    if request.user.role != 'admin':
        return Response(
            {'detail': 'Only admin users can edit tasks.'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    partial = request.method == 'PATCH'
    serializer = TaskSerializer(task, data=request.data, partial=partial, context={'request': request})
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==================== DELETE TASK ====================
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_task(request, pk):
    """
    Delete a task (Admin only)
    """
    task = get_object_or_404(Task, pk=pk)
    
    if request.user.role != 'admin':
        return Response(
            {'detail': 'Only admin users can delete tasks.'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    task.delete()
    return Response(
        {'detail': 'Task deleted successfully.'}, 
        status=status.HTTP_204_NO_CONTENT
    )