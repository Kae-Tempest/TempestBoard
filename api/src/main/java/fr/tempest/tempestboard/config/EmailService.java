package fr.tempest.tempestboard.config;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.Map;

@Service
public class EmailService {

    @Autowired
    private static JavaMailSender mailSender;

    @Autowired
    private static SpringTemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private static String fromEmail;

    public static void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    public static void sendTemplateEmail(String to, String subject, String templateName, Map<String, Object> templateModel)
            throws MessagingException {
        Context context = new Context();
        context.setVariables(templateModel);

        String htmlContent = templateEngine.process(templateName, context);
        sendHtmlEmail(to, subject, htmlContent);
    }

    public static void sendProjectInvitation(String to, String projectName, String invitationLink)
            throws MessagingException {
        Map<String, Object> templateModel = Map.of(
                "project_name", projectName,
                "invitation_link", invitationLink
        );

        sendTemplateEmail(to, projectName + " - TempestBoard Project Invitation",
                "project-invitation", templateModel);
    }

    public static void sendResetPassword(String to, String resetLink)
            throws MessagingException {
        Map<String, Object> templateModel = Map.of(
                "reset_link", resetLink
        );

        sendTemplateEmail(to, "TempestBoard Reset Password",
                "project-invitation", templateModel);
    }
}
