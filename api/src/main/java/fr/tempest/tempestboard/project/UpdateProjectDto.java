package fr.tempest.tempestboard.project;

public class UpdateProjectDto extends CreateProjectDto {
    public Long getState() {
        return state;
    }

    public void setState(Long state) {
        this.state = state;
    }

    private Long state;

    public Iterable<Long> getUsers() {
        return users;
    }

    public void setUsers(Iterable<Long> users) {
        this.users = users;
    }

    private Iterable<Long> users;
}
