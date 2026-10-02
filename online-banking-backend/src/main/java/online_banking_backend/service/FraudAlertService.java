package online_banking_backend.service;

import online_banking_backend.entity.FraudAlert;
import online_banking_backend.entity.Transaction;
import online_banking_backend.repository.FraudAlertRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FraudAlertService {

    private final FraudAlertRepository fraudAlertRepository;

    public FraudAlertService(FraudAlertRepository fraudAlertRepository) {
        this.fraudAlertRepository = fraudAlertRepository;
    }

    public FraudAlert createAlert(FraudAlert fraudAlert) {
        if (fraudAlert.getStatus() == null) {
            fraudAlert.setStatus("OPEN");
        }

        if (fraudAlert.getAlertDate() == null) {
            fraudAlert.setAlertDate(LocalDateTime.now());
        }

        return fraudAlertRepository.save(fraudAlert);
    }

    public List<FraudAlert> getAllAlerts() {
        return fraudAlertRepository.findAll();
    }

    public Optional<FraudAlert> getAlertById(Long id) {
        return fraudAlertRepository.findById(id);
    }

    public List<FraudAlert> getAlertsByStatus(String status) {
        return fraudAlertRepository.findByStatus(status);
    }

    public List<FraudAlert> getAlertsBySeverity(String severity) {
        return fraudAlertRepository.findBySeverity(severity);
    }

    public void deleteAlert(Long id) {
        fraudAlertRepository.deleteById(id);
    }

    // Basic fraud detection for large transactions
    public void checkForFraud(Transaction transaction) {

        if (transaction == null || transaction.getAmount() == null) {
            return;
        }

        BigDecimal threshold = new BigDecimal("50000");

        if (transaction.getAmount().compareTo(threshold) >= 0) {

            FraudAlert alert = new FraudAlert();

            alert.setAlertType("LARGE_TRANSACTION");

            alert.setDescription(
                    "Transaction amount exceeds the configured fraud monitoring threshold"
            );

            alert.setSeverity("HIGH");
            alert.setStatus("OPEN");
            alert.setAlertDate(LocalDateTime.now());
            alert.setTransaction(transaction);

            fraudAlertRepository.save(alert);
        }
    }
}