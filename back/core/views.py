from django.contrib.auth import login, logout
from django.utils import timezone
from markdown2 import Markdown
from rest_framework import viewsets, views, status, generics
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import User, Project, Issue, Role, Tag, State, Comment, Activity, Milestone, ProjectInvitation
from .serializers import RegisterSerializer, ProjectSerializer, IssueSerializer, RoleSerializer, TagSerializer, \
    LoginSerializer, IssueReadSerializer, StateSerializer, CommentSerializer, \
    ActivitySerializer, UserSerializer, MilestoneSerializer, ChangePasswordSerializer, PasswordResetSerializer, \
    ResetPasswordUserSerializer, ProjectInvitationListSerializer, \
    ProjectInvitationSerializer


class RegisterAPIView(views.APIView):
    permission_classes = [AllowAny]

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
        return User.objects.all()


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(users=self.request.user)


class ChangePasswordView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        # Get the target user
        target_user = get_object_or_404(User.objects.all(), pk=pk)

        # Check if the requesting user has permission to change this password
        if request.user.pk != target_user.pk:
            return Response(
                {"detail": "You don't have permission to change this user's password."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request, 'user': target_user}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Password changed successfully"},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProjectUserAPIView(views.APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk, user):
        project = Project.objects.get(pk=pk)
        user = User.objects.get(pk=user)
        project.users.remove(user)
        project.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProjectUsersAPIView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        project = Project.objects.get(pk=pk)
        serializer = UserSerializer(project.users, many=True, context={'request': request})
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


class ProjectActiveIssueAPIView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        createdIssues = Issue.objects.filter(project=pk)
        assignedIssues = Issue.objects.filter(project=pk)
        serializer = IssueReadSerializer(createdIssues.union(assignedIssues), many=True)

        # Filter out unwanted statuses
        filtered_data = [
            issue for issue in serializer.data
            if issue['status'] not in ['backlog', 'canceled', 'completed']
        ]

        # Process markdown for descriptions
        for issue in filtered_data:
            issue['description'] = Markdown(
                safe_mode="escape",
                extras={
                    "breaks": {"on_newline": True},
                },
            ).convert(issue['description'])

        return Response(filtered_data)


class ProjectBacklogIssueAPIView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        # Filter out unwanted statuses at the queryset level
        active_statuses = ['backlog']  # Add whatever statuses you want to keep
        createdIssues = Issue.objects.filter(
            project=pk,
            status__in=active_statuses
        )
        assignedIssues = Issue.objects.filter(
            project=pk,
            status__in=active_statuses
        )

        issues = createdIssues.union(assignedIssues)
        serializer = IssueReadSerializer(issues, many=True)

        # Process markdown for descriptions
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


class MilestoneViewSet(viewsets.ModelViewSet):
    queryset = Milestone.objects.all()
    serializer_class = MilestoneSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = MilestoneSerializer(data=request.data)
        print(serializer)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(serializer.data, status.HTTP_201_CREATED)


class MilestoneProjectAPIView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        milestone = Milestone.objects.filter(project=pk)
        serializer = MilestoneSerializer(milestone, many=True)
        return Response(serializer.data)


class MilestoneAdvancementAPIView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk, milestone):
        backlog_issue = Issue.objects.filter(project=pk, milestone=milestone, status__in=['backlog']).count()
        active_issue = Issue.objects.filter(project=pk, milestone=milestone).exclude(status__in=['backlog', 'completed', 'canceled']).count()
        completed_issue = Issue.objects.filter(project=pk, milestone=milestone, status__in=['completed']).count()

        return Response({
            'backlog_issues': backlog_issue,
            'active_issues': active_issue,
            'completed_issues': completed_issue
        }, status=status.HTTP_200_OK)


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
        connected_user = UserSerializer(user, context={"request": request})
        return Response(connected_user.data, status=status.HTTP_202_ACCEPTED)


class LogoutView(views.APIView):
    def get(self, request):
        logout(request)
        return Response({}, status=status.HTTP_202_ACCEPTED)


class UserProjectAPIView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        projects = Project.objects.filter(creator=pk)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)


class PasswordResetView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            # Always return the same message whether the email exists or not
            return Response(
                {"detail": "If an account exists with this email address, you will receive a password reset link shortly."},
                status=status.HTTP_200_OK
            )
        return Response(
            {"detail": "Please provide a valid email address."},
            status=status.HTTP_400_BAD_REQUEST
        )


class ResetPasswordPageView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"detail": "Password Successfully updated !"},
                status=status.HTTP_200_OK
            )
        return Response(
            {"detail": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )


class ProjectInvitationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectInvitationListSerializer
        return ProjectInvitationSerializer

    def get_queryset(self):
        # Filter invitations by project_id if provided
        project_id = self.request.query_params.get('project_id')
        queryset = ProjectInvitation.objects.all()
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset

    @action(detail=False, methods=['post'])
    def resend(self, request):
        """Resend invitation email"""
        invitation_id = request.data.get('invitation_id')
        invitation = get_object_or_404(ProjectInvitation, id=invitation_id)

        # Reuse create logic from serializer to resend email
        serializer = self.get_serializer(data={
            'email': invitation.email,
            'project_id': invitation.project_id
        })
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({'message': 'Invitation resent successfully'})


class AcceptInvitationView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = request.data.get('token')
        if not token:
            raise ValidationError('Token is required')

        invitation = get_object_or_404(
            ProjectInvitation,
            token=token,
            accepted_at__isnull=True
        )

        # Add user to project
        project = Project.objects.get(id=invitation.project_id)
        project.users.add(request.user)

        # Mark invitation as accepted
        invitation.accepted_at = timezone.now()
        invitation.save()

        return Response({
            'message': 'Successfully joined project',
            'project_id': project.id
        })
