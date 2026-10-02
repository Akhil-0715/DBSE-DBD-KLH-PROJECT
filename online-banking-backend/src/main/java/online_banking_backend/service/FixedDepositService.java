package online_banking_backend.service;

import online_banking_backend.entity.Account;
import online_banking_backend.entity.FixedDeposit;
import online_banking_backend.repository.AccountRepository;
import online_banking_backend.repository.FixedDepositRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FixedDepositService {

    private final FixedDepositRepository fixedDepositRepository;
    private final AccountRepository accountRepository;

    public FixedDepositService(
            FixedDepositRepository fixedDepositRepository,
            AccountRepository accountRepository) {

        this.fixedDepositRepository = fixedDepositRepository;
        this.accountRepository = accountRepository;
    }

    @Transactional
    public FixedDeposit createFixedDeposit(
            FixedDeposit fixedDeposit) {

        // ================= SOURCE ACCOUNT VALIDATION =================

        if (fixedDeposit.getAccount() == null ||
                fixedDeposit.getAccount().getAccountNumber() == null ||
                fixedDeposit.getAccount()
                        .getAccountNumber()
                        .isBlank()) {

            throw new RuntimeException(
                    "Source account is required"
            );
        }

        Account account =
                accountRepository
                        .findByAccountNumber(
                                fixedDeposit
                                        .getAccount()
                                        .getAccountNumber()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Source account not found"
                                )
                        );

        // ================= ACCOUNT STATUS =================

        if (!"ACTIVE".equalsIgnoreCase(
                account.getStatus())) {

            throw new RuntimeException(
                    "Source account is not active"
            );
        }

        // ================= CUSTOMER VALIDATION =================

        if (account.getCustomer() == null) {

            throw new RuntimeException(
                    "Customer information not found"
            );
        }

        // ================= KYC VALIDATION =================

        if (!"Verified".equalsIgnoreCase(
                account.getCustomer()
                        .getKycStatus())) {

            throw new RuntimeException(
                    "KYC verification is required before creating a Fixed Deposit"
            );
        }

        // ================= AMOUNT VALIDATION =================

        if (fixedDeposit.getPrincipalAmount() == null ||
                fixedDeposit
                        .getPrincipalAmount()
                        .compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException(
                    "FD amount must be greater than zero"
            );
        }

        // ================= INTEREST VALIDATION =================

        if (fixedDeposit.getInterestRate() == null ||
                fixedDeposit
                        .getInterestRate()
                        .compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException(
                    "Interest rate must be greater than zero"
            );
        }

        // ================= TENURE VALIDATION =================

        if (fixedDeposit.getTenureMonths() == null ||
                fixedDeposit.getTenureMonths() <= 0) {

            throw new RuntimeException(
                    "FD tenure must be greater than zero"
            );
        }

        // ================= BALANCE CHECK =================

        BigDecimal principal =
                fixedDeposit.getPrincipalAmount();

        if (account.getBalance()
                .compareTo(principal) < 0) {

            throw new RuntimeException(
                    "Insufficient balance for Fixed Deposit"
            );
        }

        // ================= FD NUMBER =================

        fixedDeposit.setFdNumber(
                "FD-" + UUID.randomUUID()
        );

        // ================= DATES =================

        LocalDate startDate =
                LocalDate.now();

        fixedDeposit.setStartDate(
                startDate
        );

        fixedDeposit.setMaturityDate(
                startDate.plusMonths(
                        fixedDeposit
                                .getTenureMonths()
                )
        );

        // ================= INTEREST CALCULATION =================

        BigDecimal rate =
                fixedDeposit.getInterestRate();

        BigDecimal years =
                BigDecimal.valueOf(
                        fixedDeposit
                                .getTenureMonths()
                ).divide(
                        BigDecimal.valueOf(12),
                        4,
                        RoundingMode.HALF_UP
                );

        BigDecimal interest =
                principal
                        .multiply(rate)
                        .multiply(years)
                        .divide(
                                BigDecimal.valueOf(100),
                                2,
                                RoundingMode.HALF_UP
                        );

        // ================= MATURITY AMOUNT =================

        BigDecimal maturityAmount =
                principal
                        .add(interest)
                        .setScale(
                                2,
                                RoundingMode.HALF_UP
                        );

        fixedDeposit.setMaturityAmount(
                maturityAmount
        );

        // ================= STATUS =================

        fixedDeposit.setStatus(
                "ACTIVE"
        );

        fixedDeposit.setCreatedAt(
                LocalDateTime.now()
        );

        // ================= LINK ACCOUNT =================

        fixedDeposit.setAccount(
                account
        );

        // ================= DEDUCT MONEY =================

        account.setBalance(
                account.getBalance()
                        .subtract(principal)
        );

        accountRepository.save(
                account
        );

        // ================= SAVE FD =================

        return fixedDepositRepository.save(
                fixedDeposit
        );
    }

    // ================= GET ALL =================

    public List<FixedDeposit> getAllFixedDeposits() {

        return fixedDepositRepository.findAll();
    }

    // ================= GET BY ID =================

    public Optional<FixedDeposit> getFixedDepositById(
            Long id) {

        return fixedDepositRepository.findById(id);
    }

    // ================= GET BY FD NUMBER =================

    public Optional<FixedDeposit> getFixedDepositByNumber(
            String fdNumber) {

        return fixedDepositRepository
                .findByFdNumber(fdNumber);
    }

    // ================= DELETE =================

    public void deleteFixedDeposit(Long id) {

        fixedDepositRepository.deleteById(id);
    }
}