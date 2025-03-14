package fr.tempest.tempestboard.project;

import fr.tempest.tempestboard.config.RequiresPermission;
import fr.tempest.tempestboard.config.RequiresRole;
import fr.tempest.tempestboard.issue.Issue;
import fr.tempest.tempestboard.issue.IssueRepository;
import fr.tempest.tempestboard.milestone.Milestone;
import fr.tempest.tempestboard.milestone.MilestoneRepository;
import fr.tempest.tempestboard.role.Role;
import fr.tempest.tempestboard.role.RoleRepository;
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
@RequestMapping(value = "/api/projects/", name = "projects")
public class ProjectController {
    private final ProjectRepository projectRepository;
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final MilestoneRepository milestoneRepository;
    private final StateRepository stateRepository;
    private final RoleRepository roleRepository;
    private final TagRepository tagRepository;

    public ProjectController(ProjectRepository projectRepository, IssueRepository issueRepository, UserRepository userRepository, MilestoneRepository milestoneRepository, StateRepository stateRepository, RoleRepository roleRepository, TagRepository tagRepository) {
        this.projectRepository = projectRepository;
        this.issueRepository = issueRepository;
        this.userRepository = userRepository;
        this.milestoneRepository = milestoneRepository;
        this.stateRepository = stateRepository;
        this.roleRepository = roleRepository;
        this.tagRepository = tagRepository;
    }

    @GetMapping
    @RequiresRole("ADMIN")
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @GetMapping("{id}")
    @RequiresPermission("VIEW_PROJECT")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        Optional<Project> project = projectRepository.findById(id);
        return project.map(value -> new ResponseEntity<>(value, HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    @RequiresRole("CREATE_PROJECT")
    public ResponseEntity<Project> addProject(@RequestBody CreateProjectDto projectDto) {
        Optional<User> creator = userRepository.findById(projectDto.getCreator());
        if (creator.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Project project = new Project();
        project.setName(projectDto.getName());
        if (projectDto.getDescription() != null) {
            project.setDescription(projectDto.getDescription());
        }
        project.setOwner(creator.get());

        projectRepository.save(project);
        return new ResponseEntity<>(project, HttpStatus.OK);
    }

    @PatchMapping("{id}")
    @RequiresPermission("EDIT_PROJECT")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody UpdateProjectDto projectDto) {
        Optional<Project> project = projectRepository.findById(id);
        if (project.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (projectDto.getDescription() != null) {
            project.get().setDescription(projectDto.getDescription());
        }

        if (projectDto.getName() != null) {
            project.get().setName(projectDto.getName());
        }

        if (projectDto.getState() != null) {
            Optional<State> state = stateRepository.findById(projectDto.getState());
            if (state.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            Set<State> stateSet = new HashSet<>();
            stateSet.add(state.get());
            project.get().setStates(stateSet);
        }

        if (projectDto.getUsers() != null) {
            List<User> usersList = userRepository.findAllById(projectDto.getUsers());
            if (usersList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            Set<User> user = new HashSet<>(usersList);
            project.get().setUsers(user);
        }

        projectRepository.save(project.get());
        return new ResponseEntity<>(project.get(), HttpStatus.OK);

    }

    @DeleteMapping("{id}")
    @RequiresPermission("DELETE_PROJECT")
    public ResponseEntity<Project> deleteProject(@PathVariable Long id) {
        Optional<Project> project = projectRepository.findById(id);
        if (project.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        projectRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("{id}/states")
    @RequiresPermission("VIEW_PROJECT")
    public ResponseEntity<List<State>> getStates(@PathVariable Long id) {
        return new ResponseEntity<>(stateRepository.findByProjectId(id), HttpStatus.OK);
    }

    @GetMapping("{id}/active-issues")
    @RequiresPermission("VIEW_ISSUE")
    public ResponseEntity<List<Issue>> getActiveIssues(@PathVariable Long id) {
        return new ResponseEntity<>(issueRepository.findAllByStateNameAndProjectId("active", id), HttpStatus.OK);
    }

    @GetMapping("{id}/backlog-issues")
    @RequiresPermission("VIEW_ISSUE")
    public ResponseEntity<List<Issue>> getBacklogIssues(@PathVariable Long id) {
        return new ResponseEntity<>(issueRepository.findAllByStateNameAndProjectId("backlog", id), HttpStatus.OK);
    }

    @GetMapping("{id}/milestones")
    @RequiresPermission("VIEW_MILESTONE")
    public ResponseEntity<List<Milestone>> getMilestones(@PathVariable Long id) {
        return new ResponseEntity<>(milestoneRepository.findAllByProjectId(id), HttpStatus.OK);
    }

    @GetMapping("{id}/milestone/{milestoneId}/advancement")
    @RequiresPermission("VIEW_MILESTONE")
    public ResponseEntity<List<Integer>> getMilestoneAdvancements(@PathVariable Long id, @PathVariable Long milestoneId) {
        Milestone milestone = milestoneRepository.findMilestoneByIdAndProjectId(milestoneId, id);
        if (milestone == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        List<Issue> activeIssues = issueRepository.findAllByStateNameAndProjectId("active", id);
        List<Issue> backlogIssues = issueRepository.findAllByStateNameAndProjectId("backlog", id);
        List<Issue> cancelledIssues = issueRepository.findAllByStateNameAndProjectId("cancelled", id);
        List<Integer> milestoneAdvancements = new ArrayList<>();
        milestoneAdvancements.add(activeIssues.size());
        milestoneAdvancements.add(backlogIssues.size());
        milestoneAdvancements.add(cancelledIssues.size());

        return new ResponseEntity<>(milestoneAdvancements, HttpStatus.OK);
    }

    @GetMapping("{id}/roles")
    @RequiresPermission("VIEW_ROLE")
    public ResponseEntity<List<Role>> getRoles(@PathVariable Long id) {
        return new ResponseEntity<>(roleRepository.findAllByProjectId(id), HttpStatus.OK);
    }

    @GetMapping("{id}/tags")
    @RequiresPermission("VIEW_TAG")
    public ResponseEntity<List<Tag>> getTags(@PathVariable Long id) {
        return new ResponseEntity<>(tagRepository.findAllByProjectId(id), HttpStatus.OK);
    }
}
