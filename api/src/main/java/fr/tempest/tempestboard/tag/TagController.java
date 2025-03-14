package fr.tempest.tempestboard.tag;

import fr.tempest.tempestboard.config.RequiresPermission;
import fr.tempest.tempestboard.config.RequiresRole;
import fr.tempest.tempestboard.project.Project;
import fr.tempest.tempestboard.project.ProjectRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/tags/", name = "tags")
public class TagController {
    public TagController(TagRepository tagRepository, ProjectRepository projectRepository) {
        this.tagRepository = tagRepository;
        this.projectRepository = projectRepository;
    }

    private final TagRepository tagRepository;
    private final ProjectRepository projectRepository;

    @GetMapping
    @RequiresRole("ADMIN")
    public List<Tag> listTags() {
        return tagRepository.findAll();
    }

    @GetMapping("{id}")
    @RequiresRole("ADMIN")
    public ResponseEntity<Tag> getTag(@PathVariable Long id) {
        Optional<Tag> tag = tagRepository.findById(id);
        return tag.map(value -> new ResponseEntity<>(value, HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    @RequiresPermission("CREATE_TAG")
    public ResponseEntity<Tag> createTag(@RequestBody CreateTagDto tagDto) {
        Optional<Project> project = projectRepository.findById(tagDto.getProject());
        if (project.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Tag tag = new Tag();
        tag.setName(tagDto.getName());
        tag.setProject(project.get());
        tagRepository.save(tag);
        return new ResponseEntity<>(tag, HttpStatus.OK);
    }

    @PatchMapping("{id}")
    @RequiresPermission("EDIT_TAG")
    public ResponseEntity<Tag> updateTag(@PathVariable Long id, @RequestBody CreateTagDto tagDto) {
        Optional<Tag> tag = tagRepository.findById(id);
        if (tag.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (tagDto.getName() != null) {
            tag.get().setName(tagDto.getName());
        }

        if (tagDto.getProject() != null) {
            Optional<Project> project = projectRepository.findById(tagDto.getProject());
            if (project.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            tag.get().setProject(project.get());
        }

        tagRepository.save(tag.get());
        return new ResponseEntity<>(tag.get(), HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    @RequiresPermission("DELETE_TAG")
    public ResponseEntity<Tag> deleteTag(@PathVariable Long id) {
        Optional<Tag> tag = tagRepository.findById(id);
        if (tag.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        tagRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
