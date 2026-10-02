package online_banking_backend.controller;

import online_banking_backend.entity.Transaction;
import online_banking_backend.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public Transaction createTransaction(
            @RequestBody Transaction transaction) {

        return transactionService.createTransaction(transaction);
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transferFunds(
            @RequestParam String senderAccountNumber,
            @RequestParam String receiverAccountNumber,
            @RequestParam BigDecimal amount,
            @RequestParam String transferMode) {

        try {
            Transaction transaction =
                    transactionService.transferFunds(
                            senderAccountNumber,
                            receiverAccountNumber,
                            amount,
                            transferMode
                    );

            return ResponseEntity.ok(transaction);

        } catch (RuntimeException exception) {

            return ResponseEntity
                    .badRequest()
                    .body(exception.getMessage());
        }
    }

    @GetMapping
    public List<Transaction> getAllTransactions() {

        return transactionService.getAllTransactions();
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<Transaction>> getTransactionsByAccountId(
            @PathVariable Long accountId) {

        return ResponseEntity.ok(
                transactionService.getTransactionsByAccountId(accountId)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(
            @PathVariable Long id) {

        return transactionService.getTransactionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/reference/{transactionReference}")
    public ResponseEntity<Transaction> getTransactionByReference(
            @PathVariable String transactionReference) {

        return transactionService
                .getTransactionByReference(transactionReference)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}