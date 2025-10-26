"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Calendar, Clock, CheckCircle, XCircle, Scroll } from "lucide-react";
import { useContent } from '@/hooks/useContent';
import {
  PharaohCard,
  PharaohButton,
  HieroglyphicText,
  HieroglyphicDivider
} from '@/components/ui/pharaonic-elements';

interface UnifiedBookingFormProps {
  // Item details
  type: 'dahabiya' | 'package';
  itemId: string;
  itemName: string;
  basePrice: number;
  
  // Optional configurations
  maxGuests?: number;
  durationDays?: number;
  minDays?: number;
  
  // UI configurations
  style?: 'pharaonic' | 'modern' | 'enhanced';
  showAvailabilityCheck?: boolean;
  // showCabinSelection?: boolean;  // REMOVED: cabin system removed
  
  // Callbacks
  onBookingSuccess?: (bookingId: string) => void;
  onBookingError?: (error: string) => void;
}

interface AvailabilityResult {
  isAvailable: boolean;
  totalPrice: number;
  message?: string;
  // availableCabins removed - cabin system removed
  recommendedItemId?: string;
}

export default function UnifiedBookingForm({
  type,
  itemId,
  itemName,
  basePrice,
  maxGuests = 20,
  durationDays,
  style = 'pharaonic',
  showAvailabilityCheck = false,
  // showCabinSelection = false,  // REMOVED: cabin system removed
  onBookingSuccess,
  onBookingError
}: UnifiedBookingFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<AvailabilityResult | null>(null);
  useContent({ page: 'booking' });

  // Form state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState("");
  const [isGuestBooking, setIsGuestBooking] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1); // Start from tomorrow

  // Auto-calculate end date for packages
  useEffect(() => {
    if (type === 'package' && startDate && durationDays) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + durationDays);
      setEndDate(end.toISOString().split('T')[0] || '');
    }
  }, [startDate, durationDays, type]);

  const calculateTotalPrice = (): number => {
    if (!guests) return 0;
    
    if (type === 'package') {
      // For packages, use fixed price per person
      return basePrice * guests;
    }
    
    // For dahabiyat, calculate based on days
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return basePrice * days * guests;
  };

  const checkAvailability = async () => {
    if (!startDate || !guests) {
      toast.error("Please select dates and number of guests");
      return;
    }

    try {
      setCheckingAvailability(true);
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: type.toUpperCase(), // Ensure consistent type format
          itemId,
          startDate,
          endDate,
          guests
        })
      });

      if (!response.ok) {
        throw new Error('Failed to check availability');
      }

      const result = await response.json();
      setAvailabilityResult(result);
      
      if (!result.isAvailable) {
        toast.error(result.message || 'Not available for selected dates');
      } else {
        toast.success('Available! You can proceed with booking.');
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.error('Failed to check availability. Please try again.');
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Check if user is authenticated or booking as guest
    if (!session && !isGuestBooking) {
      toast.error("Please sign in or continue as guest");
      return;
    }

    // Validate guest information if booking as guest
    if (isGuestBooking) {
      if (!guestName || !guestEmail) {
        toast.error("Please provide your name and email");
        return;
      }
    }

    if (!startDate || !guests) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (type === 'dahabiya' && !endDate) {
      toast.error("Please select end date");
      return;
    }

    if (showAvailabilityCheck && !availabilityResult?.isAvailable) {
      toast.error("Please check availability first");
      return;
    }

    try {
      setLoading(true);
      const totalPrice = availabilityResult?.totalPrice || calculateTotalPrice();
      
      const bookingData: any = {
        type: type.toUpperCase(), // Ensure consistent type format (DAHABIYA/PACKAGE)
        dahabiyaId: type === 'dahabiya' ? itemId : undefined,
        packageId: type === 'package' ? itemId : undefined,
        startDate,
        endDate,
        guests,
        totalPrice,
        specialRequests,
        guestDetails: [], // Add empty guest details array for now
        isGuestBooking
      };

      // Add guest information if booking as guest
      if (isGuestBooking) {
        bookingData.guestInfo = {
          name: guestName,
          email: guestEmail,
          phone: guestPhone || undefined
        };
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create booking");
      }

      const booking = await response.json();
      toast.success("Booking created successfully!");

      if (onBookingSuccess) {
        onBookingSuccess(booking.id);
      } else {
        // For guest bookings, show success message with booking reference
        if (isGuestBooking) {
          toast.success(`Booking confirmed! Reference: ${booking.bookingReference}. Check your email for details.`);
        } else {
          // Redirect to profile page with bookings tab active
          router.push(`/profile?tab=bookings`);
        }
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create booking. Please try again.";
      toast.error(errorMessage);
      
      if (onBookingError) {
        onBookingError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderFormContent = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${style === 'pharaonic' ? 'text-blue-800' : 'text-gray-700'}`}>
            {type === 'package' ? 'Departure Date' : 'Start Date'}
          </label>
          <Input
            id="start-date"
            name="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={minDate.toISOString().split('T')[0]}
            required
            className={style === 'pharaonic' ? 'border-blue-300 focus:border-blue-500' : ''}
          />
        </div>
        
        {type === 'dahabiya' && (
          <div>
            <label className={`block text-sm font-medium mb-2 ${style === 'pharaonic' ? 'text-blue-800' : 'text-gray-700'}`}>
              End Date
            </label>
            <Input
              id="end-date"
              name="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || minDate.toISOString().split('T')[0]}
              required
              className={style === 'pharaonic' ? 'border-blue-300 focus:border-blue-500' : ''}
            />
          </div>
        )}
        
        {type === 'package' && durationDays && (
          <div>
            <label className={`block text-sm font-medium mb-2 ${style === 'pharaonic' ? 'text-blue-800' : 'text-gray-700'}`}>
              Duration
            </label>
            <div className={`p-3 rounded-md border ${style === 'pharaonic' ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}>
              <div className="flex items-center">
                <Clock className={`w-4 h-4 mr-2 ${style === 'pharaonic' ? 'text-blue-600' : 'text-gray-600'}`} />
                <span className={style === 'pharaonic' ? 'text-blue-800' : 'text-gray-700'}>
                  {durationDays} Days
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Guests Selection */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${style === 'pharaonic' ? 'text-blue-800' : 'text-gray-700'}`}>
          Number of Guests
        </label>
        <Input
          id="guests"
          name="guests"
          type="number"
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value))}
          min="1"
          max={maxGuests}
          required
          className={style === 'pharaonic' ? 'border-blue-300 focus:border-blue-500' : ''}
        />
        <p className={`text-sm mt-1 ${style === 'pharaonic' ? 'text-blue-600' : 'text-gray-500'}`}>
          Maximum {maxGuests} guests
        </p>
      </div>

      {/* REMOVED: Cabin Selection - cabin system removed */}

      {/* Special Requests */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${style === 'pharaonic' ? 'text-blue-800' : 'text-gray-700'}`}>
          Special Requests (Optional)
        </label>
        <textarea
          id="special-requests"
          name="specialRequests"
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          rows={3}
          className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-opacity-50 ${
            style === 'pharaonic'
              ? 'border-blue-300 focus:border-blue-500 focus:ring-blue-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          placeholder="Any special dietary requirements, celebrations, or preferences..."
        />
      </div>

      {/* Price Display */}
      <div className={`p-4 rounded-lg ${style === 'pharaonic' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}>
        <div className="flex justify-between items-center">
          <span className={`text-lg font-medium ${style === 'pharaonic' ? 'text-blue-800' : 'text-gray-800'}`}>
            Total Price:
          </span>
          <span className={`text-2xl font-bold ${style === 'pharaonic' ? 'text-blue-800' : 'text-gray-800'}`}>
            ${availabilityResult?.totalPrice || calculateTotalPrice()}
          </span>
        </div>
        {type === 'dahabiya' && startDate && endDate && (
          <p className={`text-sm mt-1 ${style === 'pharaonic' ? 'text-blue-600' : 'text-gray-600'}`}>
            {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days × {guests} guests
          </p>
        )}
        {type === 'package' && (
          <p className={`text-sm mt-1 ${style === 'pharaonic' ? 'text-blue-600' : 'text-gray-600'}`}>
            ${basePrice} per person × {guests} guests
          </p>
        )}
      </div>

      {/* Availability Check */}
      {showAvailabilityCheck && (
        <div className="space-y-3">
          {style === 'pharaonic' ? (
            <PharaohButton
              type="button"
              variant="secondary"
              onClick={checkAvailability}
              disabled={checkingAvailability || !startDate || !guests}
              className="w-full"
            >
              {checkingAvailability ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Checking Availability...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Check Availability
                </>
              )}
            </PharaohButton>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={checkAvailability}
              disabled={checkingAvailability || !startDate || !guests}
              className="w-full"
            >
              {checkingAvailability ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Checking Availability...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Check Availability
                </>
              )}
            </Button>
          )}

          {availabilityResult && (
            <div className={`p-3 rounded-md ${
              availabilityResult.isAvailable
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center">
                {availabilityResult.isAvailable ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 mr-2" />
                )}
                <span className={`font-medium ${
                  availabilityResult.isAvailable ? 'text-green-800' : 'text-red-800'
                }`}>
                  {availabilityResult.isAvailable ? 'Available!' : 'Not Available'}
                </span>
              </div>
              {availabilityResult.message && (
                <p className={`text-sm mt-1 ${
                  availabilityResult.isAvailable ? 'text-green-700' : 'text-red-700'
                }`}>
                  {availabilityResult.message}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        {style === 'pharaonic' ? (
          <PharaohButton
            type="submit"
            variant="primary"
            disabled={loading || (showAvailabilityCheck && !availabilityResult?.isAvailable)}
            className="w-full"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Booking...
              </>
            ) : (
              <>
                <Scroll className="w-4 h-4 mr-2" />
                {type === 'package' ? 'Book Royal Journey' : 'Book Royal Vessel'}
              </>
            )}
          </PharaohButton>
        ) : (
          <Button
            type="submit"
            disabled={loading || (showAvailabilityCheck && !availabilityResult?.isAvailable)}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Booking...
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 mr-2" />
                {type === 'package' ? 'Book Package' : 'Book Dahabiya'}
              </>
            )}
          </Button>
        )}
      </div>

      {!session && !isGuestBooking && (
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className={`px-2 ${style === 'pharaonic' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-500'}`}>
                Or
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsGuestBooking(true)}
            className="w-full"
          >
            Continue as Guest
          </Button>
          <p className={`text-sm text-center ${style === 'pharaonic' ? 'text-blue-600' : 'text-gray-600'}`}>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/auth/signin")}
              className={`underline hover:no-underline ${style === 'pharaonic' ? 'text-blue-700' : 'text-blue-600'}`}
            >
              Sign in
            </button>
          </p>
        </div>
      )}

      {isGuestBooking && (
        <div className="space-y-4 p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className={`font-semibold ${style === 'pharaonic' ? 'text-blue-800' : 'text-gray-800'}`}>
              Guest Information
            </h3>
            <button
              type="button"
              onClick={() => setIsGuestBooking(false)}
              className={`text-sm underline ${style === 'pharaonic' ? 'text-blue-600' : 'text-gray-600'}`}
            >
              Sign in instead
            </button>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${style === 'pharaonic' ? 'text-blue-800' : 'text-gray-700'}`}>
              Full Name *
            </label>
            <Input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
              placeholder="John Doe"
              className={style === 'pharaonic' ? 'border-blue-300 focus:border-blue-500' : ''}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${style === 'pharaonic' ? 'text-blue-800' : 'text-gray-700'}`}>
              Email Address *
            </label>
            <Input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              required
              placeholder="john@example.com"
              className={style === 'pharaonic' ? 'border-blue-300 focus:border-blue-500' : ''}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${style === 'pharaonic' ? 'text-blue-800' : 'text-gray-700'}`}>
              Phone Number (Optional)
            </label>
            <Input
              type="tel"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              placeholder="+1 234 567 8900"
              className={style === 'pharaonic' ? 'border-blue-300 focus:border-blue-500' : ''}
            />
          </div>
          <p className={`text-xs ${style === 'pharaonic' ? 'text-blue-600' : 'text-gray-500'}`}>
            We'll send your booking confirmation to this email address.
          </p>
        </div>
      )}
    </form>
  );

  // Render with appropriate styling
  if (style === 'pharaonic') {
    return (
      <PharaohCard className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <HieroglyphicText 
            text={`Book ${itemName}`}
            className="text-2xl font-bold text-blue-800"
          />
          <HieroglyphicDivider />
          <p className="text-blue-700">
            {type === 'package' ? 'Reserve your royal adventure' : 'Reserve your royal vessel'}
          </p>
        </CardHeader>
        <CardContent className="p-6">
          {renderFormContent()}
        </CardContent>
      </PharaohCard>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-800">
          Book {itemName}
        </CardTitle>
        <p className="text-gray-600">
          {type === 'package' ? 'Reserve your adventure' : 'Reserve your cruise'}
        </p>
      </CardHeader>
      <CardContent className="p-6">
        {renderFormContent()}
      </CardContent>
    </Card>
  );
}
