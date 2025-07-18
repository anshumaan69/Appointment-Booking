"use client"

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Book Your Appointments
            <span className="text-blue-600"> Seamlessly</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Schedule appointments with ease. Our simple and intuitive booking system 
            makes it easy to manage your time and appointments.
          </p>
          {user ? (
            <div className="space-x-4">
              <Link href="/book-appointment">
                <Button size="lg" className="text-lg px-8 py-3">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book New Appointment
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  View Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-x-4">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8 py-3">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Easy Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Book appointments in just a few clicks. Our intuitive interface 
                makes scheduling simple and fast.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Real-time Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                See available time slots in real-time. No more double bookings 
                or scheduling conflicts.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>24/7 Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Get help whenever you need it with our AI-powered chatbot 
                and dedicated support team.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How it Works Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">1</span>
              </div>
              <h3 className="font-semibold mb-2">Sign Up</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Create your account in seconds
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-300">2</span>
              </div>
              <h3 className="font-semibold mb-2">Choose Service</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Select from available services
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-300">3</span>
              </div>
              <h3 className="font-semibold mb-2">Pick Time</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Choose your preferred date and time
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 dark:bg-orange-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-orange-600 dark:text-orange-300 h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Confirm</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Get instant confirmation
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {!user && (
          <div className="text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Join thousands of satisfied users who trust our appointment booking system.
            </p>
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-3">
                Create Free Account
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
