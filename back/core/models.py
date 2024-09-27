from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager


class User(AbstractUser):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(_("email address"), unique=True)
    thumbnail = models.ImageField(upload_to='thumbnail/user/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email


class Project(models.Model):
    creator = models.ForeignKey('User', related_name='created_projects', on_delete=models.CASCADE)
    users = models.ManyToManyField('User', blank=True, related_name='participating_users')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True,null=True)
    status = models.CharField(max_length=20)
    thumbnail = models.ImageField(upload_to='thumbnail/project/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Issue(models.Model):
    creator = models.ForeignKey('User', on_delete=models.CASCADE, related_name='created_issue')
    assigned = models.ForeignKey('User', on_delete=models.CASCADE, related_name='assigned_issue')
    project = models.ForeignKey('Project', on_delete=models.CASCADE, related_name='issues')
    ticket_id = models.IntegerField()
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True,null=True)
    priority = models.CharField(max_length=10)
    status = models.CharField(max_length=11)
    tags = models.ManyToManyField('Tag', blank=True, related_name='tags')
    milestone = models.CharField(max_length=150, blank=True, null=True)
    attachment = models.FileField(upload_to='attachment/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class State(models.Model):
    name = models.CharField(max_length=25, unique=True)
    project = models.ForeignKey('Project', related_name='project_states', on_delete=models.CASCADE)
    is_default = models.BooleanField(default=False, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Role(models.Model):
    name = models.CharField(max_length=100)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='role')
    users = models.ManyToManyField('User', blank=True, related_name='users')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=100)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tag')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Activity(models.Model):
    type = models.CharField(max_length=100)
    issue = models.ForeignKey('Issue', related_name='activity', on_delete=models.CASCADE)
    user = models.ForeignKey('User', related_name='activity', on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.content

class Comment(models.Model):
    issue = models.ForeignKey('Issue', related_name='comments', on_delete=models.CASCADE)
    user = models.ForeignKey('User', related_name='comments', on_delete=models.CASCADE)
    content = models.TextField()
    is_answer = models.BooleanField(default=False)
    comment_parent = models.ForeignKey('self', related_name='comments', on_delete=models.CASCADE, null=True, blank=True)
    is_thread = models.BooleanField(default=False)
    is_resolved = models.BooleanField(default=False)
    attachment = models.FileField(upload_to='attachment/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.content