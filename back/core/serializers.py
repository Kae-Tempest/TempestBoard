from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import User, Project, Issue, Role, Tag, State, Comment, Activity


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['id', 'password', 'confirm_password', 'username', 'email', 'first_name', 'last_name', 'thumbnail', 'created_at', 'updated_at']

    def create(self, validated_data):
        password = validated_data.pop('password')
        confirm_password = validated_data.pop('confirm_password')
        email = validated_data.pop('email')
        if password != confirm_password:
            raise serializers.ValidationError("Password and Confirm Password does not match")
        User.objects.create_user(email, password, **validated_data)
        authenticated_user = authenticate(email=email, password=password)
        return authenticated_user


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'creator', 'users', 'name', 'description', 'status', 'thumbnail', 'created_at', 'updated_at']
        extra_kwargs = {'thumbnail': {'required': False}}

    def create(self, validated_data):
        project = Project.objects.create(
            creator=validated_data['creator'],
            name=validated_data['name'],
            description=validated_data['description'],
            status=validated_data['status'],
            thumbnail=validated_data.get('thumbnail')
        )
        project.users.add(validated_data['creator'])
        return project

class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = ['id', 'creator', 'assigned', 'ticket_id', 'project', 'project_tag', 'title', 'description', 'priority', 'status', 'milestone', 'attachment' ,'created_at', 'updated_at']
        extra_kwargs = {'ticket_id': {'read_only': True}, 'project_tag': { 'read_only': True }, 'attachment': {'required': False}, 'milestone': {'required': False}}

    def validate(self, attrs):
        attrs.pop('ticket_id', None)
        attrs.pop('project_tag', None)
        return super().validate(attrs)

    def create(self, validated_data):
        project = validated_data['project']
        issue_count = Issue.objects.filter(project=validated_data['project']).count()
        last_issue = Issue.objects.filter(project=validated_data['project']).last()
        if issue_count == 0:
            issue_count = 1
        else:
            issue_count = last_issue.ticket_id + 1
        project_tag = project.name[:3].upper()
        issue = Issue.objects.create(
            creator=validated_data['creator'],
            assigned=validated_data['assigned'],
            project=project,
            project_tag=project_tag,
            ticket_id=issue_count,
            title=validated_data['title'],
            description=validated_data['description'],
            priority=validated_data['priority'],
            status=validated_data['status'],
            milestone=validated_data.get('milestone'),
            attachment=validated_data.get('attachment')
        )
        # log Activity -> create issue
        return issue

class IssueReadSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    assigned = UserSerializer(read_only=True)
    class Meta:
        model = Issue
        fields = ['id', 'creator', 'assigned', 'ticket_id', 'project', 'project_tag' ,'title', 'description', 'priority', 'status', 'created_at', 'updated_at']
        extra_kwargs = {'ticket_id': {'read_only': True}}

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = ['id', 'name', 'project', 'is_default'  , 'created_at', 'updated_at']
        extra_kwargs = {'is_default': {'required': False}}

    def create(self, validated_data):
        state = State.objects.create(
            name=validated_data['name'],
            project=validated_data['project'],
            is_default=validated_data.get('is_default', False)
        )
        return state


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name', 'project', 'users', 'created_at', 'updated_at']


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'project', 'created_at', 'updated_at']


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(label="Email", required=True, write_only=True)
    password = serializers.CharField(style={'input_type': 'password'}, label="Password", write_only=True, required=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        user = authenticate(email=email, password=password)
        if not user:
            raise serializers.ValidationError("Invalid Credentials")
        return user

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'issue', 'user', 'content', 'is_answer', 'comment_parent', 'is_thread', 'is_resolved', 'attachment', 'created_at', 'updated_at']
        extra_kwargs = {'attachment': {'required': False}, 'comment_parent': {'required': False}}

        def create(self, validated_data):
            comment = Comment.objects.create(
                issue=validated_data['issue'],
                user=validated_data['user'],
                content=validated_data['content'],
                is_answer=validated_data['is_answer'],
                comment_parent=validated_data.get('comment_parent'),
                is_thread=validated_data['is_thread'],
                is_resolved=validated_data['is_resolved'],
                attachment=validated_data.get('attachment')
            )
            # log activity on issue
            return comment

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'issue', 'content', 'user', 'created_at', 'updated_at']

        def create(self, validated_data):
            activity = Activity.objects.create(
                type=validated_data['type'],
                issue=validated_data['issue'],
                content=validated_data['content'],
                user=validated_data['user'],
            )
            return activity
