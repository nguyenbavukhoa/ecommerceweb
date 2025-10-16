package com.e_commerce.service.email.impl;

import com.e_commerce.entity.account.Account;
import com.e_commerce.enums.OrderStatus;
import com.e_commerce.service.account.AccountService;
import com.e_commerce.service.account.TokenService;
import com.e_commerce.service.email.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

@Service
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender javaMailSender;
    private final String fromEmail ;
    private final AccountService accountService;
    private final TokenService tokenService;

    private final int maxAttempts;

    public EmailServiceImpl(JavaMailSender javaMailSender,@Value("${spring.mail.username}") String fromEmail, AccountService accountService, TokenService tokenService, @Value("${spring.otp.max-attempts}") int maxAttempts) {
        this.maxAttempts = maxAttempts;
        this.tokenService = tokenService;
        this.accountService = accountService;
        this.javaMailSender = javaMailSender;
        this.fromEmail = fromEmail;
    }

    @Async("otpTaskExecutor")
    @Override
    public void sendEmailOTP(String email, String otp, int otpExpirationMinutes) {
        String subject = "Password Reset OTP - SGU Enterprise";
        String body = getOtpEmailContent(email, otp, maxAttempts);
        sendEmail(email, subject, body);
    }

    private String getOtpEmailContent(String email, String otp, int expiryMinutes) {
        return """
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #2c3e50; margin-bottom: 20px;">Password Reset Request</h2>
            
            <p>Dear User,</p>
            
            <p>We received a request to reset your password for your SGU Enterprise account associated with <strong>%s</strong>.</p>
            
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border-left: 4px solid #3498db; margin: 20px 0;">
                <h3 style="color: #2c3e50; margin-bottom: 10px;">Your OTP Code:</h3>
                <div style="font-size: 32px; font-weight: bold; color: #3498db; letter-spacing: 5px; text-align: center; padding: 15px; background-color: #f1f3f4; border-radius: 4px;">
                    %s
                </div>
            </div>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 4px; border-left: 4px solid #ffc107; margin: 20px 0;">
                <p style="margin: 0; color: #856404;"><strong>Important:</strong></p>
                <ul style="margin: 10px 0; color: #856404;">
                    <li>This OTP will expire in <strong>%d minutes</strong></li>
                    <li>You have a maximum of <strong>5 attempts</strong> to enter the correct OTP</li>
                    <li>Do not share this OTP with anyone</li>
                </ul>
            </div>
            
            <p>If you did not request this password reset, please ignore this email. Your password will remain unchanged.</p>
            
            <p>For security reasons, please do not reply to this email. If you need assistance, please contact our support team.</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #7f8c8d; font-size: 14px;">
                Best regards,<br/>
                IT Support Team<br/>
                SGU Enterprise Information System
            </p>
        </div>
    </body>
    </html>
    """.formatted(email, otp, expiryMinutes);
    }

    private String getPaymentSuccessEmailContent(String customerName, String orderId, String transactionId, BigDecimal amount) {
        return """
                <html>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
                  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <div style="background: #007bff; padding: 20px; color: white; text-align: center;">
                      <h2 style="margin: 0;">Payment Successful</h2>
                    </div>
                    <div style="padding: 20px; color: #2c3e50;">
                      <p>Dear <strong>%s</strong>,</p>
                      <p>We have successfully received your payment for order <strong>#%s</strong>.</p>
                      <p><strong>Transaction ID:</strong> %s</p>
                      <p><strong>Amount Paid:</strong> %s VND</p>
                      <p>Thank you for shopping with us!</p>
                    </div>
                    <div style="background: #f8f9fa; text-align: center; padding: 15px; font-size: 13px; color: #7f8c8d;">
                      Best regards,<br/>SGU Enterprise Finance Team
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(customerName, orderId, transactionId, amount);
    }

    private String getPaymentFailedEmailContent(String customerName, String orderId, String transactionId) {
        return """
                <html>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
                  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <div style="background: #dc3545; padding: 20px; color: white; text-align: center;">
                      <h2 style="margin: 0;">Payment Failed</h2>
                    </div>
                    <div style="padding: 20px; color: #2c3e50;">
                      <p>Dear <strong>%s</strong>,</p>
                      <p>Your payment attempt for order <strong>#%s</strong> has failed.</p>
                      <p><strong>Transaction ID:</strong> %s</p>
                      <p>Please try again or contact support if you need assistance.</p>
                    </div>
                    <div style="background: #f8f9fa; text-align: center; padding: 15px; font-size: 13px; color: #7f8c8d;">
                      Best regards,<br/>SGU Enterprise Finance Team
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(customerName, orderId, transactionId);
    }

    @Async
    @Override
    public void sendPaymentSuccessEmail(String customerEmail, String customerName, String orderId, String transactionId, BigDecimal amount) {
        String subject = "Payment Successful - Order #" + orderId;
        String body = getPaymentSuccessEmailContent(customerName, orderId, transactionId, amount);
        sendEmail(customerEmail, subject, body);
    }

    @Async
    @Override
    public void sendPaymentFailedEmail(String customerEmail, String customerName, String orderId, String transactionId) {
        String subject = "Payment Failed - Order #" + orderId;
        String body = getPaymentFailedEmailContent(customerName, orderId, transactionId);
        sendEmail(customerEmail, subject, body);
    }

    private String formatAmount(BigDecimal amount) {
        NumberFormat formatter = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
        return formatter.format(amount);
    }

    // Completed
    private String getOrderConfirmationEmailContent(String customerName, String orderId, String totalAmount) {
        return """
<html>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <div style="background: #28a745; padding: 20px; color: white; text-align: center;">
      <h2 style="margin: 0;">Order Confirmation</h2>
    </div>
    <div style="padding: 20px; color: #2c3e50;">
      <p>Dear <strong>%s</strong>,</p>
      <p>Thank you for your order! Your order <strong>#%s</strong> has been placed successfully.</p>
      <p><strong>Total Amount:</strong> %s VND</p>
      <p>We will notify you once your order is shipped.</p>
      <p style="margin-top: 20px; font-size: 14px; color: #7f8c8d;">If you have any questions, please contact our support team.</p>
    </div>
    <div style="background: #f8f9fa; text-align: center; padding: 15px; font-size: 13px; color: #7f8c8d;">
      Best regards,<br/>SGU Enterprise Customer Service
    </div>
  </div>
</body>
</html>
""".formatted(customerName, orderId, totalAmount);
    }


    // In Progress
    private String getOrderCanceledEmailContent(String customerName, String orderId) {
        return """
                <html>
                <body>
                  <p>Dear <strong>%s</strong>,</p>
                  <p>Your order <strong>#%s</strong> has been canceled.</p>
                  <p>If this was a mistake, please contact support.</p>
                </body>
                </html>
                """.formatted(customerName, orderId);
    }

    private String getOrderInProgressEmailContent(String customerName, String orderId) {
        return """
                <html>
                <body style="font-family: Arial, sans-serif;">
                  <h2>Order In Progress</h2>
                  <p>Dear <strong>%s</strong>,</p>
                  <p>Your order <strong>#%s</strong> is currently being processed by our team.</p>
                  <p>We’ll notify you once it’s shipped.</p>
                </body>
                </html>
                """.formatted(customerName, orderId);
    }

    // Completed
    private String getOrderCompletedEmailContent(String customerName, String orderId) {
        return """
                <html>
                <body style="font-family: Arial, sans-serif;">
                  <h2>Order Completed</h2>
                  <p>Dear <strong>%s</strong>,</p>
                  <p>Your order <strong>#%s</strong> has been completed.</p>
                  <p>Thank you for trusting and shopping with us!</p>
                </body>
                </html>
                """.formatted(customerName, orderId);
    }

    // Rejected
    private String getOrderRejectedEmailContent(String customerName, String orderId) {
        return """
                <html>
                <body style="font-family: Arial, sans-serif;">
                  <h2>Order Rejected</h2>
                  <p>Dear <strong>%s</strong>,</p>
                  <p>Unfortunately, your order <strong>#%s</strong> has been rejected due to unforeseen reasons.</p>
                  <p>Please contact our support team for more information.</p>
                </body>
                </html>
                """.formatted(customerName, orderId);
    }

    private String getGenericOrderStatusEmail(String customerName, String orderId, String statusDescription) {
        return """
                <html>
                <body style="font-family: Arial, sans-serif;">
                  <h2>Order Update</h2>
                  <p>Dear <strong>%s</strong>,</p>
                  <p>Your order <strong>#%s</strong> status has been updated: <strong>%s</strong>.</p>
                </body>
                </html>
                """.formatted(customerName, orderId, statusDescription);
    }

    @Async
    @Override
    public void sendOrderStatusEmail(OrderStatus status, String customerEmail, String customerName, String orderId, BigDecimal amount) {
        String subject = "Order Update - #" + orderId;
        String body;

        switch (status) {
            case CONFIRMED -> body = getOrderConfirmationEmailContent(customerName, orderId, formatAmount(amount));
            case IN_PROGRESS -> body = getOrderInProgressEmailContent(customerName, orderId);
            case COMPLETED -> body = getOrderCompletedEmailContent(customerName, orderId);
            case CANCELLED -> body = getOrderCanceledEmailContent(customerName, orderId);
            case REJECTED -> body = getOrderRejectedEmailContent(customerName, orderId);
            default -> body = getGenericOrderStatusEmail(customerName, orderId, status.name());
        }

        sendEmail(customerEmail, subject, body);
    }

    @Async
    @Override
    public void sendRegistrationUserConfirm(String email) {
        Account account = accountService.getAccountByEmail(email);
        String token = tokenService.getTokenByAccountIdAndTokenType(account.getId(), "EMAIL_VERIFICATION").getToken();
        String confirmationUrl = "http://localhost:8080/api/v1/auth/activate?token=" + token;

        String subject = "Xác Nhận Đăng Ký Tài Khoản";
        String body = getRegistrationEmailContent(confirmationUrl);
        sendEmail(email, subject, body);
    }

    private String getRegistrationEmailContent(String confirmationUrl) {
        return """
                <html>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
                  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <div style="background: #17a2b8; padding: 20px; color: white; text-align: center;">
                      <h2 style="margin: 0;">Welcome to SGU Enterprise!</h2>
                    </div>
                    <div style="padding: 20px; color: #2c3e50;">
                      <p>Thank you for registering with SGU Enterprise. Please confirm your email address by clicking the link below:</p>
                      <p style="text-align: center; margin: 30px 0;">
                        <a href="%s" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Confirm Email</a>
                      </p>
                      <p>If you did not create an account, please ignore this email.</p>
                    </div>
                    <div style="background: #f8f9fa; text-align: center; padding: 15px; font-size: 13px; color: #7f8c8d;">
                      Best regards,<br/>SGU Enterprise Team
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(confirmationUrl);
    }




    private void sendEmail(final String toEmail,final  String subject,final String body) {
        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setFrom(fromEmail);
            helper.setText(body, true);

            javaMailSender.send(message);
            log.info("Email successfully sent to {}", toEmail);

        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error while sending email: {}", e.getMessage(), e);
        }
    }
}
