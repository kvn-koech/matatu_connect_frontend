export default function SaccoManagementDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Sacco Overview</h1>
        <p className="text-text-muted">
          Monitor fleet performance and operations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Total Vehicles" value="50" />
        <StatCard title="Active Drivers" value="38" />
        <StatCard title="Routes" value="12" />
        <StatCard title="Revenue Today" value="KES 180,000" highlight />
      </div>

      {/* Activity Table */}
      <div className="card">
        <h3 className="font-semibold mb-4">Active Drivers</h3>

        <table className="w-full text-sm">
          <thead className="text-text-muted">
            <tr className="border-b">
              <th className="text-left py-2">Driver</th>
              <th className="text-left py-2">Vehicle</th>
              <th className="text-left py-2">Route</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <Row name="John Kamau" plate="KBC455T" route="Route 44" status="Active" />
            <Row name="Sarah Omondi" plate="KDA892L" route="Route 11" status="Idle" />
            <Row name="David K." plate="KAZ771M" route="Route 23" status="Active" />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ title, value, highlight }) {
  return (
    <div className={`card ${highlight ? "border border-primary/40" : ""}`}>
      <p className="text-sm text-text-muted mb-1">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

function Row({ name, plate, route, status }) {
  return (
    <tr className="border-b last:border-0">
      <td className="py-2">{name}</td>
      <td>{plate}</td>
      <td>{route}</td>
      <td>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {status}
        </span>
      </td>
    </tr>
  );
}
