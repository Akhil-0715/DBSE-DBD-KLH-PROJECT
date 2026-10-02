package online_banking_backend.controller;

import online_banking_backend.entity.FraudAlert;
import online_banking_backend.service.FraudAlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fraud-alerts")
@CrossOrigin(origins = "http://localhost:5173")
public class FraudAlertController {

    private final FraudAlertService fraudAlertService;

    public FraudAlertController(FraudAlertService fraudAlertService) {
        this.fraudAlertService = fraudAlertService;
    }

    @PostMapping
    public FraudAlert createAlert(@RequestBody FraudAlert fraudAlert) {
        return fraudAlertService.createAlert(fraudAlert);
    }

    @GetMapping
    public List<FraudAlert> getAllAlerts() {
        return fraudAlertService.getAllAlerts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FraudAlert> getAlertById(@PathVariable Long id) {
        return fraudAlertService.getAlertById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public List<FraudAlert> getAlertsByStatus(
            @PathVariable String status) {

        return fraudAlertService.getAlertsByStatus(status);
    }

    @GetMapping("/severity/{severity}")
    public List<FraudAlert> getAlertsBySeverity(
            @PathVariable String severity) {

        return fraudAlertService.getAlertsBySeverity(severity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlert(@PathVariable Long id) {

        fraudAlertService.deleteAlert(id);

        return ResponseEntity.noContent().build();
    }
}