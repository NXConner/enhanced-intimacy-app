
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Service Overview</h2>
              <p className="leading-relaxed">
                Intimacy Coach provides AI-powered relationship guidance, educational content, and coaching tools designed to help couples enhance their intimate relationships. Our services are intended for educational and self-improvement purposes only.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Age and Eligibility</h2>
              <p className="leading-relaxed mb-4">
                You must be at least 18 years old to use our services. By using our platform, you confirm that you meet this age requirement and have the legal capacity to enter into this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Appropriate Use</h2>
              <p className="leading-relaxed mb-4">
                Our platform is designed for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Educational purposes about intimate relationships</li>
                <li>Personal development and self-improvement</li>
                <li>Communication enhancement between consenting partners</li>
                <li>Mindfulness and wellness practices</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Medical Disclaimer</h2>
              <p className="leading-relaxed">
                Our AI coaching and guidance are not a substitute for professional medical, psychological, or therapeutic advice. If you have medical concerns or relationship issues requiring professional intervention, please consult qualified healthcare providers or licensed therapists.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Privacy and Consent</h2>
              <p className="leading-relaxed mb-4">
                By using video analysis features:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You consent to AI analysis of your video content</li>
                <li>You confirm all participants have provided informed consent</li>
                <li>You understand processing happens locally for privacy protection</li>
                <li>You can withdraw consent and delete data at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Subscription and Billing</h2>
              <p className="leading-relaxed mb-4">
                Premium features require a subscription:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Billing occurs monthly or annually as selected</li>
                <li>You can cancel your subscription at any time</li>
                <li>Refunds are provided according to our refund policy</li>
                <li>Free features remain available after cancellation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Limitation of Liability</h2>
              <p className="leading-relaxed">
                We provide our services "as is" and cannot guarantee specific outcomes. We are not liable for decisions you make based on our AI guidance or educational content. Always use your judgment and consult professionals when needed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact</h2>
              <p className="leading-relaxed">
                For questions about these terms, contact us at support@intimacycoach.app
              </p>
            </section>
          </div>

          <div className="mt-12 p-4 bg-white/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Last updated: September 17, 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
