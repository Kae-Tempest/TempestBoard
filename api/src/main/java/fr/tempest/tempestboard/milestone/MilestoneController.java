package fr.tempest.tempestboard.milestone;

import fr.tempest.tempestboard.config.RequiresPermission;
import fr.tempest.tempestboard.config.RequiresRole;
import fr.tempest.tempestboard.issue.Issue;
import fr.tempest.tempestboard.issue.IssueRepository;
import fr.tempest.tempestboard.project.Project;
import fr.tempest.tempestboard.project.ProjectRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/milestones/", name = "milestones")
public class MilestoneController {
    public MilestoneController(MilestoneRepository milestoneRepository, ProjectRepository projectRepository, IssueRepository issueRepository) {
        this.milestoneRepository = milestoneRepository;
        this.projectRepository = projectRepository;
        this.issueRepository = issueRepository;
    }

    private final MilestoneRepository milestoneRepository;
    private final ProjectRepository projectRepository;
    private final IssueRepository issueRepository;

    @GetMapping
    @RequiresRole("ADMIN")
    public List<Milestone> getMilestones() {
        return milestoneRepository.findAll();
    }

    @GetMapping("{id}")
    @RequiresPermission("VIEW_MILESTONE")
    public ResponseEntity<Milestone> getMilestone(@PathVariable Long id) {
        Optional<Milestone> milestone = milestoneRepository.findById(id);
        return milestone.map(value -> new ResponseEntity<>(value, HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    @RequiresPermission("CREATE_MILESTONE")
    public ResponseEntity<Milestone> createMilestone(@RequestBody CreateMilestoneDto milestoneDto) {
        List<Issue> issues = issueRepository.findAllById(milestoneDto.getIssues());
        Optional<Project> project = projectRepository.findById(milestoneDto.getProject());

        if (project.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Milestone milestone = new Milestone();
        milestone.setProject(project.get());
        if (!issues.isEmpty()) {
            milestone.setIssues(issues);
        }
        milestone.setName(milestoneDto.getName());
        milestone.setDescription(milestoneDto.getDescription());
        milestone.setStartDate(milestoneDto.getStartDate());
        milestone.setDeliveryDate(milestoneDto.getDeliveryDate());

        milestoneRepository.save(milestone);
        return new ResponseEntity<>(milestone, HttpStatus.CREATED);
    }

    @PatchMapping("{id}")
    @RequiresPermission("EDIT_MILESTONE")
    public ResponseEntity<Milestone> updateMilestone(@PathVariable Long id, @RequestBody UpdateMilestoneDto milestoneDto) {
        Optional<Milestone> milestone = milestoneRepository.findById(id);
        if (milestone.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (!milestoneDto.getIssues().isEmpty()) {
            List<Issue> issues = issueRepository.findAllById(milestoneDto.getIssues());
            if (!issues.isEmpty()) {
                milestone.get().setIssues(issues);
            }
        }

        if (milestoneDto.getTitle() != null) {
            milestone.get().setName(milestoneDto.getTitle());
        }
        if (milestoneDto.getDescription() != null) {
            milestone.get().setDescription(milestoneDto.getDescription());
        }
        if (milestoneDto.getStartDate() != null) {
            milestone.get().setStartDate(milestoneDto.getStartDate());
        }
        if (milestoneDto.getDeliveryDate() != null) {
            milestone.get().setDeliveryDate(milestoneDto.getDeliveryDate());
        }


        milestoneRepository.save(milestone.get());
        return new ResponseEntity<>(milestone.get(), HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    @RequiresPermission("DELETE_MILESTONE")
    public ResponseEntity<Milestone> deleteMilestone(@PathVariable Long id) {
        Optional<Milestone> milestone = milestoneRepository.findById(id);
        if (milestone.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        milestoneRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
