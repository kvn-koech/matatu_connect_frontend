import { fetchMatatus } from "../api/matatus";
import { fetchRoutes } from "../api/routes";
import React, { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([
    {
      id: 1,
      commuterName: "Jane Doe",
      vehicleName: "Matatu A",
      status: "pending",
      pickup: { lat: -1.2921, lng: 36.8219 },
      dropoff: { lat: -1.2935, lng: 36.8235 },
      seats: 2,
    },
  ]);

  const fallbackVehicles = [
    {
      id: 1,
      name: "Matatu A",
      status: "available",
      passengerCapacity: 14,
      driverId: 101,
      driverName: "John Kamau",
      driverImage: "https://i.pravatar.cc/150?img=11",
      rating: 4.8,
      routeName: "Route 1",
      route: [
        { lat: -1.2921, lng: 36.8219 },
        { lat: -1.2925, lng: 36.8225 },
        { lat: -1.293, lng: 36.823 },
        { lat: -1.2935, lng: 36.8235 },
      ],
      lat: -1.2921,
      lng: 36.8219,
      _posIndex: 0,
    },
    {
      id: 2,
      name: "Matatu B",
      status: "busy",
      passengerCapacity: 12,
      driverId: 102,
      driverName: "Peter Omondi",
      driverImage: "https://i.pravatar.cc/150?img=3",
      rating: 4.5,
      routeName: "Route 1",
      route: [
        { lat: -1.2922, lng: 36.822 },
        { lat: -1.2927, lng: 36.8227 },
        { lat: -1.2932, lng: 36.8232 },
        { lat: -1.2937, lng: 36.8237 },
      ],
      lat: -1.2922,
      lng: 36.822,
      _posIndex: 0,
    },
    {
      id: 3,
      name: "Matatu C",
      status: "available",
      passengerCapacity: 16,
      driverId: 103,
      driverName: "Samuel Njoroge",
      driverImage: "https://i.pravatar.cc/150?img=59",
      rating: 4.9,
      routeName: "Route 2",
      route: [
        { lat: -1.291, lng: 36.82 },
        { lat: -1.2915, lng: 36.821 },
        { lat: -1.292, lng: 36.822 },
        { lat: -1.2925, lng: 36.823 },
      ],
      lat: -1.291,
      lng: 36.82,
      _posIndex: 0,
    },
  ];


  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Fetch Routes first
        let currentRoutes = [];
        try {
          const routesRes = await fetchRoutes();
          currentRoutes = routesRes.data.data || [];
          setRoutes(currentRoutes);
        } catch (err) {
          console.error("Failed to fetch routes:", err);
        }

        // 2. Fetch Vehicles
        const vehiclesRes = await fetchMatatus();
        console.log("Vehicles API Response:", vehiclesRes);
        // Backend returns { status: "success", data: [...] }
        const apiVehicles = vehiclesRes.data?.data || vehiclesRes.data || [];
        console.log("Parsed vehicles:", apiVehicles);

        // 3. Map Vehicles with Route info
        const mappedVehicles = apiVehicles.map(v => {
          // Find matching route
          const matchedRoute = currentRoutes.find(r => r.id === v.route_id);

          return {
            id: v.id,
            name: v.plate_number,
            driverName: v.driver,
            driverId: v.driver_id,
            driverPhone: v.driver_phone,
            // Map route name from matched route, or use fallback
            routeName: matchedRoute ? matchedRoute.name : (v.route_id ? `Route ${v.route_id}` : "Unassigned"),
            route: matchedRoute ? [
              // Mock route coordinates for now if backend doesn't provide waypoints
              { lat: v.latitude || -1.2921, lng: v.longitude || 36.8219 },
              { lat: (v.latitude || -1.2921) + 0.01, lng: (v.longitude || 36.8219) + 0.01 }
            ] : null,
            lat: v.latitude || -1.2921,
            lng: v.longitude || 36.8219,
            status: "available",
            assignment_status: v.assignment_status,
            passengerCapacity: v.capacity,
            rating: 4.5, // Mock rating
            _posIndex: 0
          };
        });

        if (mappedVehicles.length > 0) {
          setVehicles(mappedVehicles);
        } else {
          console.warn("No vehicles found in API, using fallback");
          setVehicles(fallbackVehicles);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setVehicles(fallbackVehicles);
      }
    };

    loadData();

    // Animation interval (optional, keeps existing logic for fallbacks, but for real static data it will just stay put)
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => {
          if (!v.route || v.route.length < 2) return v;
          const nextIndex = (v._posIndex + 1) % v.route.length;
          return {
            ...v,
            lat: v.route[nextIndex].lat,
            lng: v.route[nextIndex].lng,
            _posIndex: nextIndex,
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const respondToBooking = (id, status) => {
    setBookingRequests((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  return (
    <AppContext.Provider value={{ vehicles, routes, bookingRequests, respondToBooking }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
