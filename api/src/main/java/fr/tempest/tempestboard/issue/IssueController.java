package fr.tempest.tempestboard.issue;

import fr.tempest.tempestboard.config.RequiresPermission;
import fr.tempest.tempestboard.config.RequiresRole;
import fr.tempest.tempestboard.milestone.Milestone;
import fr.tempest.tempestboard.milestone.MilestoneRepository;
import fr.tempest.tempestboard.project.Project;
import fr.tempest.tempestboard.project.ProjectRepository;
import fr.tempest.tempestboard.state.State;
import fr.tempest.tempestboard.state.StateRepository;
import fr.tempest.tempestboard.tag.Tag;
import fr.tempest.tempestboard.tag.TagRepository;
import fr.tempest.tempestboard.user.User;
import fr.tempest.tempestboard.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping(value = "/api/issues/", name = "issues")
public class IssueController {
    public IssueController(IssueRepository issueRepository, TagRepository tagRepository, UserRepository userRepository, StateRepository stateRepository, ProjectRepository projectRepository, MilestoneRepository milestoneRepository) {
        this.issueRepository = issueRepository;
        this.tagRepository = tagRepository;
        this.userRepository = userRepository;
        this.stateRepository = stateRepository;
        this.projectRepository = projectRepository;
        this.milestoneRepository = milestoneRepository;
    }

    private final IssueRepository issueRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;
    private final StateRepository stateRepository;
    private final ProjectRepository projectRepository;
    private final MilestoneRepository milestoneRepository;

    @GetMapping
    @RequiresRole("ADMIN")
    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
    }

    @GetMapping("{id}")
    @RequiresPermission("VIEW_ISSUE")
    public ResponseEntity<Issue> getIssueById(@PathVariable long id) {
        Optional<Issue> issue = issueRepository.findById(id);
        return issue.map(value -> new ResponseEntity<>(value, HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/user/{user_id}")
    @RequiresPermission("VIEW_ISSUE")
    public ResponseEntity<List<Issue>> getIssueByUser(@PathVariable long user_id) {
        Optional<User> user = userRepository.findById(user_id);
        if (user.isPresent()) {
            User foundUser = user.get();

            List<Issue> createdIssues = issueRepository.findAllByCreator(foundUser);

            List<Issue> assignedIssues = issueRepository.findAllByAssigned(foundUser);

            Set<Issue> combinedIssuesSet = new HashSet<>();
            combinedIssuesSet.addAll(createdIssues);
            combinedIssuesSet.addAll(assignedIssues);

            List<Issue> combinedIssues = new ArrayList<>(combinedIssuesSet);

            return new ResponseEntity<>(combinedIssues, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    @RequiresPermission("CREATE_ISSUE")
    public ResponseEntity<Issue> createIssue(@RequestBody CreateIssueDto issueDto) {
        Optional<User> creator = userRepository.findById(issueDto.getCreator());
        Optional<User> assigned = userRepository.findById(issueDto.getAssigned());
        Optional<Project> project = projectRepository.findById(issueDto.getProject());

        if (creator.isEmpty() || assigned.isEmpty() || project.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Optional<State> state = stateRepository.findById(issueDto.getState());

        if (state.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        List<Tag> tags = tagRepository.findAllById(issueDto.getTags());

        Issue issue = new Issue();

        if (issueDto.getDescription() != null) {
            issue.setDescription(issueDto.getDescription());
        }

        issue.setCreator(creator.get());
        issue.setAssigned(assigned.get());
        issue.setProject(project.get());
        issue.setState(state.get());
        issue.setTags(tags);
        issue.setTicketId(issueRepository.findAllByProject(project.get()).size());
        issue.setPriority(issueDto.getPriority());
        issue.setTitle(issueDto.getTitle());
        issue.setProjectTag(project.get().getName().substring(0, 2).toUpperCase());

        issueRepository.save(issue);
        return new ResponseEntity<>(issue, HttpStatus.CREATED);
    }

    @PatchMapping("{id}")
    @RequiresPermission("EDIT_ISSUE")
    public ResponseEntity<Issue> updateIssue(@PathVariable long id, @RequestBody UpdateIssueDto issueDto) {
        Optional<Issue> issue = issueRepository.findById(id);
        if (issue.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (issueDto.getProject() != null) {
            Optional<Project> project = projectRepository.findById(issueDto.getProject());
            if (project.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            issue.get().setProject(project.get());
            issue.get().setProjectTag(project.get().getName().substring(0, 2).toUpperCase());
        }

        if (issueDto.getAssigned() != null) {
            Optional<User> assigned = userRepository.findById(issueDto.getAssigned());
            if (assigned.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            issue.get().setAssigned(assigned.get());
        }

        if (issueDto.getMilestone() != null) {
            Optional<Milestone> milestone = milestoneRepository.findById(issueDto.getMilestone());
            if (milestone.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            issue.get().setMilestone(milestone.get());
        }

        if (issueDto.getTags() != null) {
            List<Tag> tags = tagRepository.findAllById(issueDto.getTags());
            issue.get().setTags(tags);
        }

        if (issueDto.getState() != null) {
            Optional<State> state = stateRepository.findById(issueDto.getState());
            if (state.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            issue.get().setState(state.get());
        }

        if (issueDto.getTitle() != null) {
            issue.get().setTitle(issueDto.getTitle());
        }

        if (issueDto.getDescription() != null) {
            issue.get().setDescription(issueDto.getDescription());
        }

        if (issueDto.getPriority() != null) {
            issue.get().setPriority(issueDto.getPriority());
        }

        issueRepository.save(issue.get());
        return new ResponseEntity<>(issue.get(), HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    @RequiresPermission("DELETE_ISSUE")
    public ResponseEntity<Issue> deleteIssue(@PathVariable long id) {
        Optional<Issue> issue = issueRepository.findById(id);
        if (issue.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        issueRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
