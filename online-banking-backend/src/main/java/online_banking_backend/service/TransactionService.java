package online_banking_backend.service;

import online_banking_backend.entity.Account;
import online_banking_backend.entity.BillPayment;
import online_banking_backend.entity.Transaction;
import online_banking_backend.repository.AccountRepository;
import online_banking_backend.repository.BillPaymentRepository;
import online_banking_backend.repository.TransactionRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final BillPaymentRepository billPaymentRepository;
    private final FraudAlertService fraudAlertService;

    public TransactionService(
            TransactionRepository transactionRepository,
            AccountRepository accountRepository,
            BillPaymentRepository billPaymentRepository,
            FraudAlertService fraudAlertService) {

        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.billPaymentRepository = billPaymentRepository;
        this.fraudAlertService = fraudAlertService;
    }

    public Transaction createTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getAllTransactions() {

        List<Transaction> transactions =
                new ArrayList<>(
                        transactionRepository.findAll()
                );

        /*
         * Add bill payments to the unified transaction history.
         */
        List<BillPayment> billPayments =
                billPaymentRepository.findAll();

        for (BillPayment payment : billPayments) {

            Transaction transaction =
                    convertBillPaymentToTransaction(payment);

            transactions.add(transaction);
        }

        /*
         * Show newest transactions first.
         */
        transactions.sort(
                Comparator.comparing(
                        Transaction::getTransactionDate,
                        Comparator.nullsLast(
                                Comparator.reverseOrder()
                        )
                )
        );

        return transactions;
    }

    public List<Transaction> getTransactionsByAccountId(
            Long accountId) {

        List<Transaction> transactions =
                new ArrayList<>(
                        transactionRepository
                                .findBySenderAccountIdOrReceiverAccountId(
                                        accountId,
                                        accountId
                                )
                );

        /*
         * Get bill payments made from this account.
         */
        List<BillPayment> billPayments =
                billPaymentRepository
                        .findByAccountId(accountId);

        for (BillPayment payment : billPayments) {

            Transaction transaction =
                    convertBillPaymentToTransaction(payment);

            transactions.add(transaction);
        }

        /*
         * Combine fund transfers and bill payments,
         * then show newest first.
         */
        transactions.sort(
                Comparator.comparing(
                        Transaction::getTransactionDate,
                        Comparator.nullsLast(
                                Comparator.reverseOrder()
                        )
                )
        );

        return transactions;
    }

    public Optional<Transaction> getTransactionById(
            Long id) {

        return transactionRepository.findById(id);
    }

    public Optional<Transaction> getTransactionByReference(
            String transactionReference) {

        return transactionRepository
                .findByTransactionReference(
                        transactionReference
                );
    }

    @Transactional
    public Transaction transferFunds(
            String senderAccountNumber,
            String receiverAccountNumber,
            BigDecimal amount,
            String transferMode) {

        Account sender =
                accountRepository
                        .findByAccountNumber(
                                senderAccountNumber
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Sender account not found"
                                )
                        );

        Account receiver =
                accountRepository
                        .findByAccountNumber(
                                receiverAccountNumber
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Receiver account not found"
                                )
                        );

        // ================= BASIC VALIDATION =================

        if (amount == null ||
                amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException(
                    "Transfer amount must be greater than zero"
            );
        }

        if (senderAccountNumber.equals(
                receiverAccountNumber)) {

            throw new RuntimeException(
                    "Sender and receiver accounts cannot be the same"
            );
        }

        // ================= KYC VALIDATION =================

        if (sender.getCustomer() == null) {

            throw new RuntimeException(
                    "Sender customer information not found"
            );
        }

        if (!"Verified".equalsIgnoreCase(
                sender.getCustomer().getKycStatus())) {

            throw new RuntimeException(
                    "KYC verification is required before transferring funds"
            );
        }

        // ================= ACCOUNT VALIDATION =================

        if (!"ACTIVE".equalsIgnoreCase(
                sender.getStatus())) {

            throw new RuntimeException(
                    "Sender account is not active"
            );
        }

        if (!"ACTIVE".equalsIgnoreCase(
                receiver.getStatus())) {

            throw new RuntimeException(
                    "Receiver account is not active"
            );
        }

        if (sender.getBalance().compareTo(amount) < 0) {

            throw new RuntimeException(
                    "Insufficient balance"
            );
        }

        // ================= DEBIT SENDER =================

        sender.setBalance(
                sender.getBalance().subtract(amount)
        );

        // ================= CREDIT RECEIVER =================

        receiver.setBalance(
                receiver.getBalance().add(amount)
        );

        accountRepository.save(sender);
        accountRepository.save(receiver);

        // ================= CREATE TRANSACTION =================

        Transaction transaction =
                new Transaction();

        transaction.setTransactionReference(
                "TXN-" + UUID.randomUUID()
        );

        transaction.setTransactionType(
                "FUND_TRANSFER"
        );

        transaction.setAmount(amount);

        transaction.setTransferMode(
                transferMode
        );

        transaction.setStatus(
                "SUCCESS"
        );

        transaction.setTransactionDate(
                LocalDateTime.now()
        );

        transaction.setSenderAccount(
                sender
        );

        transaction.setReceiverAccount(
                receiver
        );

        Transaction savedTransaction =
                transactionRepository.save(
                        transaction
                );

        // ================= FRAUD CHECK =================

        fraudAlertService.checkForFraud(
                savedTransaction
        );

        return savedTransaction;
    }

    /*
     * Converts a BillPayment into the existing Transaction
     * format so the frontend can display both types together.
     *
     * This does NOT create a second database transaction.
     * It is only used when building transaction history.
     */
    private Transaction convertBillPaymentToTransaction(
            BillPayment payment) {

        Transaction transaction =
                new Transaction();

        transaction.setTransactionReference(
                payment.getPaymentReference()
        );

        transaction.setTransactionType(
                "BILL_PAYMENT"
        );

        transaction.setAmount(
                payment.getAmount()
        );

        /*
         * Store bill type and consumer number together
         * in the existing transferMode field so the
         * current frontend can display useful information.
         */
        transaction.setTransferMode(
                payment.getBillType()
                        + " | Consumer: "
                        + payment.getConsumerNumber()
        );

        transaction.setStatus(
                payment.getStatus()
        );

        transaction.setTransactionDate(
                payment.getPaymentDate()
        );

        /*
         * A bill payment is an outgoing transaction.
         * Therefore the customer's account is treated
         * as the sender.
         */
        transaction.setSenderAccount(
                payment.getAccount()
        );

        transaction.setReceiverAccount(
                null
        );

        return transaction;
    }
}