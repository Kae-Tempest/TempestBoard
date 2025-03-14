package fr.tempest.tempestboard.state;

public class CreateStateDto {
    private Long project;
    private String name;

    public Long getProject() {
        return project;
    }

    public void setProject(Long project) {
        this.project = project;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
