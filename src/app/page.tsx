'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Github, Star, GitPullRequest, BarChart3, Zap, TrendingUp, Check, ArrowRight, Eye, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import React from 'react'

export default function LandingPage(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      {/* Header */}
      <header className="w-full flex justify-center px-4 lg:px-6 h-16 items-center border-b">
        <div className="w-full max-w-7xl flex items-center mx-auto">
          <Link className="flex items-center justify-center" href="/">
            <Github className="h-8 w-8 mr-2" />
            <span className="font-bold text-xl">Manik GitHub Analyzer</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
              Features
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
              Pricing
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#about">
              About
            </Link>
          </nav>
          <div className="ml-4 flex gap-2">
            <Button variant="ghost" size="sm">
              Log In
            </Button>
            <Button size="sm">Sign Up</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col items-center justify-center">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex flex-col items-center justify-center">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary" className="mb-4 bg-yellow-400 text-gray-800 hover:bg-yellow-500">
                  <Zap className="w-3 h-3 mr-1" />
                  Powered by Advanced Analytics
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Unlock Deep Insights from
                  <span className="text-primary"> GitHub Repositories</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Get comprehensive analytics, summaries, and real-time updates for any open-source GitHub repository.
                  Make informed decisions with data-driven insights.
                </p>
              </div>
              <div className="space-x-4">
                <Button size="lg" className="h-12 px-8 bg-blue-600 hover:bg-blue-700">
                  Start Free Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8">
                  View Demo
                </Button>
              </div>
              <div className="w-full max-w-4xl mt-12">
                <Image
                  src="/placeholder.svg?height=400&width=800"
                  width={800}
                  height={400}
                  alt="Manik GitHub Analyzer Dashboard"
                  className="mx-auto rounded-lg border shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 flex flex-col items-center justify-center">
          <div className="container px-4 md:px-6 mx-auto flex flex-col items-center justify-center">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 w-full max-w-5xl mx-auto justify-center items-center text-center">
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm text-muted-foreground">Repositories Analyzed</div>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="text-3xl font-bold">5K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 flex flex-col items-center justify-center">
          <div className="container px-4 md:px-6 mx-auto flex flex-col items-center justify-center text-center">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="outline">Features</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything you need to analyze repositories
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our comprehensive suite of tools provides deep insights into any GitHub repository, helping you make
                  informed decisions about open-source projects.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center w-full max-w-5xl mx-auto py-12">
              <Card className="w-full max-w-xs p-6 bg-white shadow rounded-lg">
                <CardHeader className="items-start p-0">
                  <BarChart3 className="h-10 w-10 text-blue-500 mb-2" />
                  <CardTitle className="text-xl font-bold text-left">Repository Summaries</CardTitle>
                  <CardDescription className="text-gray-500 text-left">
                    Get AI-powered summaries of repository purpose, architecture, and key features
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="w-full max-w-xs p-6 bg-white shadow rounded-lg">
                <CardHeader className="items-start p-0">
                  <Star className="h-10 w-10 text-blue-500 mb-2" />
                  <CardTitle className="text-xl font-bold text-left">Star Analytics</CardTitle>
                  <CardDescription className="text-gray-500 text-left">
                    Track star growth, analyze trends, and understand repository popularity over time
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="w-full max-w-xs p-6 bg-white shadow rounded-lg">
                <CardHeader className="items-start p-0">
                  <Eye className="h-10 w-10 text-blue-500 mb-2" />
                  <CardTitle className="text-xl font-bold text-left">Interesting Facts</CardTitle>
                  <CardDescription className="text-gray-500 text-left">
                    Discover unique insights, contributor patterns, and hidden gems within repositories
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="w-full max-w-xs p-6 bg-white shadow rounded-lg">
                <CardHeader className="items-start p-0">
                  <GitPullRequest className="h-10 w-10 text-blue-500 mb-2" />
                  <CardTitle className="text-xl font-bold text-left">Pull Request Insights</CardTitle>
                  <CardDescription className="text-gray-500 text-left">
                    Monitor recent PRs, review patterns, and contribution activity in real-time
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="w-full max-w-xs p-6 bg-white shadow rounded-lg">
                <CardHeader className="items-start p-0">
                  <Clock className="h-10 w-10 text-blue-500 mb-2" />
                  <CardTitle className="text-xl font-bold text-left">Version Updates</CardTitle>
                  <CardDescription className="text-gray-500 text-left">
                    Stay informed about releases, version changes, and update frequencies
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="w-full max-w-xs p-6 bg-white shadow rounded-lg">
                <CardHeader className="items-start p-0">
                  <TrendingUp className="h-10 w-10 text-blue-500 mb-2" />
                  <CardTitle className="text-xl font-bold text-left">Trend Analysis</CardTitle>
                  <CardDescription className="text-gray-500 text-left">
                    Identify trending repositories and emerging technologies in your field
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center justify-center">
          <div className="container px-4 md:px-6 mx-auto flex flex-col items-center justify-center text-center">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="outline">How It Works</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, Fast, Powerful</h2>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12 justify-center">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold">Enter Repository URL</h3>
                <p className="text-muted-foreground">Simply paste any GitHub repository URL into our analyzer</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold">AI Analysis</h3>
                <p className="text-muted-foreground">
                  Our AI processes the repository data and generates comprehensive insights
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold">Get Insights</h3>
                <p className="text-muted-foreground">
                  Receive detailed analytics, summaries, and actionable insights instantly
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 flex flex-col items-center justify-center">
          <div className="container px-4 md:px-6 mx-auto flex flex-col items-center justify-center text-center">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="outline">Pricing</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Choose Your Plan</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Start free and scale as you grow. All plans include our core analytics features.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-8 justify-center">
              {/* Free Plan */}
              <Card className="relative">
                <CardHeader>
                  <CardTitle className="text-2xl">Free</CardTitle>
                  <CardDescription>Perfect for getting started</CardDescription>
                  <div className="text-4xl font-bold">
                    $0<span className="text-lg font-normal text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />5 repository analyses per month
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Basic summaries and insights
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Star count tracking
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Recent PR overview
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">
                    Get Started Free
                  </Button>
                </CardFooter>
              </Card>

              {/* Pro Plan */}
              <Card className="relative border-primary">
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-800 hover:bg-yellow-500">
                  Most Popular
                </Badge>
                <CardHeader>
                  <CardTitle className="text-2xl">Pro</CardTitle>
                  <CardDescription>For serious developers and teams</CardDescription>
                  <div className="text-4xl font-bold">
                    $19<span className="text-lg font-normal text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      100 repository analyses per month
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Advanced AI summaries
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Detailed analytics dashboard
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Historical trend analysis
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Email notifications
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      API access
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Start Pro Trial</Button>
                </CardFooter>
              </Card>

              {/* Enterprise Plan */}
              <Card className="relative">
                <CardHeader>
                  <CardTitle className="text-2xl">Enterprise</CardTitle>
                  <CardDescription>For large teams and organizations</CardDescription>
                  <div className="text-4xl font-bold">
                    $99<span className="text-lg font-normal text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Unlimited repository analyses
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Custom AI models
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Team collaboration tools
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Priority support
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Custom integrations
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      SLA guarantee
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">
                    Contact Sales
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center justify-center">
          <div className="container px-4 md:px-6 mx-auto flex flex-col items-center justify-center text-center">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to analyze your first repository?
                </h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of developers who trust Manik GitHub Analyzer for their repository insights.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2 mx-auto">
                <form className="flex gap-2">
                  <Input type="url" placeholder="Enter GitHub repository URL" className="flex-1" />
                  <Button type="submit">Analyze</Button>
                </form>
                <p className="text-xs text-muted-foreground">Start with our free plan. No credit card required.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        {/* <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm text-muted-foreground">Repositories Analyzed</div>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="text-3xl font-bold">5K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>
        </section> */}
      </main>

      {/* Footer */}
      <footer className="w-full flex justify-center py-6 items-center px-4 md:px-6 border-t">
        <div className="w-full max-w-7xl flex flex-col sm:flex-row gap-2 items-center mx-auto">
          <p className="text-xs text-muted-foreground">© 2024 Manik GitHub Analyzer. All rights reserved.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Terms of Service
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Privacy Policy
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
