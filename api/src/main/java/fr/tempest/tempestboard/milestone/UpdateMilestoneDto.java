package fr.tempest.tempestboard.milestone;

import java.sql.Timestamp;
import java.util.Set;

public class UpdateMilestoneDto {
    private String title;
    private Set<Long> issues;
    private String description;
    private Timestamp startDate;
    private Timestamp deliveryDate;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Set<Long> getIssues() {
        return issues;
    }

    public void setIssues(Set<Long> issues) {
        this.issues = issues;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Timestamp getStartDate() {
        return startDate;
    }

    public void setStartDate(Timestamp startDate) {
        this.startDate = startDate;
    }

    public Timestamp getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(Timestamp deliveryDate) {
        this.deliveryDate = deliveryDate;
    }
}
