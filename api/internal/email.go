package internal

import (
	"crypto/tls"
	"fmt"
	"log/slog"
	"net/smtp"
	"os"
	"strings"
)

type EmailService struct {
	host     string
	port     string
	username string
	password string
	from     string
	logger   *slog.Logger
}

func NewEmailService(logger *slog.Logger) *EmailService {
	return &EmailService{
		host:     os.Getenv("SMTP_HOST"),
		port:     os.Getenv("SMTP_PORT"),
		username: os.Getenv("SMTP_USER"),
		password: os.Getenv("SMTP_PASSWORD"),
		from:     os.Getenv("SMTP_FROM"),
		logger:   logger,
	}
}

func (s *EmailService) SendEmail(to string, subject string, body string) error {
	addr := fmt.Sprintf("%s:%s", s.host, s.port)
	msg := fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\nMIME-version: 1.0;\r\nContent-Type: text/html; charset=\"UTF-8\";\r\n\r\n%s",
		s.from, to, subject, body)

	s.logger.Info("Starting email sending", "to", to, "subject", subject, "host", s.host)

	// Connexion TLS implicite (port 465 / SMTPS)
	tlsConfig := &tls.Config{
		ServerName: s.host,
	}
	conn, err := tls.Dial("tcp", addr, tlsConfig)
	if err != nil {
		s.logger.Error("Failed to connect to SMTP server (TLS)", "addr", addr, "error", err.Error())
		return err
	}

	c, err := smtp.NewClient(conn, s.host)
	if err != nil {
		err := conn.Close()
		if err != nil {
			s.logger.Error("Failed to create SMTP client", "error", err.Error())
			return err
		}
		return err
	}
	defer func() {
		_ = c.Quit()
	}()

	// Authentification si nécessaire
	if s.username != "" && s.password != "" {
		s.logger.Debug("Authenticating with SMTP server", "user", s.username)
		auth := smtp.PlainAuth("", s.username, s.password, s.host)
		if err = c.Auth(auth); err != nil {
			s.logger.Error("SMTP authentication failed", "error", err.Error())
			return err
		}
	}

	// Définition de l'expéditeur et du destinataire
	if err = c.Mail(s.from); err != nil {
		s.logger.Error("Failed to set SMTP sender", "from", s.from, "error", err.Error())
		return err
	}
	if err = c.Rcpt(to); err != nil {
		s.logger.Error("Failed to set SMTP recipient", "to", to, "error", err.Error())
		return err
	}

	// Envoi du corps du message
	s.logger.Debug("Sending email data", "to", to)
	w, err := c.Data()
	if err != nil {
		s.logger.Error("Failed to open SMTP data writer", "error", err.Error())
		return err
	}
	_, err = w.Write([]byte(msg))
	if err != nil {
		s.logger.Error("Failed to write email data", "error", err.Error())
		return err
	}
	err = w.Close()
	if err != nil {
		s.logger.Error("Failed to close SMTP data writer", "error", err.Error())
		return err
	}

	s.logger.Info("Email sent successfully", "to", to)
	return nil
}

func (s *EmailService) SendPasswordResetEmail(to string, token string) error {
	resetLink := fmt.Sprintf("%s/reset-password?token=%s", os.Getenv("FRONTEND_URL"), token)
	subject := "Reset your password"
	const bodyTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .container {
            background-color: #f9f9f9;
            border-radius: 5px;
            padding: 20px;
        }

        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: white !important;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }

        .footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: #666;
        }
    </style>
</head>
<body>
<div class="container">
    <h2>Password Reset Request</h2>
    <p>Hello,</p>
    <p>We received a request to reset your password for your TempestBoard account. Click the button below to reset
        your password:</p>

    <a href="{{ reset_link }}" class="button">Reset Password</a>
    <p>This link will expire in {{ link_expiry_min }} minutes for security reasons.</p>

    <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>

    <div class="footer">
        <p>Best regards,<br>The TempestBoard Team</p>
    </div>
</div>
</body>
</html>`

	body := strings.ReplaceAll(bodyTemplate, "{{ reset_link }}", resetLink)
	body = strings.ReplaceAll(body, "{{ link_expiry_min }}", "60")

	return s.SendEmail(to, subject, body)
}
