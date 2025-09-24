
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Data Collection and Use</h2>
              <p className="leading-relaxed mb-4">
                We collect only the minimum data necessary to provide our intimacy coaching services. This includes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Account information (email, name, preferences)</li>
                <li>Session data and progress tracking</li>
                <li>AI coaching interactions (encrypted and anonymized)</li>
                <li>Usage analytics (anonymized)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Video and Image Analysis</h2>
              <p className="leading-relaxed mb-4">
                For premium video analysis features:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All video processing happens locally on your device</li>
                <li>No video content is uploaded to our servers</li>
                <li>Only analysis results (numerical data) are stored</li>
                <li>You can delete all analysis data at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Data Security</h2>
              <p className="leading-relaxed">
                We use industry-standard encryption and security practices to protect your intimate data. All communications are encrypted end-to-end, and sensitive data is stored with additional layers of protection.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights</h2>
              <p className="leading-relaxed mb-4">
                You have complete control over your data:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access all your stored data</li>
                <li>Delete your account and all associated data</li>
                <li>Export your progress and session history</li>
                <li>Opt out of data collection at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact</h2>
              <p className="leading-relaxed">
                For any privacy concerns or requests, contact us at privacy@intimacycoach.app
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
