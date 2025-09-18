
'use client'

import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Brain, TrendingUp, Shield, Star, Users, Target, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const { data: session, status } = useSession() || {}
  const router = useRouter()

  useEffect(() => {
    if (session?.user && status === 'authenticated') {
      router.replace('/dashboard')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (session) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container-custom flex items-center justify-between py-4">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gradient">Intimacy Coach</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              Transform Your{' '}
              <span className="text-gradient">Intimate Connection</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto">
              Professional AI-powered coaching platform designed to enhance intimacy and deepen relationships through personalized guidance, progress tracking, and evidence-based techniques.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 px-8 py-4 text-lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Your Journey
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                <Users className="mr-2 h-5 w-5" />
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white/50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Advanced AI Coaching Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience cutting-edge technology designed to enhance your intimate relationships through personalized, privacy-focused coaching.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered Insights",
                description: "Advanced machine learning algorithms provide personalized coaching recommendations based on your unique relationship patterns and goals.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: TrendingUp,
                title: "Progress Tracking",
                description: "Comprehensive analytics and progress monitoring to help you track improvements in communication, satisfaction, and intimacy levels.",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Shield,
                title: "Privacy-First Design",
                description: "All personal data is encrypted and processed with the highest security standards, ensuring your intimate information remains completely private.",
                color: "from-purple-500 to-violet-500"
              },
              {
                icon: Target,
                title: "Personalized Guidance",
                description: "Receive tailored coaching sessions, technique recommendations, and relationship exercises designed specifically for your needs.",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: Heart,
                title: "Arousal Coaching",
                description: "Expert guidance on arousal control, mindfulness techniques, and methods to enhance physical and emotional intimacy.",
                color: "from-pink-500 to-rose-500"
              },
              {
                icon: Star,
                title: "Educational Content",
                description: "Access to comprehensive educational resources, interactive content, and evidence-based techniques from relationship experts.",
                color: "from-indigo-500 to-blue-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full card-hover bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-4`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our scientifically-backed approach combines AI technology with proven relationship therapy techniques.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Personalized Assessment",
                description: "Complete a comprehensive evaluation of your relationship goals, preferences, and areas for growth."
              },
              {
                step: "02",
                title: "AI Coaching Sessions",
                description: "Engage with our advanced AI coach for personalized guidance, feedback, and technique recommendations."
              },
              {
                step: "03",
                title: "Track Your Progress",
                description: "Monitor improvements in intimacy, communication, and satisfaction through detailed analytics and insights."
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-gradient-to-r from-primary to-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground text-lg">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform Your Relationship?
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join thousands of couples who have already discovered the power of AI-guided intimacy coaching.
            </p>
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg bg-white text-primary hover:bg-gray-100">
                <Heart className="mr-2 h-5 w-5" />
                Start Free Trial
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Intimacy Coach</span>
              </div>
              <p className="text-gray-400">
                Professional AI-powered intimacy coaching for enhanced relationships and deeper connections.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>AI Coaching</li>
                <li>Progress Tracking</li>
                <li>Educational Content</li>
                <li>Privacy Protection</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Contact</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Data Protection</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Intimacy Coach. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
