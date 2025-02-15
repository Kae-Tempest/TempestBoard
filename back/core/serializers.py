import uuid

from django.conf import settings
from django.contrib.auth import authenticate, update_session_auth_hash
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.urls import reverse, NoReverseMatch
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework import serializers

from .models import User, Project, Issue, Role, Tag, State, Comment, Activity, Milestone, ProjectInvitation


class RegisterSerializer(serializers.ModelSerializer):
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


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    new_password_confirm = serializers.CharField(required=True, write_only=True)

    def validate_old_password(self, value):
        user = self.context['user']  # Changed to get user from context
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value

    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': "The new passwords don't match."
            })

        if data['old_password'] == data['new_password']:
            raise serializers.ValidationError({
                'new_password': "New password cannot be the same as old password."
            })

        return data

    def save(self, **kwargs):
        user = self.context['user']  # Changed to get user from context
        user.set_password(self.validated_data['new_password'])
        user.save()

        # Update session to keep user logged in
        request = self.context.get('request')
        if request:
            update_session_auth_hash(request, user)

        return user


class UserSerializer(serializers.ModelSerializer):
    thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'thumbnail', 'created_at', 'updated_at']
        extra_kwargs = {'thumbnail': {'required': False}}

    def get_thumbnail(self, obj):
        request = self.context.get('request')
        if obj.thumbnail != "":
            return request.build_absolute_uri(obj.thumbnail.url)
        else:
            return ""

    def update(self, instance, validated_data):
        if 'thumbnail' in self.context['request'].FILES:
            instance.thumbnail = self.context['request'].FILES['thumbnail']

        instance.first_name = validated_data['first_name']
        instance.last_name = validated_data['last_name']
        instance.username = validated_data['username']

        instance.save()
        return instance



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

    def update(self, instance, validated_data):
        # Get the original project by ID first
        original_project = Project.objects.get(id=instance.id)

        # Remove any existing numbering from the original name
        base_name = original_project.name
        if '(' in base_name and base_name.endswith(')'):
            base_name = base_name[:base_name.rfind('(')].strip()

        # First try with base name
        exact_name_exists = Project.objects.filter(
            creator=original_project.creator,
            name=base_name
        ).exclude(id=instance.id).exists()

        if exact_name_exists:
            # Then try with (1)
            name_with_one = f"{base_name} (1)"
            name_with_one_exists = Project.objects.filter(
                creator=validated_data['creator'],
                name=name_with_one
            ).exclude(id=instance.id).exists()

            if not name_with_one_exists:
                validated_data['name'] = name_with_one
            else:
                # If even (1) exists, find next available number
                counter = 2
                while True:
                    new_name = f"{base_name} ({counter})"
                    if not Project.objects.filter(
                            creator=validated_data['creator'],
                            name=new_name
                    ).exclude(id=instance.id).exists():
                        validated_data['name'] = new_name
                        break
                    counter += 1
        else:
            validated_data['name'] = base_name

        # Update the instance with all validated data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = ['id', 'creator', 'assigned', 'ticket_id', 'project', 'project_tag', 'title', 'description', 'priority', 'status', 'milestone', 'attachment', 'created_at', 'updated_at']
        extra_kwargs = {'ticket_id': {'read_only': True}, 'project_tag': {'read_only': True}, 'attachment': {'required': False}, 'milestone': {'required': False}}

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
    creator = RegisterSerializer(read_only=True)
    assigned = RegisterSerializer(read_only=True)

    class Meta:
        model = Issue
        fields = ['id', 'creator', 'assigned', 'ticket_id', 'project', 'project_tag', 'title', 'description', 'priority', 'status', 'created_at', 'updated_at']
        extra_kwargs = {'ticket_id': {'read_only': True}}


class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = ['id', 'name', 'project', 'is_default', 'created_at', 'updated_at']
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
            raise serializers.ValidationError('invalid credentials')
        attrs['user'] = user
        return attrs


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


class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ['id', 'name', 'project', 'description', 'status', 'start_date', 'delivery_date', 'created_at', 'updated_at']

        def create(self, validated_data):
            milestone = Milestone.objects.create(
                name=validated_data['name'],
                project=validated_data['project'],
            )
            return milestone


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True, write_only=True)

    def save(self, **kwargs):
        email = self.validated_data['email']

        try:
            user = User.objects.get(email=email)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"

            # Email
            subject = "TempestBoard | Password Reset Request"
            msg = f"""
Hello,
You requested to reset your password. Please click on the link below to reset your password:
{reset_url}
If you didn't request this, please ignore this email.

This link will expire in 24 hours.

Best regards,
TempestBord Team
            """

            # Send Email
            send_mail(
                subject=subject,
                message=msg,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
        except User.DoesNotExist:
            pass

        return True


class ResetPasswordUserSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    uid = serializers.CharField(required=True, write_only=True)
    token = serializers.CharField(required=True, write_only=True)

    def save(self, **kwargs):
        password = self.validated_data['password']
        confirm_password = self.validated_data['confirm_password']
        if password != confirm_password:
            raise serializers.ValidationError("Password and Confirm Password does not match")
        uid = urlsafe_base64_decode(self.validated_data['uid'])
        user = User.objects.get(pk=uid)
        token = default_token_generator.check_token(user, self.validated_data['token'])
        if not token:
            raise serializers.ValidationError("Token is invalid")
        else:
            user.set_password(password)
            user.save()
            return True


class ProjectInvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectInvitation
        fields = ['email', 'project_id']

    def validate_email(self, value):
        return value.lower()

    def create(self, validated_data):
        email = validated_data['email']
        project_id = validated_data['project_id']

        # Generate unique token for the invitation
        token = str(uuid.uuid4())

        # Check if user exists
        user = User.objects.filter(email=email).first()

        # Get the registration URL from settings with a default fallback
        # Add this to your settings.py: REGISTRATION_URL_NAME = 'your_registration_url_name'
        registration_url_name = getattr(settings, 'REGISTRATION_URL_NAME', 'register')
        accept_url_name = getattr(settings, 'ACCEPT_URL_NAME', 'accept-invitation')

        if user:
            try:
                accept_path = reverse('accept_invitation')
                invitation_link = f"{settings.FRONTEND_URL}{accept_path}?token={token}"
                email_body = (
                    f'You have been invited to join a project.\n\n'
                    f'Click here to join: {invitation_link}'
                )
            except NoReverseMatch:
                # Fallback if URL reverse fails
                invitation_link = f"{settings.FRONTEND_URL}/accept-invitation?token={token}"
                email_body = (
                    f'You have been invited to join a project.\n\n'
                    f'Click here to join: {invitation_link}'
                )
        else:
            # User doesn't exist - send registration invitation
            try:
                # Try to get the registration URL using the configured name
                register_url = reverse(registration_url_name)
            except NoReverseMatch:
                # Fallback to a default URL path if the name isn't found
                register_url = '/register'

            register_link = f"{settings.FRONTEND_URL}{register_url}?token={token}"
            email_body = (
                f'You have been invited to join a project.\n\n'
                f'Since you don\'t have an account yet, please register first: {register_link}\n\n'
                f'After registration, you\'ll be automatically added to the project.'
            )

        # Send the email
        send_mail(
            'Project Invitation',
            email_body,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )

        # Save invitation in database
        invitation = ProjectInvitation.objects.create(
            email=email,
            project_id=project_id,
            token=token,
            is_user_exists=bool(user)
        )

        return invitation

class ProjectInvitationListSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()

    class Meta:
        model = ProjectInvitation
        fields = ['id', 'email', 'created_at', 'accepted_at', 'is_user_exists', 'status']

    def get_status(self, obj):
        if obj.accepted_at:
            return 'accepted'
        return 'pending'
