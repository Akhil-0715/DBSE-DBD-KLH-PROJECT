package online_banking_backend.repository;

import online_banking_backend.entity.FraudAlert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FraudAlertRepository extends JpaRepository<FraudAlert, Long> {

    List<FraudAlert> findByStatus(String status);

    List<FraudAlert> findBySeverity(String severity);
}