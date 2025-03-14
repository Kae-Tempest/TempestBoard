package fr.tempest.tempestboard.state;

public class UpdateStateDto extends CreateStateDto {
    private Boolean isActive;
    private Boolean isBacklog;
    private Boolean isCanceled;

    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }

    public Boolean getBacklog() {
        return isBacklog;
    }

    public void setBacklog(Boolean backlog) {
        isBacklog = backlog;
    }

    public Boolean getCanceled() {
        return isCanceled;
    }

    public void setCanceled(Boolean canceled) {
        isCanceled = canceled;
    }
}
