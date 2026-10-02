package online_banking_backend.repository;

import online_banking_backend.entity.FixedDeposit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FixedDepositRepository
        extends JpaRepository<FixedDeposit, Long> {

    Optional<FixedDeposit> findByFdNumber(String fdNumber);
}