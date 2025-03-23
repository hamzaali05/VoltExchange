"use client";

import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { refreshAllParts } from "../../redux/features/partsSlice";
import {
  ArrowLeft,
  Star,
  Shield,
  Mail,
  MapPin,
  Calendar,
  Package,
} from "lucide-react";

export default function PartDetail() {
  const params = useParams();
  const { allParts } = useSelector((state) => state.parts);
  const [selectedImage, setSelectedImage] = useState(0);
  const dispatch = useDispatch();
  const router = useRouter();

  const part = allParts.find((p) => p.id === params.id);

  const handleBackToListings = () => {
    dispatch(refreshAllParts());
    router.push("/");
  };

  if (!part) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96 text-center">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Part not found</h2>
            <Button onClick={handleBackToListings}>Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button
            variant="outline"
            className="mb-6"
            onClick={handleBackToListings}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Listings
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-video overflow-hidden rounded-lg bg-white">
                <img
                  src={part.additionalImages?.[selectedImage] || part.image}
                  alt={part.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {part.additionalImages?.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === idx
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${part.name} view ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Part Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{part.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl font-bold text-primary">
                    ${part.price}
                  </span>
                  <Badge variant="outline">{part.condition}</Badge>
                  <Badge variant="secondary">{part.category}</Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {part.detailedDescription}
                </p>
              </div>

              <Separator />

              {/* Specifications */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Specifications</h2>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(part.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{key}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Seller Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Seller Information</span>
                    {part.seller.isVerified && (
                      <Badge variant="success" className="flex items-center">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified Seller
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{part.seller.name}</span>
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1">{part.seller.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {part.seller.location} ({part.seller.postalCode})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Joined{" "}
                        {new Date(part.seller.joinedDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      <span>{part.seller.totalListings} listings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{part.seller.contactEmail}</span>
                    </div>
                  </div>

                  <Button className="w-full mt-4">Contact Seller</Button>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              {part.shipping.available && (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Shipping Information</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p>Shipping Cost: ${part.shipping.cost}</p>
                    <p>
                      Estimated Delivery: {part.shipping.estimatedDays} business
                      days
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
