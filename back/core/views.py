from django.contrib.auth import login, logout
from rest_framework import viewsets, views, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import User, Project, Issue, Role, Tag
from .serializers import UserSerializer, ProjectSerializer, IssueSerializer, RoleSerializer, TagSerializer, LoginSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        print('create user')
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            login(request, serializer.instance)
        return Response(serializer.data, status.HTTP_201_CREATED)


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(users=self.request.user)


class ProjectUserAPIView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        project = Project.objects.get(pk=pk)
        serializer = UserSerializer(project.users, many=True)
        return Response(serializer.data)

    def post(self, request, pk):
        project = Project.objects.get(pk=pk)
        for user_id in request.data['users']:
            user = User.objects.get(pk=user_id)
            project.users.add(user)
            project.save()
        serializer = UserSerializer(project.users, many=True)
        return Response(serializer.data)


class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = IssueSerializer(data=request.data, )
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(serializer.data, status.HTTP_201_CREATED)

    def get_queryset(self):
        return Issue.objects.filter(project__creator_id=self.request.user)


class MyIssueAPIView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        createdIssues = Issue.objects.filter(creator_id=request.user)
        assignedIssues = Issue.objects.filter(assigned_id=request.user)
        serializer = IssueSerializer(createdIssues.union(assignedIssues), many=True)
        return Response(serializer.data)


class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]


class LoginView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validate(request.data)
        login(request, user)
        user_serializer = UserSerializer(user, context={"request": request})
        return Response(user_serializer.data, status=status.HTTP_202_ACCEPTED)


class LogoutView(views.APIView):
    def get(self, request):
        logout(request)
        return Response(status=status.HTTP_202_ACCEPTED)
