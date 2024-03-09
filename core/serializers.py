from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Project, Issue, Role, Tag


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'thumbnail', 'created_at', 'updated_at']


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'creator', 'users', 'name', 'description', 'status', 'thumbnail', 'created_at', 'updated_at']


class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = ['id', 'creator', 'assigned', 'project', 'ticket_id', 'title', 'description', 'priority', 'status',
                  'tags', 'created_at', 'updated_at']

    def create(self, validated_data):
        issue_count = Issue.objects.filter(project=validated_data['project']).count()
        if issue_count == 0:
            issue_count = 1
        else:
            issue_count = issue_count + 1
        issue = Issue.objects.create(
            creator=validated_data['creator'],
            assigned=validated_data['assigned'],
            project=validated_data['project'],
            ticket_id=issue_count,
            title=validated_data['title'],
            description=validated_data['description'],
            priority=validated_data['priority'],
            status=validated_data['status'],
            tags=validated_data['tags']
        )
        return issue


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
    password = serializers.CharField(style={'input_type': 'password'}, label="Password", write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        if email and password:
            user = authenticate(request=self.context.get('request'), email=email, password=password)
            if not user:
                msg = 'Unable to log in with provided credentials'
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'Must provide email and password both'
            raise serializers.ValidationError(msg)
        attrs['user'] = user
        return attrs
