package online_banking_backend.controller;

import online_banking_backend.entity.BillPayment;
import online_banking_backend.service.BillPaymentService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/bill-payments")
@CrossOrigin(origins = "http://localhost:5173")
public class BillPaymentController {

    private final BillPaymentService billPaymentService;

    public BillPaymentController(
            BillPaymentService billPaymentService) {

        this.billPaymentService = billPaymentService;
    }

    // ================= MAKE BILL PAYMENT =================

    @PostMapping("/pay")
    public ResponseEntity<?> payBill(
            @RequestParam String accountNumber,
            @RequestParam String billType,
            @RequestParam String consumerNumber,
            @RequestParam BigDecimal amount) {

        try {

            BillPayment payment =
                    billPaymentService.payBill(
                            accountNumber,
                            billType,
                            consumerNumber,
                            amount
                    );

            return ResponseEntity.ok(payment);

        } catch (RuntimeException exception) {

            return ResponseEntity
                    .badRequest()
                    .body(exception.getMessage());
        }
    }

    // ================= GET ALL PAYMENTS =================

    @GetMapping
    public ResponseEntity<List<BillPayment>>
    getAllBillPayments() {

        return ResponseEntity.ok(
                billPaymentService
                        .getAllBillPayments()
        );
    }

    // ================= GET ACCOUNT PAYMENTS =================

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<BillPayment>>
    getBillPaymentsByAccountId(
            @PathVariable Long accountId) {

        return ResponseEntity.ok(
                billPaymentService
                        .getBillPaymentsByAccountId(
                                accountId
                        )
        );
    }

    // ================= GET BY REFERENCE =================

    @GetMapping("/reference/{paymentReference}")
    public ResponseEntity<BillPayment>
    getBillPaymentByReference(
            @PathVariable String paymentReference) {

        return billPaymentService
                .getBillPaymentByReference(
                        paymentReference
                )
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }
}