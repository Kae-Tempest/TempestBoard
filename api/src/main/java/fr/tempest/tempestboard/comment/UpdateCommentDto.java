package fr.tempest.tempestboard.comment;

public class UpdateCommentDto {
    private String content;
    private Boolean isAnswer;
    private Boolean isThread;
    private Boolean isResolved;

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

    public Boolean getThread() {
        return isThread;
    }

    public void setThread(Boolean thread) {
        isThread = thread;
    }

    public Boolean getResolved() {
        return isResolved;
    }

    public void setResolved(Boolean resolved) {
        isResolved = resolved;
    }
}
