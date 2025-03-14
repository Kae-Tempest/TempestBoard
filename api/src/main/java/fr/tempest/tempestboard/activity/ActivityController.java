package fr.tempest.tempestboard.activity;

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
@RequestMapping(value = "/api/activities/", name = "activities")
public class ActivityController {
    public ActivityController(IssueRepository issueRepository, ActivityRepository activityRepository, UserRepository userRepository) {
        this.issueRepository = issueRepository;
        this.activityRepository = activityRepository;
        this.userRepository = userRepository;
    }

    private final IssueRepository issueRepository;
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    @GetMapping
    public List<Activity> getActivities() {
        return activityRepository.findAll();
    }

    @GetMapping("{id}")
    public ResponseEntity<Activity> getActivityById(@PathVariable long id) {
        Optional<Activity> activity = activityRepository.findById(id);
        return activity.map(value -> new ResponseEntity<>(value, HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping // Make DTO
    public ResponseEntity<Activity> createActivity(@RequestBody CreateActivityDto activityDto) {
        Optional<Issue> issue = issueRepository.findById(activityDto.getIssueId());
        Optional<User> user = userRepository.findById(activityDto.getUserId());

        if (issue.isEmpty() || user.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Activity activity = new Activity();
        activity.setIssue(issue.get());
        activity.setUser(user.get());
        activity.setContent(activityDto.getContent());
        activity.setType(activityDto.getType());
        activityRepository.save(activity);

        return new ResponseEntity<>(activity, HttpStatus.CREATED);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Activity> deleteActivity(@PathVariable long id) {
        Optional<Activity> activity = activityRepository.findById(id);
        if (activity.isPresent()) {
            activityRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
