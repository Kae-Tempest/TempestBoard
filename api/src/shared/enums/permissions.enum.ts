export enum Permission {
  // Project Management
  CREATE_PROJECT = 'create_project',
  VIEW_PROJECT = 'view_project',
  EDIT_PROJECT = 'edit_project',
  DELETE_PROJECT = 'delete_project',
  MANAGE_PROJECT_MEMBERS = 'manage_project_members',
  ARCHIVE_PROJECT = 'archive_project',

  // Issue Management
  CREATE_ISSUE = 'create_issue',
  VIEW_ISSUE = 'view_issue',
  EDIT_ISSUE = 'edit_issue',
  DELETE_ISSUE = 'delete_issue',
  CHANGE_ISSUE_STATUS = 'change_issue_status',
  ASSIGN_ISSUE = 'assign_issue',
  CLOSE_ISSUE = 'close_issue',

  // Comment Management
  CREATE_COMMENT = 'create_comment',
  VIEW_COMMENT = 'view_comment',
  EDIT_COMMENT = 'edit_comment',
  EDIT_ANY_COMMENT = 'edit_any_comment',
  DELETE_COMMENT = 'delete_comment',
  DELETE_ANY_COMMENT = 'delete_any_comment',
  MARK_COMMENT_SOLUTION = 'mark_comment_solution',

  // Tag Management
  CREATE_TAG = 'create_tag',
  EDIT_TAG = 'edit_tag',
  DELETE_TAG = 'delete_tag',
  ASSIGN_TAG = 'assign_tag',
  VIEW_TAG = 'view_tag',

  // Milestone Management
  CREATE_MILESTONE = 'create_milestone',
  VIEW_MILESTONE = 'view_milestone',
  EDIT_MILESTONE = 'edit_milestone',
  DELETE_MILESTONE = 'delete_milestone',
  ASSIGN_TO_MILESTONE = 'assign_to_milestone',

  // User & Role Management
  VIEW_USERS = 'view_users',
  CREATE_ROLE = 'create_role',
  VIEW_ROLE = 'view_role',
  EDIT_ROLE = 'edit_role',
  DELETE_ROLE = 'delete_role',
  ASSIGN_ROLE = 'assign_role',
  MANAGE_PERMISSIONS = 'manage_permissions',

  // Administrative
  ADMIN_ACCESS = 'admin_access',
  VIEW_ACTIVITY = 'view_activity',

  // State Management
  CREATE_STATE = 'create_state',
  EDIT_STATE = 'edit_state',
  DELETE_STATE = 'delete_state',
  REORDER_STATES = 'reorder_states',

  // Attachment Management
  UPLOAD_ATTACHMENT = 'upload_attachment',
  DELETE_ATTACHMENT = 'delete_attachment',
}
