from django.contrib.auth import login, logout
from markdown2 import Markdown
from rest_framework import viewsets, views, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import User, Project, Issue, Role, Tag, State, Comment, Activity
from .serializers import RegisterSerializer, ProjectSerializer, IssueSerializer, RoleSerializer, TagSerializer, LoginSerializer, IssueReadSerializer, StateSerializer, CommentSerializer, \
    ActivitySerializer, UserSerializer


class RegisterAPIView(views.APIView):

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            login(request, serializer.instance)
        return Response(serializer.data, status.HTTP_201_CREATED)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(pk=self.request.user.pk)


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
        serializer = IssueSerializer(data=request.data)
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
        serializer = IssueReadSerializer(createdIssues.union(assignedIssues), many=True)
        for issue in serializer.data:
            issue['description'] = Markdown(
                safe_mode="escape",
                extras={
                    "breaks": {"on_newline": True},
                },
            ).convert(issue['description'])

        return Response(serializer.data)


class StateViewSet(viewsets.ModelViewSet):
    queryset = State.objects.all()
    serializer_class = StateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = StateSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(serializer.data, status.HTTP_201_CREATED)

class ProjectStateViewSet(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        states = State.objects.filter(project=pk)
        serializer = StateSerializer(states, many=True)
        return Response(serializer.data)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(serializer.data, status.HTTP_201_CREATED)

class CommentIssueAPIView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        comments = Comment.objects.filter(issue=pk)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

class ActivityAPIView(views.APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        activities = Activity.objects.filter(issue=pk)
        serializer = ActivitySerializer(activities, many=True)
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
        user = serializer.validated_data.get('user')
        login(request, user)
        connected_user = UserSerializer(user)
        return Response(connected_user.data, status=status.HTTP_202_ACCEPTED)


class LogoutView(views.APIView):
    def get(self, request):
        logout(request)
        return Response(status=status.HTTP_202_ACCEPTED)
