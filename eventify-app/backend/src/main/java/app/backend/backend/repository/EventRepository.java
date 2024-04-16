package app.backend.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import app.backend.backend.model.Event;
import java.util.List;
import org.springframework.data.domain.Sort;

@Repository
public interface EventRepository extends JpaRepository<Event, String> {
    Event findByTitle(String title);
    Event findById(long id);
    List<Event> findByCategory(String category);
    void deleteByTitle(String title);
    void deleteById(long id);
    List<Event> findAll();
    List<Event> findByOwner(String owner, Sort sort);
    List<Event> findAllByOrderByStartAsc();
}
