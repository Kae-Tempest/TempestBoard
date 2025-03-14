package fr.tempest.tempestboard.issue;

import java.util.Set;

public class CreateIssueDto {
    private Long creator;
    private Long assigned;
    private Long project;
    private String title;
    private String description;
    private Long state;
    private String priority;

    public Long getCreator() {
        return creator;
    }

    public void setCreator(Long creator) {
        this.creator = creator;
    }

    public Long getAssigned() {
        return assigned;
    }

    public void setAssigned(Long assigned) {
        this.assigned = assigned;
    }

    public Long getProject() {
        return project;
    }

    public void setProject(Long project) {
        this.project = project;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getState() {
        return state;
    }

    public void setState(Long state) {
        this.state = state;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public Set<Long> getTags() {
        return tags;
    }

    public void setTags(Set<Long> tags) {
        this.tags = tags;
    }

    private Set<Long> tags;
}
