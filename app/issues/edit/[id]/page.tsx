"use client"

import { LocationPickerMap } from "@/components/LocationPickerMap"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import "leaflet/dist/leaflet.css"
import { ArrowLeft, ImagePlus, Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"




export default function EditIssuePage() {
    const { id } = useParams()
    const router = useRouter()

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [status, setStatus] = useState("")
    const [location, setLocation] = useState("")
    const [lat, setLat] = useState<number | null>(null)
    const [lng, setLng] = useState<number | null>(null)
    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const api_url = process.env.NEXT_PUBLIC_SERVER_URL

    const setLatLng = (lat: number, lng: number) => {
        setLat(lat)
        setLng(lng)
    }

    useEffect(() => {
        async function fetchIssue() {
            try {
                const res = await fetch(`${api_url}/issue/${id}`)
                const data = await res.json()

                setTitle(data.title)
                setDescription(data.description)
                setCategory(data.category)
                setStatus(data.status)
                setLocation(data.location)
                setLat(data.latitude)
                setLng(data.longitude)
                setImagePreview(data.imageUrl)
            } catch (err) {
                console.error("Failed to load issue:", err)
            }
        }
        fetchIssue()
    }, [id])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0]
            setImage(file)

            const reader = new FileReader()
            reader.onload = (event) => {
                setImagePreview(event.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!title || !description || !category || !location) {
            toast.error("Please fill all required fields")
            return
        }

        setIsSubmitting(true)

        try {
            let imageUrl = imagePreview

            if (image) {
                const formData = new FormData()
                formData.append("file", image)
                formData.append("upload_preset", "unsigned_preset")

                const cloudRes = await fetch(
                    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    {
                        method: "POST",
                        body: formData,
                    }
                )
                const data = await cloudRes.json()
                if (!data.secure_url) throw new Error("Image upload failed")
                imageUrl = data.secure_url
            }

            const res = await fetch(`${api_url}/issue/update/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description,
                    category,
                    status,
                    location,
                    latitude: lat,
                    longitude: lng,
                    imageUrl,
                }),
                credentials: "include",
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || "Failed to update issue")
            }

            toast.success("Issue updated", {
                style: { background: "#1e293b", color: "#3b82f6" }, // bg-slate-800 + blue text
            })
            router.push("/my-issues")
        } catch (err: any) {
            toast.error(err?.mesaage || "Update failed")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container py-8">
            <Link href="/my-issues">
                <Button variant="ghost" size="sm" className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Issues
                </Button>
            </Link>

            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Issue</CardTitle>
                        <CardDescription>Update your reported issue</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Road">Road</SelectItem>
                                        <SelectItem value="Water">Water</SelectItem>
                                        <SelectItem value="Sanitation">Sanitation</SelectItem>
                                        <SelectItem value="Electricity">Electricity</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Resolved">Resolved</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Location</Label>
                                <Input
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>

                            <LocationPickerMap
                                lat={lat}
                                lng={lng}
                                setLatLng={setLatLng}
                                setLocationText={setLocation}
                                location={location}
                            />

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Image (Optional)</Label>
                                <div className="flex items-center gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => document.getElementById("image")?.click()}
                                        className="w-full h-32 border-dashed flex flex-col items-center justify-center"
                                    >
                                        <ImagePlus className="h-8 w-8 mb-2 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            Click to upload
                                        </span>
                                    </Button>
                                    <input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />

                                    {imagePreview && (
                                        <div className="relative h-32 w-32 rounded-md overflow-hidden">
                                            <img
                                                src={imagePreview || "/placeholder.svg"}
                                                alt="Preview"
                                                className="h-full w-full object-cover"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                                onClick={() => {
                                                    setImage(null)
                                                    setImagePreview(null)
                                                }}
                                            >
                                                ×
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Upload an image of the issue (max 5MB)
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="ghost" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" /> Saving...
                                    </>
                                ) : (
                                    "Update Issue"
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}