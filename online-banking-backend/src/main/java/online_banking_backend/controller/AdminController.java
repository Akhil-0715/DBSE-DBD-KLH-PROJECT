package online_banking_backend.controller;

import online_banking_backend.repository.AccountRepository;
import online_banking_backend.repository.CustomerRepository;
import online_banking_backend.repository.FraudAlertRepository;
import online_banking_backend.repository.TransactionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private static final String ADMIN_EMAIL = "admin@onlinebank.com";
    private static final String ADMIN_PASSWORD = "admin123";

    private final CustomerRepository customerRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final FraudAlertRepository fraudAlertRepository;

    public AdminController(
            CustomerRepository customerRepository,
            AccountRepository accountRepository,
            TransactionRepository transactionRepository,
            FraudAlertRepository fraudAlertRepository) {

        this.customerRepository = customerRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.fraudAlertRepository = fraudAlertRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> loginRequest) {

        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        if (ADMIN_EMAIL.equals(email) && ADMIN_PASSWORD.equals(password)) {

            Map<String, Object> response = new HashMap<>();

            response.put("success", true);
            response.put("message", "Admin login successful");
            response.put("email", email);
            response.put("role", "ADMIN");

            return ResponseEntity.ok(response);
        }

        Map<String, Object> response = new HashMap<>();

        response.put("success", false);
        response.put("message", "Invalid admin credentials");

        return ResponseEntity.badRequest().body(response);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardSummary() {

        Map<String, Object> response = new HashMap<>();

        response.put("totalCustomers", customerRepository.count());
        response.put("totalAccounts", accountRepository.count());
        response.put("totalTransactions", transactionRepository.count());
        response.put("totalFraudAlerts", fraudAlertRepository.count());

        return ResponseEntity.ok(response);
    }
}