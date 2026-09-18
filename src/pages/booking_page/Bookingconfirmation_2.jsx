import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer_Lite";
import { API_BASE_URL } from "../../lib/api";

function PlusIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function FileUploadBox({ file, onChange, hint = "PNG or JPG, 1mb maximum file size" }) {
  return (
    <label className="flex flex-col items-center justify-center gap-2 border border-gray-300 rounded-xl w-28 h-28 cursor-pointer hover:bg-gray-50">
      <input
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
      <span className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-500">
        <PlusIcon className="w-5 h-5" />
      </span>
      <span className="text-[10px] text-gray-400 text-center px-2 leading-tight">
        {file ? file.name : hint}
      </span>
    </label>
  );
}

const VEHICLE_TYPES = ["Car", "Motorcycle", "Van", "SUV", "Truck"];

export default function AdditionalInformation({
  isMenuOpen,
  setIsMenuOpen,
  user,
  onLogout,
  onOpenSignIn,
  onOpenRegister,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state || {};
  const property = booking.property || {};
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedBookingId, setSavedBookingId] = useState(booking.bookingId || null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [govId, setGovId] = useState(null);
  const [proofOfPayment, setProofOfPayment] = useState(null);
  const [hasVehicle, setHasVehicle] = useState(false);
  const [vehicles, setVehicles] = useState([{ type: "Car", count: 1 }]);
  const [specialRequest, setSpecialRequest] = useState("");

  const updateVehicle = (index, patch) => {
    setVehicles((prev) =>
      prev.map((v, i) => (i === index ? { ...v, ...patch } : v))
    );
  };

  const addVehicleType = () => {
    setVehicles((prev) => [...prev, { type: "Car", count: 1 }]);
  };

  const removeVehicleType = (index) => {
    setVehicles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white text-black font-sans min-h-screen flex flex-col">
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        user={user}
        onLogout={onLogout}
        onOpenSignIn={onOpenSignIn}
        onOpenRegister={onOpenRegister}
      />

      <main className="grow px-5 md:px-10 lg:px-[52px] py-10">
        <div className="max-w-[640px] mx-auto">
          <button type="button" onClick={() => navigate(-1)} className="mb-6 text-sm underline">
            Back
          </button>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Additional Information
          </h2>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (booking.bookingId) return;
              setSubmitError("");
              setIsSubmitting(true);

              try {
                const formData = new FormData();
                formData.append("unitId", property.unit_id || "");
                formData.append("checkIn", booking.checkIn || "");
                formData.append("checkOut", booking.checkOut || "");
                formData.append("guests", booking.guests || "1");
                formData.append("guestName", `${firstName} ${lastName}`.trim());
                formData.append("guestContactNum", phone);
                formData.append("vehicleType", hasVehicle ? vehicles.map((vehicle) => `${vehicle.type} (${vehicle.count})`).join(", ") : "");
                formData.append("specialRequests", specialRequest);
                if (govId) formData.append("govId", govId);
                if (proofOfPayment) formData.append("proofOfPayment", proofOfPayment);

                const response = await fetch(`${API_BASE_URL}/create_booking.php`, {
                  method: "POST",
                  credentials: "include",
                  body: formData,
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Unable to create booking");
                setSavedBookingId(data.bookingId);
              } catch (error) {
                setSubmitError(error.message);
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="space-y-8"
          >
            {/* 1. Full Name */}
            <section>
              <h3 className="text-sm font-semibold mb-3">1. Full Name</h3>
              <div className="border border-gray-300 rounded-xl overflow-hidden">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="w-full px-4 py-3 text-sm placeholder-gray-400 focus:outline-none border-b border-gray-300"
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="w-full px-4 py-3 text-sm placeholder-gray-400 focus:outline-none"
                />
              </div>
            </section>

            {/* 2. Contact Information */}
            <section>
              <h3 className="text-sm font-semibold mb-3">2. Contact Information</h3>
              <div className="border border-gray-300 rounded-xl overflow-hidden">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full px-4 py-3 text-sm placeholder-gray-400 focus:outline-none border-b border-gray-300"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                  className="w-full px-4 py-3 text-sm placeholder-gray-400 focus:outline-none"
                />
              </div>
            </section>

            {/* 3. Government-issued ID */}
            <section>
              <h3 className="text-sm font-semibold mb-3">3. Government-Issued ID</h3>
              <FileUploadBox file={govId} onChange={setGovId} />
            </section>

            {/* 4. Proof of Payment */}
            <section>
              <h3 className="text-sm font-semibold mb-3">4. Proof of Payment</h3>
              <FileUploadBox file={proofOfPayment} onChange={setProofOfPayment} />
            </section>

            {/* 5. Vehicle Information */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">5. Vehicle Information</h3>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                  Do you have a vehicle? (Optional)
                  <span
                    onClick={() => setHasVehicle((v) => !v)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                      hasVehicle ? "bg-gray-900 border-gray-900" : "border-gray-300"
                    }`}
                  >
                    {hasVehicle && <CheckIcon />}
                  </span>
                </label>
              </div>

              {hasVehicle && (
                <div className="space-y-3">
                  {vehicles.map((vehicle, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 border border-gray-300 rounded-xl p-4"
                    >
                      <div className="flex-1">
                        <p className="text-[11px] text-gray-500 mb-1">Vehicle type</p>
                        <div className="relative">
                          <select
                            value={vehicle.type}
                            onChange={(e) => updateVehicle(index, { type: e.target.value })}
                            className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none pr-8"
                          >
                            {VEHICLE_TYPES.map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                            <ChevronDownIcon />
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-[11px] text-gray-500 mb-1">Number of Vehicle</p>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            type="button"
                            onClick={() => updateVehicle(index, { count: Math.max(1, vehicle.count - 1) })}
                            className="p-2 text-gray-500 hover:text-gray-900"
                            aria-label="Decrease number of vehicles"
                          >
                            <MinusIcon />
                          </button>
                          <span className="w-6 text-center text-sm">{vehicle.count}</span>
                          <button
                            type="button"
                            onClick={() => updateVehicle(index, { count: vehicle.count + 1 })}
                            className="p-2 text-gray-500 hover:text-gray-900"
                            aria-label="Increase number of vehicles"
                          >
                            <PlusIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {vehicles.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVehicleType(index)}
                          className="text-xs text-gray-400 hover:text-gray-700 self-start sm:self-center"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addVehicleType}
                    className="text-sm font-medium underline cursor-pointer"
                  >
                    Add vehicle type
                  </button>
                </div>
              )}
            </section>

            {/* 6. Special Request */}
            <section>
              <h3 className="text-sm font-semibold mb-3">6. Special Request</h3>
              <textarea
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                placeholder="Special Request"
                rows={5}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none resize-none"
              />
            </section>

            <button
              type="submit"
              disabled={isSubmitting || Boolean(savedBookingId)}
              className="w-full sm:w-auto sm:mx-auto sm:block bg-gray-900 text-white text-sm font-medium rounded-full px-10 py-3 hover:bg-gray-800 transition-colors cursor-pointer"
            >
              {savedBookingId ? "Booking saved" : isSubmitting ? "Saving booking..." : "Confirm & Pay"}
            </button>
            {submitError && <p className="text-sm text-red-600 text-center">{submitError}</p>}
          </form>
        </div>
      </main>

      <Footer />

      {savedBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5" role="dialog" aria-modal="true" aria-labelledby="booking-success-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
              <CheckIcon />
            </div>
            <h2 id="booking-success-title" className="text-xl font-semibold text-gray-900">Booking confirmed</h2>
            <p className="mt-2 text-sm text-gray-500">Your booking has been saved. What would you like to do next?</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="rounded-full border border-gray-900 px-5 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
              >
                Browse home
              </button>
              <button
                type="button"
                onClick={() => navigate("/trips", { state: { ...booking, bookingId: savedBookingId } })}
                className="rounded-full bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
              >
                View trips
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}