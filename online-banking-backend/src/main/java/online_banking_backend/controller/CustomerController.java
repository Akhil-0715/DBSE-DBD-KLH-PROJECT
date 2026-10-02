package online_banking_backend.controller;

import online_banking_backend.entity.Customer;
import online_banking_backend.service.CustomerService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    // ================= CREATE CUSTOMER =================

    @PostMapping
    public ResponseEntity<?> createCustomer(
            @RequestBody Customer customer) {

        try {

            Customer createdCustomer =
                    customerService.createCustomer(customer);

            return ResponseEntity.ok(createdCustomer);

        } catch (RuntimeException exception) {

            return ResponseEntity
                    .badRequest()
                    .body(exception.getMessage());
        }
    }

    // ================= GET ALL CUSTOMERS =================

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    // ================= GET CUSTOMER BY ID =================

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(
            @PathVariable Long id) {

        return customerService.getCustomerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ================= GET CUSTOMER BY EMAIL =================

    @GetMapping("/email/{email}")
    public ResponseEntity<Customer> getCustomerByEmail(
            @PathVariable String email) {

        return customerService.getCustomerByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ================= UPDATE CUSTOMER =================

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(
            @PathVariable Long id,
            @RequestBody Customer customer) {

        try {

            return ResponseEntity.ok(
                    customerService.updateCustomer(
                            id,
                            customer
                    )
            );

        } catch (RuntimeException exception) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }

    // ================= UPDATE KYC =================

    @PutMapping("/{id}/kyc")
    public ResponseEntity<?> updateKycStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        try {

            String kycStatus =
                    request.get("kycStatus");

            if (kycStatus == null ||
                    kycStatus.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body("KYC status is required");
            }

            Customer updatedCustomer =
                    customerService.updateKycStatus(
                            id,
                            kycStatus
                    );

            return ResponseEntity.ok(
                    updatedCustomer
            );

        } catch (RuntimeException exception) {

            return ResponseEntity
                    .badRequest()
                    .body(exception.getMessage());
        }
    }

    // ================= DELETE CUSTOMER =================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(
            @PathVariable Long id) {

        customerService.deleteCustomer(id);

        return ResponseEntity.noContent().build();
    }

    // ================= CUSTOMER LOGIN =================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> loginRequest) {

        String email =
                loginRequest.get("email");

        String password =
                loginRequest.get("password");

        Customer customer =
                customerService
                        .getCustomerByEmail(email)
                        .orElse(null);

        if (customer == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Invalid email or password");
        }

        if (!customer.getPassword().equals(password)) {

            return ResponseEntity
                    .badRequest()
                    .body("Invalid email or password");
        }

        Map<String, Object> response =
                new HashMap<>();

        response.put("success", true);
        response.put(
                "message",
                "Login successful"
        );
        response.put(
                "customerId",
                customer.getId()
        );
        response.put(
                "fullName",
                customer.getFullName()
        );
        response.put(
                "email",
                customer.getEmail()
        );
        response.put(
                "mobileNumber",
                customer.getMobileNumber()
        );
        response.put(
                "kycStatus",
                customer.getKycStatus()
        );

        return ResponseEntity.ok(response);
    }
}