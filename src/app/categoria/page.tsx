'use client'

import { useEffect, useState } from 'react'
import { Calendar, Music, Theater, Film } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Event = {
  id: number
  title: string
  category: string
  date: string
}

const categoryIcons = {
  teatro: Theater,
  deportes: depo,
  musica: Music,
  cine: Film,
  teatro: Film,
}

const categories = [
  { value: 'all', label: 'Todas' },
  { value: 'musica', label: 'Música' },
  { value: 'teatro', label: 'Teatro' },
  { value: 'cine', label: 'Cine' },
  { value: 'cine', label: 'Cine' },
]

export default function Component() {
  const [events, setEvents] = useState<Event[]>([])
  const [category, setCategory] = useState('all')

  useEffect(() => {
    async function fetchEvents() {
      const res = await fetch(`/api/events?category=${category}`)
      const data = await res.json()
      setEvents(data)
    }
    fetchEvents()
  }, [category])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Eventos</h1>
      
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={category === cat.value ? "default" : "outline"}
            onClick={() => setCategory(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => {
          const IconComponent = categoryIcons[event.category as keyof typeof categoryIcons] || Calendar
          return (
            <Card key={event.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {event.title}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{event.category}</div>
                <p className="text-xs text-muted-foreground">
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}