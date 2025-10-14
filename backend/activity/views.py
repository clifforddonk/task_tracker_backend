# activities/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Activity
from .serializers import ActivitySerializer


class ActivityViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Admin sees all activity logs
        if user.role == 'admin':
            return Activity.objects.all().order_by('-timestamp')

        # Staff sees only logs for tasks assigned to them
        return Activity.objects.filter(
            Q(task__assigned_user=user) | Q(user=user)
        ).order_by('-timestamp')

    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent activity logs (last 50)"""
        queryset = self.get_queryset()[:50]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_task(self, request):
        """Get activity logs filtered by task_id"""
        task_id = request.query_params.get('task_id')
        if not task_id:
            return Response(
                {'error': 'task_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        queryset = self.get_queryset().filter(task_id=task_id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
