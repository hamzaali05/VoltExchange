"use client";

import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { refreshAllParts } from "../redux/features/partsSlice";
import { useRouter } from "next/navigation";

export default function MyListings() {
  const { userParts } = useSelector((state) => state.parts);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleBackToHome = () => {
    dispatch(refreshAllParts());
    router.push("/");
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={handleBackToHome}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold">My Listings</h1>
        </div>

        {userParts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              You haven&apos;t listed any parts yet.
            </p>
            <Link href="/add-part">
              <Button>Add Your First Part</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userParts.map((part) => (
              <Card key={part.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>{part.name}</span>
                    <span className="text-xl font-bold">${part.price}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={part.image}
                    alt={part.name}
                    className="w-full h-48 object-cover mb-4 rounded"
                  />
                  <p className="text-sm text-gray-600 mb-2">
                    {part.description}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold">Category:</span>
                    <span className="text-sm">{part.category}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold">Condition:</span>
                    <span className="text-sm">{part.condition}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold">
                      Compatible with:
                    </span>
                    <span className="text-sm">
                      {part.compatibility.join(", ")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Location: {part.seller.location}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
