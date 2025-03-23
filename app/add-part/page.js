"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { addUserPart, refreshAllParts } from "../redux/features/partsSlice";
import Link from "next/link";
import { ArrowLeft, Upload, Image, Plus, Minus } from "lucide-react";

export default function AddPart() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { postalCode } = useSelector((state) => state.parts);

  const [uploadMethod, setUploadMethod] = useState("link");
  const [additionalImages, setAdditionalImages] = useState([""]);
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);

  const [partData, setPartData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    detailedDescription: "",
    condition: "New",
    compatibility: "",
    image: "",
    availability: true,
    shipping: {
      available: true,
      cost: "",
      estimatedDays: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setPartData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setPartData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSwitchChange = (name, checked) => {
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setPartData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: checked,
        },
      }));
    } else {
      setPartData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    }
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app you'd upload to a server, but for this demo:
      const reader = new FileReader();
      reader.onload = (event) => {
        setPartData((prev) => ({
          ...prev,
          image: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImageChange = (index, value) => {
    const updatedImages = [...additionalImages];
    updatedImages[index] = value;
    setAdditionalImages(updatedImages);
  };

  const handleAddImage = () => {
    setAdditionalImages([...additionalImages, ""]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = additionalImages.filter((_, i) => i !== index);
    setAdditionalImages(updatedImages);
  };

  const handleSpecChange = (index, field, value) => {
    const updatedSpecs = [...specs];
    updatedSpecs[index][field] = value;
    setSpecs(updatedSpecs);
  };

  const handleAddSpec = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  const handleRemoveSpec = (index) => {
    const updatedSpecs = specs.filter((_, i) => i !== index);
    setSpecs(updatedSpecs);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert specs array to an object
    const specifications = specs.reduce((acc, { key, value }) => {
      if (key && value) acc[key] = value;
      return acc;
    }, {});

    // Filter out empty additional images
    const filteredAdditionalImages = additionalImages.filter((url) => url);

    dispatch(
      addUserPart({
        ...partData,
        price: parseFloat(partData.price),
        compatibility: partData.compatibility
          .split(",")
          .map((item) => item.trim()),
        specifications,
        additionalImages: filteredAdditionalImages,
        shipping: {
          ...partData.shipping,
          cost: parseFloat(partData.shipping.cost) || 0,
        },
        uploadDate: new Date().toISOString().split("T")[0],
        lastUpdated: new Date().toISOString().split("T")[0],
      })
    );

    // Manually refresh all parts to ensure randomization is applied
    dispatch(refreshAllParts());
    router.push("/my-listings");
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Add New Part</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Part Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={partData.name}
                      onChange={handleChange}
                      placeholder="e.g. EV Battery Pack"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={partData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={partData.category}
                      onValueChange={(value) =>
                        setPartData({ ...partData, category: value })
                      }
                      required
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EV Parts">EV Parts</SelectItem>
                        <SelectItem value="Brakes">Brakes</SelectItem>
                        <SelectItem value="Engine">Engine</SelectItem>
                        <SelectItem value="Transmission">
                          Transmission
                        </SelectItem>
                        <SelectItem value="Suspension">Suspension</SelectItem>
                        <SelectItem value="Exterior">Exterior</SelectItem>
                        <SelectItem value="Interior">Interior</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition *</Label>
                    <Select
                      value={partData.condition}
                      onValueChange={(value) =>
                        setPartData({ ...partData, condition: value })
                      }
                      required
                    >
                      <SelectTrigger id="condition">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Used">Used</SelectItem>
                        <SelectItem value="Refurbished">Refurbished</SelectItem>
                        <SelectItem value="For parts">For parts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Label htmlFor="description">Short Description *</Label>
                  <Input
                    id="description"
                    name="description"
                    value={partData.description}
                    onChange={handleChange}
                    placeholder="Brief description of the part"
                    required
                  />
                </div>

                <div className="mt-6 space-y-2">
                  <Label htmlFor="detailedDescription">
                    Detailed Description
                  </Label>
                  <Textarea
                    id="detailedDescription"
                    name="detailedDescription"
                    value={partData.detailedDescription}
                    onChange={handleChange}
                    placeholder="Provide a detailed description of the part, including features and benefits"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="mt-6 space-y-2">
                  <Label htmlFor="compatibility">Compatible Vehicles *</Label>
                  <Input
                    id="compatibility"
                    name="compatibility"
                    value={partData.compatibility}
                    onChange={handleChange}
                    placeholder="Enter vehicle models, separated by commas"
                    required
                  />
                </div>
              </div>

              <Separator />

              {/* Specifications */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Specifications</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddSpec}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Spec
                  </Button>
                </div>

                {specs.map((spec, index) => (
                  <div key={index} className="flex items-center gap-4 mb-4">
                    <Input
                      placeholder="Spec name (e.g. Weight)"
                      value={spec.key}
                      onChange={(e) =>
                        handleSpecChange(index, "key", e.target.value)
                      }
                      className="flex-1"
                    />
                    <Input
                      placeholder="Value (e.g. 5kg)"
                      value={spec.value}
                      onChange={(e) =>
                        handleSpecChange(index, "value", e.target.value)
                      }
                      className="flex-1"
                    />
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSpec(index)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              {/* Images */}
              <div>
                <h3 className="text-lg font-medium mb-4">Images</h3>

                <div className="mb-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Label>Primary Image *</Label>
                    <div className="flex items-center space-x-4">
                      <Label
                        htmlFor="upload-method-link"
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          id="upload-method-link"
                          checked={uploadMethod === "link"}
                          onChange={() => setUploadMethod("link")}
                          className="rounded-full"
                        />
                        <span>URL Link</span>
                      </Label>
                      <Label
                        htmlFor="upload-method-file"
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          id="upload-method-file"
                          checked={uploadMethod === "file"}
                          onChange={() => setUploadMethod("file")}
                          className="rounded-full"
                        />
                        <span>Upload File</span>
                      </Label>
                    </div>
                  </div>

                  {uploadMethod === "link" ? (
                    <Input
                      name="image"
                      value={partData.image}
                      onChange={handleChange}
                      placeholder="Enter image URL"
                      required
                    />
                  ) : (
                    <div className="flex items-center">
                      <Input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleUploadImage}
                        className="hidden"
                      />
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <div className="flex items-center gap-2 px-4 py-2 border rounded-md bg-gray-50 hover:bg-gray-100">
                          <Upload className="w-4 h-4" />
                          <span>Choose file</span>
                        </div>
                      </Label>
                      <span className="ml-3 text-sm text-gray-500">
                        {partData.image ? "Image selected" : "No file selected"}
                      </span>
                    </div>
                  )}

                  {partData.image && (
                    <div className="w-40 h-40 relative border rounded overflow-hidden">
                      <img
                        src={partData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/300x200";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label>Additional Images</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddImage}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Image
                    </Button>
                  </div>

                  {additionalImages.map((url, index) => (
                    <div key={index} className="flex items-center gap-4 mb-4">
                      <Input
                        placeholder="Enter image URL"
                        value={url}
                        onChange={(e) =>
                          handleAdditionalImageChange(index, e.target.value)
                        }
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Shipping & Availability */}
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Shipping & Availability
                </h3>

                <div className="flex items-center space-x-4 mb-6">
                  <Label
                    htmlFor="availability"
                    className="cursor-pointer flex items-center space-x-2"
                  >
                    <Switch
                      id="availability"
                      checked={partData.availability}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("availability", checked)
                      }
                    />
                    <span>Part is available for purchase</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <Label
                    htmlFor="shipping.available"
                    className="cursor-pointer flex items-center space-x-2"
                  >
                    <Switch
                      id="shipping.available"
                      checked={partData.shipping.available}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("shipping.available", checked)
                      }
                    />
                    <span>Shipping available</span>
                  </Label>
                </div>

                {partData.shipping.available && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="shipping.cost">Shipping Cost ($)</Label>
                      <Input
                        id="shipping.cost"
                        name="shipping.cost"
                        type="number"
                        value={partData.shipping.cost}
                        onChange={handleChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shipping.estimatedDays">
                        Estimated Delivery Time
                      </Label>
                      <Input
                        id="shipping.estimatedDays"
                        name="shipping.estimatedDays"
                        value={partData.shipping.estimatedDays}
                        onChange={handleChange}
                        placeholder="e.g. 3-5 days"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full">
                  Add Part
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
