package online_banking_backend.service;

import online_banking_backend.entity.Account;
import online_banking_backend.entity.Customer;
import online_banking_backend.repository.AccountRepository;
import online_banking_backend.repository.CustomerRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final AccountRepository accountRepository;

    public CustomerService(
            CustomerRepository customerRepository,
            AccountRepository accountRepository) {

        this.customerRepository = customerRepository;
        this.accountRepository = accountRepository;
    }

    // ================= CREATE CUSTOMER =================

    @Transactional
    public Customer createCustomer(Customer customer) {

        // Prevent duplicate email registration
        if (customerRepository
                .findByEmail(customer.getEmail())
                .isPresent()) {

            throw new RuntimeException(
                    "An account already exists with this email"
            );
        }

        // New customers start with pending KYC
        customer.setKycStatus("Pending");

        // Save customer first
        Customer savedCustomer =
                customerRepository.save(customer);

        // Generate unique bank account number
        String accountNumber = generateAccountNumber();

        // Automatically create Savings Account
        Account account = new Account();

        account.setAccountNumber(accountNumber);
        account.setAccountType("SAVINGS");
        account.setBalance(BigDecimal.ZERO);
        account.setBranch("KLH Main Branch");
        account.setIfscCode("KLHB0001001");
        account.setStatus("ACTIVE");
        account.setCustomer(savedCustomer);

        accountRepository.save(account);

        return savedCustomer;
    }

    // ================= GENERATE ACCOUNT NUMBER =================

    private String generateAccountNumber() {

        String accountNumber;

        do {
            long number =
                    ThreadLocalRandom.current()
                            .nextLong(
                                    100000000L,
                                    1000000000L
                            );

            accountNumber = "1000" + number;

        } while (
                accountRepository
                        .findByAccountNumber(accountNumber)
                        .isPresent()
        );

        return accountNumber;
    }

    // ================= GET ALL CUSTOMERS =================

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // ================= GET CUSTOMER BY ID =================

    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    // ================= GET CUSTOMER BY EMAIL =================

    public Optional<Customer> getCustomerByEmail(String email) {
        return customerRepository.findByEmail(email);
    }

    // ================= UPDATE CUSTOMER =================

    public Customer updateCustomer(
            Long id,
            Customer updatedCustomer) {

        Customer existingCustomer =
                customerRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Customer not found"
                                ));

        existingCustomer.setFullName(
                updatedCustomer.getFullName()
        );

        existingCustomer.setEmail(
                updatedCustomer.getEmail()
        );

        existingCustomer.setMobileNumber(
                updatedCustomer.getMobileNumber()
        );

        existingCustomer.setPassword(
                updatedCustomer.getPassword()
        );

        existingCustomer.setKycStatus(
                updatedCustomer.getKycStatus()
        );

        return customerRepository.save(existingCustomer);
    }

    // ================= UPDATE KYC STATUS =================

    public Customer updateKycStatus(
            Long id,
            String kycStatus) {

        Customer customer =
                customerRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Customer not found"
                                ));

        customer.setKycStatus(kycStatus);

        return customerRepository.save(customer);
    }

    // ================= DELETE CUSTOMER =================

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }
}