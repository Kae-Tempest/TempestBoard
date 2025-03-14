package fr.tempest.tempestboard.role;


import java.util.List;

public class CreateRoleDto {
    private String name;
    private Long project;
    private List<Long> permissions;
    private List<Long> users;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getProject() {
        return project;
    }

    public void setProject(Long project) {
        this.project = project;
    }

    public List<Long> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<Long> permissions) {
        this.permissions = permissions;
    }

    public List<Long> getUsers() {
        return users;
    }

    public void setUsers(List<Long> users) {
        this.users = users;
    }
}
