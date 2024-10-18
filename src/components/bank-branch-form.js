import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import dynamic from "next/dynamic";
import assert from "assert";

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
});

const formSchema = z.object({
  type: z.string().min(1, { message: "Branch type is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  location_name: z.string().min(1, { message: "Location name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  province: z.string().min(1, { message: "Province is required" }),
  city: z.string().min(1, { message: "City is required" }),
  latitude: z
    .number()
    .min(-90)
    .max(90, { message: "Latitude must be between -90 and 90" })
    .nullable(), // somehow when this set to not nullable, the onSubmit will never be called
  longitude: z
    .number()
    .min(-180)
    .max(180, { message: "Longitude must be between -180 and 180" })
    .nullable(),
});

export default function BankBranchForm({
  initialValues = {},
  onSubmit,
  province_cities_list,
  category_list,
  branch_type_list,
  closeModal,
}) {
  // assert that all required props are provided
  assert(province_cities_list, "province_cities_list is required");
  assert(category_list, "category_list is required");
  assert(branch_type_list, "branch_type_list is required");

  const [latitude, setLatitude] = useState(initialValues.latitude || null);
  const [longitude, setLongitude] = useState(initialValues.longitude || null);
  const [selectedProvince, setSelectedProvince] = useState(
    initialValues.province || ""
  );
  const [cityList, setCityList] = useState([]);
  const [isInitialRender, setIsInitialRender] = useState(true);

  const handleLocationSelect = (lat, lng) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: initialValues.type || "",
      category: initialValues.category || "",
      location_name: initialValues.location_name || "",
      address: initialValues.address || "",
      province: initialValues.province || "",
      city: initialValues.city || "",
      latitude: initialValues.latitude || null,
      longitude: initialValues.longitude || null,
    },
  });

  const handleSubmit = (data) => {
    const formData = {
      ...data,
      latitude: latitude !== null ? latitude : undefined,
      longitude: longitude !== null ? longitude : undefined,
    };
    onSubmit(formData);
  };

  useEffect(() => {
    if (initialValues.latitude && initialValues.longitude) {
      setLatitude(initialValues.latitude);
      setLongitude(initialValues.longitude);
    }
  }, [initialValues]);

  useEffect(() => {
    if (selectedProvince) {
      const provinceData = province_cities_list.find(
        (item) => item[selectedProvince]
      );
      setCityList(provinceData ? provinceData[selectedProvince] : []);

      if (!isInitialRender) {
        form.setValue("city", ""); // Reset city field
      }
      setIsInitialRender(false);
    }
  }, [selectedProvince, province_cities_list, form]);

  return (
    <Card className="w-full max-w-3xl mx-auto min-w-[800px] z-10">
      <button className="btn " onClick={closeModal}>
        ✕
      </button>
      <CardHeader>
        <CardTitle>
          {initialValues.location_name ? "Update" : "Add"} Bank Branch Location
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {branch_type_list.map((branchType) => (
                          <SelectItem key={branchType} value={branchType}>
                            {branchType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {category_list.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="location_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4 z-10">
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedProvince(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {province_cities_list.map((item) => {
                          const province = Object.keys(item)[0];
                          return (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value} // Ensure the value is updated
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cityList.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Map Location Selector</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <MapComponent
                  onLocationSelect={handleLocationSelect}
                  defaultPosition={[
                    latitude || -3.2721456350750127,
                    longitude || 114.48303222656251,
                  ]}
                  defaultZoom={5}
                />
              </div>
              <div className="flex space-x-4">
                <p>
                  Latitude:{" "}
                  <strong>{latitude !== null ? latitude : "N/A"}</strong>
                </p>
                <p>
                  Longitude:{" "}
                  <strong>{longitude !== null ? longitude : "N/A"}</strong>
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              {initialValues.id ? "Update" : "Submit"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
