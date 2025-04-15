import { useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Input 
} from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Button 
} from "@/components/ui/button";
import { 
  Checkbox 
} from "@/components/ui/checkbox";
import { 
  Label 
} from "@/components/ui/label";
import { 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Search 
} from "lucide-react";
import { FilterPetsData } from "@shared/schema";

interface PetFilterProps {
  onFilter: (filters: FilterPetsData) => void;
  isLoading?: boolean;
}

export function PetFilter({ onFilter, isLoading = false }: PetFilterProps) {
  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState("all");
  const [location, setLocation] = useState("all");
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Advanced filters
  const [ageFilters, setAgeFilters] = useState<string[]>([]);
  const [sizeFilters, setSizeFilters] = useState<string[]>([]);
  const [genderFilters, setGenderFilters] = useState<string[]>([]);
  const [goodWithFilters, setGoodWithFilters] = useState<string[]>([]);

  const handleAgeChange = (value: string) => {
    setAgeFilters(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value) 
        : [...prev, value]
    );
  };

  const handleSizeChange = (value: string) => {
    setSizeFilters(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value) 
        : [...prev, value]
    );
  };

  const handleGenderChange = (value: string) => {
    setGenderFilters(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value) 
        : [...prev, value]
    );
  };

  const handleGoodWithChange = (value: string) => {
    setGoodWithFilters(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value) 
        : [...prev, value]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({
      search,
      species: species && species !== "all" ? species : undefined,
      location: location && location !== "all" ? location : undefined,
      age: ageFilters.length > 0 ? ageFilters : undefined,
      size: sizeFilters.length > 0 ? sizeFilters : undefined,
      gender: genderFilters.length > 0 ? genderFilters : undefined,
      goodWith: goodWithFilters.length > 0 ? goodWithFilters : undefined,
    });
  };

  const handleReset = () => {
    setSearch("");
    setSpecies("all");
    setLocation("all");
    setAgeFilters([]);
    setSizeFilters([]);
    setGenderFilters([]);
    setGoodWithFilters([]);
    onFilter({});
  };

  return (
    <Card className="bg-white">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name, breed, etc."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full md:w-1/3">
              <Select value={species} onValueChange={setSpecies}>
                <SelectTrigger>
                  <SelectValue placeholder="All Animals" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Animals</SelectItem>
                  <SelectItem value="dog">Dogs</SelectItem>
                  <SelectItem value="cat">Cats</SelectItem>
                  <SelectItem value="rabbit">Rabbits</SelectItem>
                  <SelectItem value="bird">Birds</SelectItem>
                  <SelectItem value="small-furry">Small & Furry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-1/3">
              <div className="flex justify-between gap-2">
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="San Francisco">San Francisco, CA</SelectItem>
                    <SelectItem value="Portland">Portland, OR</SelectItem>
                    <SelectItem value="Austin">Austin, TX</SelectItem>
                    <SelectItem value="Denver">Denver, CO</SelectItem>
                    <SelectItem value="Chicago">Chicago, IL</SelectItem>
                    <SelectItem value="Seattle">Seattle, WA</SelectItem>
                    <SelectItem value="Boston">Boston, MA</SelectItem>
                    <SelectItem value="Miami">Miami, FL</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button type="submit" disabled={isLoading}>
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <Button
              type="button"
              variant="ghost"
              className="text-primary p-0 h-auto hover:bg-transparent hover:text-primary/80 flex items-center"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <span>Advanced Filters</span>
              {showAdvanced ? (
                <ChevronUp className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-1 h-4 w-4" />
              )}
            </Button>
            
            {showAdvanced && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">Age</Label>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="age-baby" 
                        checked={ageFilters.includes("baby")} 
                        onCheckedChange={() => handleAgeChange("baby")}
                      />
                      <label htmlFor="age-baby" className="text-sm text-gray-700 cursor-pointer">Baby</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="age-young" 
                        checked={ageFilters.includes("young")} 
                        onCheckedChange={() => handleAgeChange("young")}
                      />
                      <label htmlFor="age-young" className="text-sm text-gray-700 cursor-pointer">Young</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="age-adult" 
                        checked={ageFilters.includes("adult")} 
                        onCheckedChange={() => handleAgeChange("adult")}
                      />
                      <label htmlFor="age-adult" className="text-sm text-gray-700 cursor-pointer">Adult</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="age-senior" 
                        checked={ageFilters.includes("senior")} 
                        onCheckedChange={() => handleAgeChange("senior")}
                      />
                      <label htmlFor="age-senior" className="text-sm text-gray-700 cursor-pointer">Senior</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">Size</Label>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="size-small" 
                        checked={sizeFilters.includes("small")} 
                        onCheckedChange={() => handleSizeChange("small")}
                      />
                      <label htmlFor="size-small" className="text-sm text-gray-700 cursor-pointer">Small</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="size-medium" 
                        checked={sizeFilters.includes("medium")} 
                        onCheckedChange={() => handleSizeChange("medium")}
                      />
                      <label htmlFor="size-medium" className="text-sm text-gray-700 cursor-pointer">Medium</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="size-large" 
                        checked={sizeFilters.includes("large")} 
                        onCheckedChange={() => handleSizeChange("large")}
                      />
                      <label htmlFor="size-large" className="text-sm text-gray-700 cursor-pointer">Large</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="size-xlarge" 
                        checked={sizeFilters.includes("xlarge")} 
                        onCheckedChange={() => handleSizeChange("xlarge")}
                      />
                      <label htmlFor="size-xlarge" className="text-sm text-gray-700 cursor-pointer">X-Large</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">Gender</Label>
                  <div className="flex gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="gender-male" 
                        checked={genderFilters.includes("male")} 
                        onCheckedChange={() => handleGenderChange("male")}
                      />
                      <label htmlFor="gender-male" className="text-sm text-gray-700 cursor-pointer">Male</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="gender-female" 
                        checked={genderFilters.includes("female")} 
                        onCheckedChange={() => handleGenderChange("female")}
                      />
                      <label htmlFor="gender-female" className="text-sm text-gray-700 cursor-pointer">Female</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">Good with</Label>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="good-with-kids" 
                        checked={goodWithFilters.includes("kids")} 
                        onCheckedChange={() => handleGoodWithChange("kids")}
                      />
                      <label htmlFor="good-with-kids" className="text-sm text-gray-700 cursor-pointer">Kids</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="good-with-dogs" 
                        checked={goodWithFilters.includes("dogs")} 
                        onCheckedChange={() => handleGoodWithChange("dogs")}
                      />
                      <label htmlFor="good-with-dogs" className="text-sm text-gray-700 cursor-pointer">Dogs</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="good-with-cats" 
                        checked={goodWithFilters.includes("cats")} 
                        onCheckedChange={() => handleGoodWithChange("cats")}
                      />
                      <label htmlFor="good-with-cats" className="text-sm text-gray-700 cursor-pointer">Cats</label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {showAdvanced && (
            <div className="mt-4 flex justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleReset}
                className="mr-2"
              >
                Reset
              </Button>
              <Button type="submit" disabled={isLoading}>
                Apply Filters
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
