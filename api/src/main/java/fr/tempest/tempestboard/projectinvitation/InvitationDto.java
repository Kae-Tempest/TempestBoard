package fr.tempest.tempestboard.projectinvitation;

public class InvitationDto {
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getProject() {
        return project;
    }

    public void setProject(Long project) {
        this.project = project;
    }

    private String email;
    private Long project;
}
