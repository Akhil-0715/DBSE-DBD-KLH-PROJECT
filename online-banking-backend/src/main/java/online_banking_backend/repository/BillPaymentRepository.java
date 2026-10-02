package online_banking_backend.repository;

import online_banking_backend.entity.BillPayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BillPaymentRepository
        extends JpaRepository<BillPayment, Long> {

    Optional<BillPayment> findByPaymentReference(
            String paymentReference
    );

    List<BillPayment> findByAccountId(Long accountId);
}