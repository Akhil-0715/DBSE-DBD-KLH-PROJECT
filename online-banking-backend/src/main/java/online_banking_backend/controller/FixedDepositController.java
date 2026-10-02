package online_banking_backend.controller;

import online_banking_backend.entity.FixedDeposit;
import online_banking_backend.service.FixedDepositService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fixed-deposits")
@CrossOrigin(origins = "http://localhost:5173")
public class FixedDepositController {

    private final FixedDepositService fixedDepositService;

    public FixedDepositController(FixedDepositService fixedDepositService) {
        this.fixedDepositService = fixedDepositService;
    }

    @PostMapping
    public ResponseEntity<?> createFixedDeposit(
            @RequestBody FixedDeposit fixedDeposit) {

        try {
            return ResponseEntity.ok(
                    fixedDepositService.createFixedDeposit(fixedDeposit)
            );
        } catch (RuntimeException exception) {
            return ResponseEntity.badRequest()
                    .body(exception.getMessage());
        }
    }

    @GetMapping
    public List<FixedDeposit> getAllFixedDeposits() {
        return fixedDepositService.getAllFixedDeposits();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FixedDeposit> getFixedDepositById(
            @PathVariable Long id) {

        return fixedDepositService.getFixedDepositById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/number/{fdNumber}")
    public ResponseEntity<FixedDeposit> getFixedDepositByNumber(
            @PathVariable String fdNumber) {

        return fixedDepositService.getFixedDepositByNumber(fdNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFixedDeposit(
            @PathVariable Long id) {

        fixedDepositService.deleteFixedDeposit(id);

        return ResponseEntity.noContent().build();
    }
}