interface EmailTemplate {
  subject: string
  html: string
  text: string
}

interface SendEmailParams {
  to: string
  template: EmailTemplate
  variables?: Record<string, string>
}

class EmailService {
  private fromEmail = "noreply@mymidwife.pl"
  private fromName = "MyMidwife"

  private replaceVariables(content: string, variables: Record<string, string> = {}): string {
    let result = content
    Object.entries(variables).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, "g"), value)
    })
    return result
  }

  private getWelcomeTemplate(userType: "patient" | "midwife"): EmailTemplate {
    const isPatient = userType === "patient"

    return {
      subject: `Witaj w MyMidwife! Twoje konto ${isPatient ? "pacjentki" : "położnej"} zostało utworzone`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ec4899, #f97316); color: white; padding: 30px; text-align: center;">
            <h1>🤱 Witaj w MyMidwife!</h1>
            <p>Twoje konto zostało pomyślnie utworzone</p>
          </div>
          
          <div style="padding: 30px; background: #fff;">
            <h2>Cześć {{firstName}}!</h2>
            
            <p>Cieszymy się, że dołączyłaś do społeczności MyMidwife jako ${isPatient ? "pacjentka" : "położna"}. Twoje konto zostało pomyślnie utworzone i możesz już zacząć korzystać z naszej platformy.</p>
            
            <div style="background: #fef7ff; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <h3>${isPatient ? "Co możesz teraz robić:" : "Twoje możliwości jako położna:"}</h3>
              ${
                isPatient
                  ? `
                <ul>
                  <li>Wyszukiwać i kontaktować się z położnymi w Twojej okolicy</li>
                  <li>Zarządzać swoimi wizytami i terminami</li>
                  <li>Prowadzić dziennik objawów i samopoczucia</li>
                  <li>Uzyskiwać dostęp do materiałów edukacyjnych</li>
                  <li>Korzystać z narzędzi zdrowotnych</li>
                </ul>
              `
                  : `
                <ul>
                  <li>Tworzyć i zarządzać swoim profilem zawodowym</li>
                  <li>Otrzymywać zapytania od pacjentek</li>
                  <li>Zarządzać kalendarzem i terminami</li>
                  <li>Udostępniać materiały edukacyjne</li>
                  <li>Budować swoją reputację w społeczności</li>
                </ul>
              `
              }
            </div>
            
            <p><strong>Dane Twojego konta:</strong></p>
            <ul>
              <li>Email: {{email}}</li>
              <li>Typ konta: ${isPatient ? "Pacjentka" : "Położna"}</li>
              <li>Data utworzenia: {{createdAt}}</li>
            </ul>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center; font-size: 14px; color: #6b7280;">
            <p>© 2024 MyMidwife. Wszystkie prawa zastrzeżone.</p>
            <p>Ten email został wysłany na adres {{email}} ponieważ utworzyłaś konto w MyMidwife.</p>
          </div>
        </div>
      `,
      text: `
Witaj w MyMidwife!

Cześć {{firstName}}!

Cieszymy się, że dołączyłaś do społeczności MyMidwife jako ${isPatient ? "pacjentka" : "położna"}. 
Twoje konto zostało pomyślnie utworzone i możesz już zacząć korzystać z naszej platformy.

Dane Twojego konta:
- Email: {{email}}
- Typ konta: ${isPatient ? "Pacjentka" : "Położna"}
- Data utworzenia: {{createdAt}}

© 2024 MyMidwife
      `,
    }
  }

  async sendWelcomeEmail(userEmail: string, userName: string, userType: "patient" | "midwife"): Promise<boolean> {
    try {
      const template = this.getWelcomeTemplate(userType)
      const variables = {
        firstName: userName,
        email: userEmail,
        createdAt: new Date().toLocaleDateString("pl-PL"),
      }

      await this.sendEmail({
        to: userEmail,
        template,
        variables,
      })

      return true
    } catch (error) {
      console.error("Failed to send welcome email:", error)
      return false
    }
  }

  private async sendEmail({ to, template, variables = {} }: SendEmailParams): Promise<void> {
    // Tylko logowanie w konsoli - brak prawdziwego wysyłania emaili
    console.log("📧 ===== EMAIL WYSŁANY =====")
    console.log("📧 Do:", to)
    console.log("📧 Temat:", this.replaceVariables(template.subject, variables))
    console.log("📧 Treść:")
    console.log(this.replaceVariables(template.text, variables))
    console.log("📧 ========================")

    // Symulacja opóźnienia
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
}

// Uproszczona funkcja wysyłania emaili
export async function sendConfirmationEmail(to: string, firstName: string) {
  console.log("📧 ===== EMAIL POTWIERDZAJĄCY =====")
  console.log("📧 Do:", to)
  console.log("📧 Temat: Witamy w MyMidwife!")
  console.log(`📧 Treść: Cześć ${firstName}, dziękujemy za rejestrację w MyMidwife!`)
  console.log("📧 ===============================")
}

export const emailService = new EmailService()
