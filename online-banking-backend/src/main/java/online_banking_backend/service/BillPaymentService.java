package online_banking_backend.service;

import online_banking_backend.entity.Account;
import online_banking_backend.entity.BillPayment;
import online_banking_backend.repository.AccountRepository;
import online_banking_backend.repository.BillPaymentRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BillPaymentService {

    private final BillPaymentRepository billPaymentRepository;
    private final AccountRepository accountRepository;

    public BillPaymentService(
            BillPaymentRepository billPaymentRepository,
            AccountRepository accountRepository) {

        this.billPaymentRepository = billPaymentRepository;
        this.accountRepository = accountRepository;
    }

    @Transactional
    public BillPayment payBill(
            String accountNumber,
            String billType,
            String consumerNumber,
            BigDecimal amount) {

        // ================= BASIC VALIDATION =================

        if (accountNumber == null ||
                accountNumber.isBlank()) {

            throw new RuntimeException(
                    "Account number is required");
        }

        if (billType == null ||
                billType.isBlank()) {

            throw new RuntimeException(
                    "Bill type is required");
        }

        if (consumerNumber == null ||
                consumerNumber.isBlank()) {

            throw new RuntimeException(
                    "Consumer number is required");
        }

        if (amount == null ||
                amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException(
                    "Bill amount must be greater than zero");
        }

        // ================= FIND ACCOUNT =================

        Account account =
                accountRepository
                        .findByAccountNumber(accountNumber)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Account not found"));

        // ================= KYC VALIDATION =================

        if (account.getCustomer() == null) {

            throw new RuntimeException(
                    "Customer information not found");
        }

        if (!"Verified".equalsIgnoreCase(
                account.getCustomer()
                        .getKycStatus())) {

            throw new RuntimeException(
                    "KYC verification is required before making bill payments");
        }

        // ================= ACCOUNT VALIDATION =================

        if (!"ACTIVE".equalsIgnoreCase(
                account.getStatus())) {

            throw new RuntimeException(
                    "Account is not active");
        }

        // ================= BALANCE VALIDATION =================

        if (account.getBalance()
                .compareTo(amount) < 0) {

            throw new RuntimeException(
                    "Insufficient balance");
        }

        // ================= DEBIT ACCOUNT =================

        account.setBalance(
                account.getBalance()
                        .subtract(amount)
        );

        accountRepository.save(account);

        // ================= CREATE BILL PAYMENT =================

        BillPayment payment =
                new BillPayment();

        payment.setPaymentReference(
                "BILL-" + UUID.randomUUID()
        );

        payment.setBillType(
                billType
        );

        payment.setConsumerNumber(
                consumerNumber
        );

        payment.setAmount(
                amount
        );

        payment.setStatus(
                "SUCCESS"
        );

        payment.setPaymentDate(
                LocalDateTime.now()
        );

        payment.setAccount(
                account
        );

        return billPaymentRepository.save(
                payment
        );
    }

    public List<BillPayment> getAllBillPayments() {

        return billPaymentRepository.findAll();
    }

    public List<BillPayment> getBillPaymentsByAccountId(
            Long accountId) {

        return billPaymentRepository
                .findByAccountId(accountId);
    }

    public Optional<BillPayment> getBillPaymentByReference(
            String paymentReference) {

        return billPaymentRepository
                .findByPaymentReference(
                        paymentReference
                );
    }
}