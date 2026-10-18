package com.taskflow.repository;

import com.taskflow.entity.Task;
import com.taskflow.enums.Priorite;
import com.taskflow.enums.Statut;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    Boolean existsTaskById(Long id);

    Page<Task> findByStatut(Statut statut,Pageable pageable);
    List<Task> findByPriorite(Priorite priorite);

    @Query("select t from Task t where t.deadline < :now and t.statut <> :done")
    List<Task> findRetardTasks(@Param("now")LocalDateTime now,@Param("done") Statut done);

    @Query("select t.statut as statut, count(t) as total from Task t group by t.statut")
    List<Task> countByStatut();

    Page<Task> findAllByTitreContainingIgnoreCase(String titre, Pageable pageable);

    Page<Task> findByTitreContainingIgnoreCaseAndStatut(String trim, Statut statut, Pageable pageable);

    Long countByDeadlineBetween(LocalDateTime start, LocalDateTime end);

    @Query("select count(t) from Task t where t.deadline < :now and t.statut <> :done")
    Long countOverdueTasks(@Param("now")LocalDateTime now,@Param("done") Statut done);

    @Query("select count(t) from Task t where t.statut = :done")
    Long countDoneTasks(@Param("done") Statut done);

    List<Task> findTop5ByOrderByDateCreationDesc();

    List<Task> findTop5ByDeadlineBeforeAndStatutNotOrderByDeadlineAsc(LocalDateTime now, Statut statut);
}
