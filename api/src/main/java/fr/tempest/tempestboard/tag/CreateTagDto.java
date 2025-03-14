package fr.tempest.tempestboard.tag;

public class CreateTagDto {
    private String name;
    private Long project;

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
}
