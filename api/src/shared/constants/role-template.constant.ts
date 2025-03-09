// src/shared/constants/role-templates.constant.ts
import { Permission } from '../enums/permissions.enum';

export interface RoleTemplate {
  name: string;
  description: string;
  permissions: Permission[];
}

export const ROLE_TEMPLATES: Record<string, RoleTemplate> = {
  ADMIN: {
    name: 'Administrator',
    description: 'Full access to all features and settings',
    permissions: [
      // All permissions
      ...Object.values(Permission),
    ],
  },

  PROJECT_MANAGER: {
    name: 'Project Manager',
    description: 'Manages projects and has access to most features',
    permissions: [
      // Project Management
      Permission.CREATE_PROJECT,
      Permission.VIEW_PROJECT,
      Permission.EDIT_PROJECT,
      Permission.MANAGE_PROJECT_MEMBERS,
      Permission.ARCHIVE_PROJECT,

      // Issue Management (all)
      Permission.CREATE_ISSUE,
      Permission.VIEW_ISSUE,
      Permission.EDIT_ISSUE,
      Permission.DELETE_ISSUE,
      Permission.CHANGE_ISSUE_STATUS,
      Permission.ASSIGN_ISSUE,
      Permission.CLOSE_ISSUE,

      // Comment Management
      Permission.CREATE_COMMENT,
      Permission.VIEW_COMMENT,
      Permission.EDIT_COMMENT,
      Permission.EDIT_ANY_COMMENT,
      Permission.DELETE_COMMENT,
      Permission.DELETE_ANY_COMMENT,
      Permission.MARK_COMMENT_SOLUTION,

      // Tag Management (all)
      Permission.CREATE_TAG,
      Permission.EDIT_TAG,
      Permission.DELETE_TAG,
      Permission.ASSIGN_TAG,

      // Milestone Management (all)
      Permission.CREATE_MILESTONE,
      Permission.VIEW_MILESTONE,
      Permission.EDIT_MILESTONE,
      Permission.DELETE_MILESTONE,
      Permission.ASSIGN_TO_MILESTONE,

      // User & Role Management
      Permission.VIEW_USERS,
      Permission.ASSIGN_ROLE,

      // State Management (all)
      Permission.CREATE_STATE,
      Permission.EDIT_STATE,
      Permission.DELETE_STATE,
      Permission.REORDER_STATES,

      // Attachment Management (all)
      Permission.UPLOAD_ATTACHMENT,
      Permission.DELETE_ATTACHMENT,

      // Activity
      Permission.VIEW_ACTIVITY,
    ],
  },

  DEVELOPER: {
    name: 'Developer',
    description: 'Works on issues and contributes to projects',
    permissions: [
      // Project Management
      Permission.VIEW_PROJECT,

      // Issue Management
      Permission.CREATE_ISSUE,
      Permission.VIEW_ISSUE,
      Permission.EDIT_ISSUE,
      Permission.CHANGE_ISSUE_STATUS,
      Permission.ASSIGN_ISSUE,
      Permission.CLOSE_ISSUE,

      // Comment Management
      Permission.CREATE_COMMENT,
      Permission.VIEW_COMMENT,
      Permission.EDIT_COMMENT,
      Permission.DELETE_COMMENT,
      Permission.MARK_COMMENT_SOLUTION,

      // Tag Management
      Permission.ASSIGN_TAG,

      // Milestone Management
      Permission.VIEW_MILESTONE,

      // User Management
      Permission.VIEW_USERS,

      // Attachment Management
      Permission.UPLOAD_ATTACHMENT,

      // Activity
      Permission.VIEW_ACTIVITY,
    ],
  },

  REPORTER: {
    name: 'Reporter',
    description: 'Can report issues and add comments',
    permissions: [
      // Project Management
      Permission.VIEW_PROJECT,

      // Issue Management
      Permission.CREATE_ISSUE,
      Permission.VIEW_ISSUE,
      Permission.EDIT_ISSUE,

      // Comment Management
      Permission.CREATE_COMMENT,
      Permission.VIEW_COMMENT,
      Permission.EDIT_COMMENT,
      Permission.DELETE_COMMENT,

      // Milestone Management
      Permission.VIEW_MILESTONE,

      // User Management
      Permission.VIEW_USERS,

      // Attachment Management
      Permission.UPLOAD_ATTACHMENT,
    ],
  },

  VIEWER: {
    name: 'Viewer',
    description: 'Read-only access to projects and issues',
    permissions: [
      // Project Management
      Permission.VIEW_PROJECT,

      // Issue Management
      Permission.VIEW_ISSUE,

      // Comment Management
      Permission.VIEW_COMMENT,

      // Milestone Management
      Permission.VIEW_MILESTONE,

      // User Management
      Permission.VIEW_USERS,

      // Attachment Management
    ],
  },
};
