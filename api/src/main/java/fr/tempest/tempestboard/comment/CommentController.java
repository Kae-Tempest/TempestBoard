package fr.tempest.tempestboard.comment;

import fr.tempest.tempestboard.config.RequiresPermission;
import fr.tempest.tempestboard.config.RequiresRole;
import fr.tempest.tempestboard.issue.Issue;
import fr.tempest.tempestboard.issue.IssueRepository;
import fr.tempest.tempestboard.user.User;
import fr.tempest.tempestboard.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/comments/", name = "comments")
public class CommentController {
    private final CommentRepository commentRepository;
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;

    public CommentController(CommentRepository commentRepository, IssueRepository issueRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.issueRepository = issueRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    @RequiresRole("ADMIN")
    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    @GetMapping("{id}")
    @RequiresPermission("VIEW_COMMENT")
    public ResponseEntity<Comment> getCommentById(@PathVariable long id) {
        Optional<Comment> comment = commentRepository.findById(id);
        return comment.map(value -> new ResponseEntity<>(value, HttpStatus.OK)).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/issues/{issueId}")
    @RequiresPermission("VIEW_COMMENT")
    public ResponseEntity<List<Comment>> getCommentsByIssueId(@PathVariable long issueId) {
        List<Comment> comments = commentRepository.findCommentByIssueId(issueId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @PostMapping
    @RequiresPermission("CREATE_COMMENT")
    public ResponseEntity<Comment> createComment(@RequestBody CreateCommentDto commentDto) {
        Optional<Issue> issue = issueRepository.findById(commentDto.getIssueId());
        Optional<User> user = userRepository.findById(commentDto.getUserId());

        if (issue.isEmpty() || user.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Comment comment = new Comment();
        comment.setIssue(issue.get());
        comment.setUser(user.get());
        comment.setContent(commentDto.getContent());

        if (commentDto.getAnswer() != null) {
            comment.setAnswer(commentDto.getAnswer());
        }
        if (commentDto.getThread() != null) {
            comment.setThread(commentDto.getThread());
        }
        if (commentDto.getCommendParentId() != null) {
            Optional<Comment> parentComment = commentRepository.findById(commentDto.getCommendParentId());
            if (parentComment.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            comment.setCommentParent(parentComment.get());
        }
        commentRepository.save(comment);
        return new ResponseEntity<>(comment, HttpStatus.CREATED);
    }

    @PatchMapping("{id}")
    @RequiresPermission("EDIT_COMMENT")
    public ResponseEntity<Comment> updateComment(@RequestBody UpdateCommentDto commentDto, @PathVariable long id) {
        Optional<Comment> comment = commentRepository.findById(id);
        if (comment.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (commentDto.getAnswer() != null) {
            comment.get().setAnswer(commentDto.getAnswer());
        }
        if (commentDto.getThread() != null) {
            comment.get().setThread(commentDto.getThread());
        }
        if (commentDto.getContent() != null) {
            comment.get().setContent(commentDto.getContent());
        }
        if (commentDto.getResolved() != null) {
            comment.get().setResolved(commentDto.getResolved());
        }

        commentRepository.save(comment.get());

        return new ResponseEntity<>(comment.get(), HttpStatus.OK);

    }

    @DeleteMapping("{id}")
    @RequiresPermission("DELETE_COMMENT")
    public ResponseEntity<Comment> deleteComment(@PathVariable long id) {
        Optional<Comment> comment = commentRepository.findById(id);
        if (comment.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        commentRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
