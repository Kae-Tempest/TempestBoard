from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import UserViewSet, ProjectViewSet, IssueViewSet, RoleViewSet, TagViewSet, LoginView, LogoutView, MyIssueAPIView, ProjectUserAPIView, StateViewSet

app_name = 'core'

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'issues', IssueViewSet, basename='issue')
router.register(r'roles', RoleViewSet, basename='role')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'states', StateViewSet, basename='state')

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('my-issues/', MyIssueAPIView.as_view(), name='my-issues'),
    path('projects/<int:pk>/users/', ProjectUserAPIView.as_view(), name='project-users'),
]

urlpatterns += router.urls
