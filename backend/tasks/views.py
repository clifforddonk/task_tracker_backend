from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import TaskSerializer
from .models import Task
from users.permissions import IsAdmin, IsStaffUser
from rest_framework.permissions import IsAuthenticated

# Create your views here.

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def task_list(request):
    if request.method == 'GET':
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True, context={'request': request})
        return Response(serializer.data)

@api_view(['GET', 'PUT', 'DELETE', 'POST'])
@permission_classes([IsAuthenticated])
def task_detail(request, pk):
    task = get_object_or_404(Task, pk=pk)
    is_admin = request.user.role == 'admin'
    is_staff = request.user.role == 'staff'
    
    if not(is_admin or is_staff):
        return Response({'detail': 'You do not have permission to perform this action.'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        serializer = TaskSerializer(task, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PUT' :
        if is_staff and not is_admin:
            allowed_fields = {'status'}
            provided_fields = set(request.data.keys())
            
            if not provided_fields.issubset(allowed_fields):
                return Response({'detail': 'Staff users can only update the status field.'}, status=status.HTTP_403_FORBIDDEN)

            serializer = TaskSerializer(task, data=request.data, partial=True, context={'request': request})
        else :
            serializer = TaskSerializer(task, data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'POST' and is_admin:
        serializer = TaskSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE' and is_admin:
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
