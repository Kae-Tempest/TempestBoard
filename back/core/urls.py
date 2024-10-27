from django.urls import path, re_path
from rest_framework.routers import DefaultRouter

from .consumers import PresenceConsumer, ActivityConsumer
from .views import RegisterAPIView, ProjectViewSet, IssueViewSet, RoleViewSet, TagViewSet, LoginView, LogoutView, MyIssueAPIView, ProjectUserAPIView, StateViewSet, ProjectStateViewSet, \
    CommentIssueAPIView, CommentViewSet, ActivityAPIView, UserViewSet, ProjectActiveIssueAPIView, ProjectBacklogIssueAPIView

app_name = 'core'

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'issues', IssueViewSet, basename='issue')
router.register(r'roles', RoleViewSet, basename='role')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'states', StateViewSet, basename='state')
router.register(r'comments', CommentViewSet, basename='comment')

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('my-issues/', MyIssueAPIView.as_view(), name='my-issues'),
    path('projects/<int:pk>/users/', ProjectUserAPIView.as_view(), name='project-users'),
    path('projects/<int:pk>/states/', ProjectStateViewSet.as_view(), name='project-states'),
    path('projects/<int:pk>/active-issues/', ProjectActiveIssueAPIView.as_view(), name='project-active-issues'),
    path('projects/<int:pk>/backlog-issues/', ProjectBacklogIssueAPIView.as_view(), name='project-backlog-issues'),
    path('issues/<int:pk>/comments/', CommentIssueAPIView.as_view(), name='issue-comments'),
    path('issues/<int:pk>/activities/', ActivityAPIView.as_view(), name='issue-activity'),
]

websocket_urlpatterns = [
    re_path(r'ws/presence/', PresenceConsumer.as_asgi(), name='ws-presence'),
    re_path(r'ws/activity/', ActivityConsumer.as_asgi(), name='ws-activity'),
]

urlpatterns += router.urls
