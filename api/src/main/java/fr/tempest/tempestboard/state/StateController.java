package fr.tempest.tempestboard.state;

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
@RequestMapping(value = "/api/state/", name = "states")
public class StateController {
    private final StateRepository stateRepository;
    private final ProjectRepository projectRepository;

    public StateController(StateRepository stateRepository, ProjectRepository projectRepository) {
        this.stateRepository = stateRepository;
        this.projectRepository = projectRepository;
    }

    @GetMapping
    @RequiresRole("ADMIN")
    public List<State> getAll() {
        return stateRepository.findAll();
    }

    @GetMapping("{id}")
    public ResponseEntity<State> getById(@PathVariable long id) {
        Optional<State> state = stateRepository.findById(id);
        return state.map(value -> new ResponseEntity<>(value, HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    @RequiresPermission("CREATE_STATE")
    public ResponseEntity<State> createState(@RequestBody CreateStateDto stateDto) {
        Optional<Project> project = projectRepository.findById(stateDto.getProject());
        if (project.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        State state = new State();
        state.setName(stateDto.getName());
        state.setProject(project.get());
        return new ResponseEntity<>(stateRepository.save(state), HttpStatus.CREATED);
    }


    @PatchMapping("{id}")
    @RequiresPermission("EDIT_STATE")
    public ResponseEntity<State> updateState(@PathVariable long id, @RequestBody UpdateStateDto stateDto) {
        Optional<State> state = stateRepository.findById(id);
        if (state.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (stateDto.getProject() != null) {
            Optional<Project> project = projectRepository.findById(stateDto.getProject());
            if (project.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            state.get().setProject(project.get());
        }

        if (stateDto.getName() != null) {
            state.get().setName(stateDto.getName());
        }

        if (stateDto.getActive() != null) {
            state.get().setActive(stateDto.getActive());
        }

        if (stateDto.getBacklog() != null) {
            state.get().setBacklog(stateDto.getBacklog());
        }

        if (stateDto.getCanceled() != null) {
            state.get().setCanceled(stateDto.getCanceled());
        }

        stateRepository.save(state.get());
        return new ResponseEntity<>(stateRepository.save(state.get()), HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    @RequiresPermission("DELETE_STATE")
    public ResponseEntity<State> deleteState(@PathVariable long id) {
        Optional<State> state = stateRepository.findById(id);
        if (state.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        stateRepository.delete(state.get());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
