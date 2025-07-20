"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, DollarSign, Clock } from 'lucide-react'

interface Service {
  _id: string
  name: string
  description: string
  duration: number
  price: number
  createdAt: string
}

const AdminServices = () => {
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAddingService, setIsAddingService] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    price: ""
  })

  // Check if user is admin using role field
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    
    if (!isAdmin) {
      router.push('/dashboard')
      return
    }

    fetchServices()
  }, [isLoggedIn, isAdmin, router])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/services')
      
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      } else {
        setError('Failed to fetch services')
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.description || !formData.duration || !formData.price) {
      setError('All fields are required')
      return
    }

    try {
      const url = editingService ? `/api/services/${editingService._id}` : '/api/services'
      const method = editingService ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          duration: parseInt(formData.duration),
          price: parseFloat(formData.price)
        })
      })

      if (response.ok) {
        await fetchServices() // Refresh the list
        resetForm()
        setError('')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to save service')
      }
    } catch (error) {
      console.error('Error saving service:', error)
      setError('Network error occurred')
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description,
      duration: service.duration.toString(),
      price: service.price.toString()
    })
    setIsAddingService(true)
  }

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchServices()
      } else {
        setError('Failed to delete service')
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      setError('Network error occurred')
    }
  }

  const resetForm = () => {
    setFormData({ name: "", description: "", duration: "", price: "" })
    setIsAddingService(false)
    setEditingService(null)
  }

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Services Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Add and manage services for your appointment booking system
            </p>
          </div>
          <Button 
            onClick={() => setIsAddingService(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Service
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Services List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Existing Services ({services.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p>Loading services...</p>
                  </div>
                ) : services.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No services added yet.</p>
                    <Button onClick={() => setIsAddingService(true)}>
                      Add Your First Service
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div
                        key={service._id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{service.name}</h3>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(service)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(service._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                          {service.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {service.duration} minutes
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            ${service.price}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Add/Edit Service Form */}
          {isAddingService && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingService ? 'Edit Service' : 'Add New Service'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Service Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Hair Cut, Massage, Consultation"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Brief description of the service"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="30"
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="50.00"
                        min="0"
                        required
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1">
                        {editingService ? 'Update Service' : 'Add Service'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminServices
