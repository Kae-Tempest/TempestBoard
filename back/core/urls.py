from django.urls import path, re_path
from rest_framework.routers import DefaultRouter

from .consumers import PresenceConsumer, ActivityConsumer
from .views import UserViewSet, ProjectViewSet, IssueViewSet, RoleViewSet, TagViewSet, LoginView, LogoutView, MyIssueAPIView, ProjectUserAPIView, StateViewSet, ProjectStateViewSet, \
    CommentIssueAPIView, CommentViewSet

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
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('my-issues/', MyIssueAPIView.as_view(), name='my-issues'),
    path('projects/<int:pk>/users/', ProjectUserAPIView.as_view(), name='project-users'),
    path('project/<int:pk>/states/', ProjectStateViewSet.as_view(), name='project-states'),
    path('issues/<int:pk>/comments/', CommentIssueAPIView.as_view(), name='issue-comments'),

]

websocket_urlpatterns = [
    re_path(r'ws/presence/', PresenceConsumer.as_asgi(), name='ws-presence'),
    path('ws/activity/', ActivityConsumer.as_asgi(), name='ws-activity'),
]

urlpatterns += router.urls
