import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Pet, insertPetSchema } from "@shared/schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  Edit,
  Loader2,
  PlusCircle,
  Shield,
  Trash2,
  User,
  Users,
} from "lucide-react";

export default function AdminPage() {
  const { isAdmin, user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [confirmDeletePetId, setConfirmDeletePetId] = useState<number | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  // Redirect non-admin users
  if (!isAdmin) {
    // Wait for a moment to show loading state
    setTimeout(() => {
      navigate("/");
    }, 1000);
  }

  // Fetch all pets for admin
  const { data: pets, isLoading: isPetsLoading } = useQuery<Pet[]>({
    queryKey: ["/api/pets"],
  });

  // Fetch all users (would be implemented in a real app)
  const { data: users, isLoading: isUsersLoading } = useQuery<{id: number, username: string, email: string, isAdmin: boolean}[]>({
    queryKey: ["/api/users"],
    enabled: false, // Disabled since endpoint doesn't exist in this demo
  });

  // Create pet form
  const createPetForm = useForm({
    resolver: zodResolver(insertPetSchema),
    defaultValues: {
      name: "",
      species: "dog",
      breed: "",
      age: "adult",
      gender: "male",
      size: "medium",
      location: "",
      description: "",
      imageUrl: "",
      goodWithKids: false,
      goodWithDogs: false,
      goodWithCats: false,
      characteristics: [],
      adoptionStatus: "available",
    },
  });

  // Edit pet form
  const editPetForm = useForm({
    resolver: zodResolver(insertPetSchema),
    defaultValues: {
      name: "",
      species: "dog",
      breed: "",
      age: "adult",
      gender: "male",
      size: "medium",
      location: "",
      description: "",
      imageUrl: "",
      goodWithKids: false,
      goodWithDogs: false,
      goodWithCats: false,
      characteristics: [],
      adoptionStatus: "available",
    },
  });

  // Create pet mutation
  const createPetMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/pets", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      setIsCreateModalOpen(false);
      createPetForm.reset();
      toast({
        title: "Pet created",
        description: "New pet has been added successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create pet",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update pet mutation
  const updatePetMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest("PUT", `/api/pets/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      setIsEditModalOpen(false);
      setEditingPet(null);
      toast({
        title: "Pet updated",
        description: "Pet information has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update pet",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete pet mutation
  const deletePetMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/pets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      setIsConfirmDeleteOpen(false);
      setConfirmDeletePetId(null);
      toast({
        title: "Pet deleted",
        description: "Pet has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete pet",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreatePetSubmit = createPetForm.handleSubmit((data) => {
    createPetMutation.mutate(data);
  });

  const handleEditPetSubmit = editPetForm.handleSubmit((data) => {
    if (!editingPet) return;
    updatePetMutation.mutate({ id: editingPet.id, data });
  });

  const openEditModal = (pet: Pet) => {
    setEditingPet(pet);
    editPetForm.reset({
      name: pet.name,
      species: pet.species,
      breed: pet.breed || "",
      age: pet.age || "adult",
      gender: pet.gender || "male",
      size: pet.size || "medium",
      location: pet.location || "",
      description: pet.description || "",
      imageUrl: pet.imageUrl || "",
      goodWithKids: pet.goodWithKids || false,
      goodWithDogs: pet.goodWithDogs || false,
      goodWithCats: pet.goodWithCats || false,
      characteristics: pet.characteristics || [],
      adoptionStatus: pet.adoptionStatus || "available",
    });
    setIsEditModalOpen(true);
  };

  const confirmDeletePet = (id: number) => {
    setConfirmDeletePetId(id);
    setIsConfirmDeleteOpen(true);
  };

  const handleDeletePet = () => {
    if (confirmDeletePetId) {
      deletePetMutation.mutate(confirmDeletePetId);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Redirecting...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-500 mt-1">
            Manage pets, users, and settings.
          </p>
        </div>
        <div className="flex items-center">
          <Badge variant="outline" className="mr-2 bg-primary/10 text-primary">
            Admin
          </Badge>
          <span className="text-sm text-gray-500">
            Logged in as {user?.username}
          </span>
        </div>
      </div>

      <Tabs defaultValue="pets">
        <TabsList>
          <TabsTrigger value="pets">
            Pets
          </TabsTrigger>
          <TabsTrigger value="users">
            Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pets" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage Pets</CardTitle>
                <CardDescription>
                  Add, edit, or remove pets from the system.
                </CardDescription>
              </div>
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Pet
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Pet</DialogTitle>
                    <DialogDescription>
                      Fill in the details to add a new pet to the system.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...createPetForm}>
                    <form onSubmit={handleCreatePetSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={createPetForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Pet name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={createPetForm.control}
                          name="species"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Species *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select species" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="dog">Dog</SelectItem>
                                  <SelectItem value="cat">Cat</SelectItem>
                                  <SelectItem value="rabbit">Rabbit</SelectItem>
                                  <SelectItem value="bird">Bird</SelectItem>
                                  <SelectItem value="small-furry">Small & Furry</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={createPetForm.control}
                          name="breed"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Breed</FormLabel>
                              <FormControl>
                                <Input placeholder="Breed (optional)" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={createPetForm.control}
                          name="age"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Age</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select age" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="baby">Baby</SelectItem>
                                  <SelectItem value="young">Young</SelectItem>
                                  <SelectItem value="adult">Adult</SelectItem>
                                  <SelectItem value="senior">Senior</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={createPetForm.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={createPetForm.control}
                          name="size"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Size</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select size" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="small">Small</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="large">Large</SelectItem>
                                  <SelectItem value="xlarge">X-Large</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={createPetForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="City, State" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={createPetForm.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://example.com/image.jpg" {...field} />
                              </FormControl>
                              <FormDescription>
                                Enter a URL to an image of the pet
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={createPetForm.control}
                          name="adoptionStatus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Adoption Status</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="available">Available</SelectItem>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="adopted">Adopted</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={createPetForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us about this pet..."
                                className="min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={createPetForm.control}
                          name="goodWithKids"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Good with kids</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={createPetForm.control}
                          name="goodWithDogs"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Good with dogs</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={createPetForm.control}
                          name="goodWithCats"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Good with cats</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={createPetForm.control}
                        name="characteristics"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Characteristics</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="friendly, playful, quiet (comma-separated)"
                                value={field.value?.join(", ") || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const characteristics = value
                                    ? value.split(",").map((item) => item.trim())
                                    : [];
                                  field.onChange(characteristics);
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              Separate traits with commas
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button 
                          type="submit"
                          disabled={createPetMutation.isPending}
                        >
                          {createPetMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Create Pet"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {isPetsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !pets || pets.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">No pets found in the system.</p>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Species</TableHead>
                        <TableHead>Breed</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pets.map((pet) => (
                        <TableRow key={pet.id}>
                          <TableCell className="font-medium">{pet.id}</TableCell>
                          <TableCell>{pet.name}</TableCell>
                          <TableCell className="capitalize">{pet.species}</TableCell>
                          <TableCell>{pet.breed || "-"}</TableCell>
                          <TableCell className="capitalize">{pet.age || "-"}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                pet.adoptionStatus === "available"
                                  ? "default"
                                  : pet.adoptionStatus === "pending"
                                  ? "secondary"
                                  : "outline"
                              }
                              className="capitalize"
                            >
                              {pet.adoptionStatus || "available"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditModal(pet)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => confirmDeletePet(pet.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Users</CardTitle>
              <CardDescription>
                View and manage user accounts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  User management would be implemented here in a full application.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Pet Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Pet</DialogTitle>
            <DialogDescription>
              Update the pet's information.
            </DialogDescription>
          </DialogHeader>
          <Form {...editPetForm}>
            <form onSubmit={handleEditPetSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editPetForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Pet name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editPetForm.control}
                  name="species"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Species *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select species" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="dog">Dog</SelectItem>
                          <SelectItem value="cat">Cat</SelectItem>
                          <SelectItem value="rabbit">Rabbit</SelectItem>
                          <SelectItem value="bird">Bird</SelectItem>
                          <SelectItem value="small-furry">Small & Furry</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editPetForm.control}
                  name="breed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Breed</FormLabel>
                      <FormControl>
                        <Input placeholder="Breed (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editPetForm.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select age" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="baby">Baby</SelectItem>
                          <SelectItem value="young">Young</SelectItem>
                          <SelectItem value="adult">Adult</SelectItem>
                          <SelectItem value="senior">Senior</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editPetForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editPetForm.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                          <SelectItem value="xlarge">X-Large</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editPetForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editPetForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a URL to an image of the pet
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editPetForm.control}
                  name="adoptionStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adoption Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="adopted">Adopted</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editPetForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about this pet..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={editPetForm.control}
                  name="goodWithKids"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Good with kids</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={editPetForm.control}
                  name="goodWithDogs"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Good with dogs</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={editPetForm.control}
                  name="goodWithCats"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Good with cats</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editPetForm.control}
                name="characteristics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Characteristics</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="friendly, playful, quiet (comma-separated)"
                        value={field.value?.join(", ") || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          const characteristics = value
                            ? value.split(",").map((item) => item.trim())
                            : [];
                          field.onChange(characteristics);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Separate traits with commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="submit"
                  disabled={updatePetMutation.isPending}
                >
                  {updatePetMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Pet"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <AlertDialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the pet
              from our database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePet}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletePetMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
