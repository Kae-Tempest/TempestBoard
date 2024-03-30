from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import UserViewSet, ProjectViewSet, IssueViewSet, RoleViewSet, TagViewSet, LoginView, LogoutView

app_name = 'core'

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'issues', IssueViewSet, basename='issue')
router.register(r'roles', RoleViewSet, basename='role')
router.register(r'tags', TagViewSet, basename='tag')

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
]

urlpatterns += router.urls
