package fr.tempest.tempestboard.issue;

import fr.tempest.tempestboard.milestone.Milestone;
import fr.tempest.tempestboard.project.Project;
import fr.tempest.tempestboard.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findAllByCreator(User user);

    List<Issue> findAllByAssigned(User user);

    List<Issue> findAllByProject(Project project);

    List<Issue> findAllByStateNameAndProjectId(String stateName, Long project);

    List<Issue> findAllByStateNameAndMilestone(String stateName, Milestone milestone);
}
