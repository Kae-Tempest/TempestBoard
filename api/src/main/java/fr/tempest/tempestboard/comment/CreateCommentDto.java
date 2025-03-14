package fr.tempest.tempestboard.comment;


public class CreateCommentDto {
    public Long getIssueId() {
        return issueId;
    }

    public void setIssueId(Long issueId) {
        this.issueId = issueId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Boolean getAnswer() {
        return isAnswer;
    }

    public void setAnswer(Boolean answer) {
        isAnswer = answer;
    }

    public Long getCommendParentId() {
        return commendParentId;
    }

    public void setCommendParentId(Long commendParentId) {
        this.commendParentId = commendParentId;
    }

    public Boolean getThread() {
        return isThread;
    }

    public void setThread(Boolean thread) {
        isThread = thread;
    }

    private Long issueId;
    private Long userId;
    private String content;
    private Boolean isAnswer;
    private Long commendParentId;
    private Boolean isThread;
}
