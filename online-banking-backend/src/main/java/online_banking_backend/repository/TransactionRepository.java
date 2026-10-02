package online_banking_backend.repository;

import online_banking_backend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Optional<Transaction> findByTransactionReference(String transactionReference);

    List<Transaction> findBySenderAccountIdOrReceiverAccountId(Long senderAccountId,
                                                                Long receiverAccountId);
}