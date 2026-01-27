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


  // Predefined Nairobi Route Paths (approximate waypoints)
  const ROUTE_COORDINATES = {
    // === EXACT MATCHES FROM SEED DATA ===
    "Nairobi CBD - Ngong": [
      { lat: -1.2834, lng: 36.8235 }, // CBD
      { lat: -1.2921, lng: 36.8219 }, // Community
      { lat: -1.3000, lng: 36.7900 }, // Ngong Rd Start
      { lat: -1.3150, lng: 36.7700 }, // Junction
      { lat: -1.3300, lng: 36.7500 }, // Karen
      { lat: -1.3600, lng: 36.6500 }, // Ngong Town
    ],
    "Nairobi CBD - Kikuyu": [
      { lat: -1.2834, lng: 36.8235 }, // CBD
      { lat: -1.2650, lng: 36.8000 }, // Westlands
      { lat: -1.2550, lng: 36.7800 }, // Kangemi
      { lat: -1.2500, lng: 36.6667 }, // Kikuyu
    ],
    "Nairobi CBD - Thika": [
      { lat: -1.2834, lng: 36.8235 }, // CBD
      { lat: -1.2700, lng: 36.8400 }, // Pangani
      { lat: -1.2200, lng: 36.8900 }, // Roysambu
      { lat: -1.1500, lng: 36.9600 }, // Ruiru
      { lat: -1.0333, lng: 37.0693 }, // Thika
    ],
    "Nairobi CBD - Kitengela": [
      { lat: -1.2834, lng: 36.8235 }, // CBD
      { lat: -1.3000, lng: 36.8500 }, // Mombasa Rd Start
      { lat: -1.3300, lng: 36.8800 }, // South B/C
      { lat: -1.3800, lng: 36.9300 }, // JKIA Turnoff
      { lat: -1.4800, lng: 36.9600 }, // Kitengela
    ],

    // === ALIASES (SAFEGUARDS FOR ALTERNATE NAMING) ===
    "CBD - Westlands": [
      { lat: -1.2834, lng: 36.8235 },
      { lat: -1.2680, lng: 36.8110 },
      { lat: -1.2550, lng: 36.7800 },
    ],
    "CBD - Ngong": [
      { lat: -1.2834, lng: 36.8235 },
      { lat: -1.3000, lng: 36.7900 },
      { lat: -1.3600, lng: 36.6500 },
    ],
    "CBD - Thika": [
      { lat: -1.2834, lng: 36.8235 },
      { lat: -1.1500, lng: 36.9600 },
      { lat: -1.0333, lng: 37.0693 },
    ],
    "CBD - Kitengela": [
      { lat: -1.2834, lng: 36.8235 },
      { lat: -1.3800, lng: 36.9300 },
      { lat: -1.4800, lng: 36.9600 },
    ],

    // Fallback Generic Loop
    "generic": [
      { lat: -1.2921, lng: 36.8219 },
      { lat: -1.2925, lng: 36.8225 },
      { lat: -1.2930, lng: 36.8230 },
      { lat: -1.2935, lng: 36.8235 },
      { lat: -1.2921, lng: 36.8219 }, // Loop back
    ]
  };

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
        // Backend returns { status: "success", data: [...] }
        const apiVehicles = vehiclesRes.data?.data || vehiclesRes.data || [];

        // 3. Map Vehicles with Route info
        const mappedVehicles = apiVehicles.map(v => {
          // Find matching route
          const matchedRoute = currentRoutes.find(r => r.id === v.route_id);
          const routeName = matchedRoute
            ? matchedRoute.name // e.g., "Nairobi CBD - Ngong"
            : (v.route_id ? `Route ${v.route_id}` : "Unassigned");

          // Determine Path
          // Try exact name match, or fallback to generic
          let path = ROUTE_COORDINATES[routeName] || ROUTE_COORDINATES["generic"];

          // Fuzzy match fallback: Check if route name contains key keywords
          if (!ROUTE_COORDINATES[routeName]) {
            if (routeName.includes("Westlands")) path = ROUTE_COORDINATES["CBD - Westlands"];
            else if (routeName.includes("Ngong")) path = ROUTE_COORDINATES["Nairobi CBD - Ngong"];
            else if (routeName.includes("Thika")) path = ROUTE_COORDINATES["Nairobi CBD - Thika"];
            else if (routeName.includes("Kitengela")) path = ROUTE_COORDINATES["Nairobi CBD - Kitengela"];
          }

          // If we have origin/dest in route, we could try to fuzzy match, but exact name is safer.
          // Fallback: If no predefined path, generate a simple line based on lat/lng if available (backend doesn't send yet)

          // Distribute Start Position
          // Use Vehicle ID to pick a different starting index along the path
          // distinct vehicles on same route start at different points
          const pathLength = path.length;
          const startIndex = (v.id || 0) % pathLength;
          let startPos = path[startIndex];

          // Add slight jitter to prevent perfect overlapping if multiple vehicles share the same start index
          const jitterLat = (Math.random() - 0.5) * 0.002;
          const jitterLng = (Math.random() - 0.5) * 0.002;

          return {
            id: v.id,
            name: v.plate_number,
            driverName: v.driver,
            driverId: v.driver_id,
            driverPhone: v.driver_phone,
            routeName: routeName,
            route: path,
            lat: startPos.lat + jitterLat,
            lng: startPos.lng + jitterLng,
            status: "available",
            assignment_status: v.assignment_status,
            passengerCapacity: v.capacity,
            rating: 4.5,
            _posIndex: startIndex // Start moving from here
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
    }, 3000); // Slower updates (3s) for smoother visualization jump

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
