
import { useEffect, useState } from "react";
import HostHeader from "../../components/HostHeader";
import { API_BASE_URL } from "../../lib/api";

export default function DashboardCancelRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRequests() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/get_booking_requests.php`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        console.log("Booking requests response:", data);

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "Unable to load booking requests"
          );
        }

        setRequests(data.requests || []);
      } catch (err) {
        console.error("Booking requests error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadRequests();
  }, []);

  async function handleRequestAction(action) {
    if (!selectedRequest) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/handle_booking_request.php`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestId: selectedRequest,
            action: action,
          }),
        }
      );

      const data = await response.json();

      console.log("Request action response:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || `Unable to ${action} request`
        );
      }

      // Remove the processed request from the list
      setRequests((currentRequests) =>
        currentRequests.filter(
          (request) => request.requestId !== selectedRequest
        )
      );

      setSelectedRequest(null);

    } catch (err) {
      console.error("Request action error:", err);
      setError(err.message);
    }
  }

  return (
    <>
      <HostHeader />

      <main className="min-h-screen bg-white px-5 py-12 text-black md:px-10">
        <div className="mx-auto max-w-4xl">

          {/* Page heading */}
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold">
              Cancel & Change Requests
            </h1>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                disabled={!selectedRequest}
                onClick={() => handleRequestAction("reject")}
                className={`rounded-lg border px-4 py-2 text-sm transition ${
                  selectedRequest
                    ? "border-red-600 bg-red-600 text-white hover:bg-red-700"
                    : "border-red-500 bg-white text-red-600"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                Reject
              </button>

              <button
                type="button"
                disabled={!selectedRequest}
                onClick={() => handleRequestAction("approve")}
                className={`rounded-lg border px-4 py-2 text-sm transition ${
                  selectedRequest
                    ? "border-green-600 bg-green-600 text-white hover:bg-green-700"
                    : "border-green-500 bg-white text-green-600"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                Approve
              </button>
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <p className="mt-6 text-sm text-gray-500">
              Loading requests...
            </p>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Empty */}
          {!isLoading && !error && requests.length === 0 && (
            <div className="mt-8 rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-500">
                There are currently no pending cancel or change requests.
              </p>
            </div>
          )}

          {/* Requests */}
          {!isLoading && !error && requests.length > 0 && (
            <div className="mt-6 space-y-4">
              {requests.map((request) => (
                <label
                  key={request.requestId}
                  className={`block cursor-pointer rounded-xl border p-5 transition ${
                    selectedRequest === request.requestId
                      ? "border-black ring-1 ring-black"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-4">

                    {/* Radio button */}
                    <input
                      type="radio"
                      name="selectedRequest"
                      value={request.requestId}
                      checked={
                        selectedRequest === request.requestId
                      }
                      onChange={() =>
                        setSelectedRequest(request.requestId)
                      }
                      className="mt-1 h-4 w-4"
                    />

                    <div className="min-w-0 flex-1">

                      {/* Top row */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold">
                            Booking #{request.bookingId}
                          </p>

                          {request.unitName && (
                            <p className="mt-1 text-sm text-gray-700">
                              {request.unitName}
                            </p>
                          )}
                        </div>

                        {/* Request type */}
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                            request.requestType === "cancel"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {request.requestType === "cancel"
                            ? "Cancellation"
                            : "Change Request"}
                        </span>
                      </div>

                      {/* Booking details */}
                      <div className="mt-4 space-y-1 text-sm text-gray-500">
                        <p>
                          Check-in: {request.checkIn}
                        </p>

                        <p>
                          Check-out: {request.checkOut}
                        </p>

                        <p>
                          Guests: {request.guests}
                        </p>
                      </div>

                      {/* Customer information */}
                      <div className="mt-4 border-t border-gray-100 pt-4">
                        <p className="text-sm font-medium text-gray-800">
                          Customer
                        </p>

                        {request.guestName && (
                          <p className="mt-1 text-sm text-gray-600">
                            Name: {request.guestName}
                          </p>
                        )}

                        {request.guestContactNum && (
                          <p className="text-sm text-gray-600">
                            Contact: {request.guestContactNum}
                          </p>
                        )}
                      </div>

                      {/* Reason */}
                      <div className="mt-4 rounded-lg bg-gray-50 p-4">
                        <p className="text-sm font-medium text-gray-800">
                          Customer's reason
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          {request.reason}
                        </p>
                      </div>

                      {/* Request date */}
                      {request.createdAt && (
                        <p className="mt-4 text-xs text-gray-400">
                          Requested: {request.createdAt}
                        </p>
                      )}

                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}

        </div>
      </main>
    </>
  );
}

