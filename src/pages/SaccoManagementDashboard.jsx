import React from "react";
import "../index.css";
function DashboardOverview() {
  return (
    <div className="appShell">
      <aside className="sidebar">
        <div className="brand">
          <div className="avatar" />
          <div className="brandText">
            <div className="brandTitle">Matatu Connect</div>
            <div className="brandSub">SUPER ADMIN</div>
          </div>
        </div>

        <nav className="nav">
          <button className="navItem active">Dashboard</button>
          <button className="navItem">Fleet Management</button>
          <button className="navItem">Drivers</button>
          <button className="navItem">Routes & Stops</button>
          <button className="navItem">Revenue</button>
        </nav>

        <div className="sidebarBottom">
          <button className="navItem">Settings</button>
          <button className="primaryBtn">Log Out</button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <h1 className="pageTitle">Dashboard Overview</h1>

          <div className="topbarRight">
            <input
              className="search"
              placeholder="Search vehicle, driver, or route..."
              aria-label="Search"
            />
            <div className="iconRow">
              <button className="iconBtn" aria-label="Notifications">🔔</button>
              <button className="iconBtn" aria-label="Messages">💬</button>
            </div>
            <button className="primaryBtn">+ New Vehicle</button>
          </div>
        </header>

        <section className="statsRow">
          <StatCard
            title="Total Revenue"
            value="KES4.2M"
            meta="Vs. KES 3.75M last month"
            badge="+12%"
          />
          <StatCard
            title="Active Fleet"
            value="45/50"
            meta="5 vehicles in maintenance"
            badge="+2%"
          />
          <StatCard
            title="Daily Passengers"
            value="12.4K"
            meta="Due to heavy rains"
            badge="-5%"
          />
          <StatCard
            title="Fuel Efficiency"
            value="8.5km/L"
            meta="Fleet average"
            badge="Stable"
          />
        </section>

        <section className="grid2">
          <Card
            title="Revenue this Month"
            subtitle="Comparison with previous period"
            rightSlot={<button className="ghostBtn" aria-label="More">⋯</button>}
          >
            <div className="placeholder" style={{ height: 220 }}>
              Chart placeholder
            </div>
            <div className="axisRow">
              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
                <span key={d} className="axisTick">{d}</span>
              ))}
            </div>
          </Card>

          <Card
            title="Fleet Distribution"
            subtitle=""
            rightSlot={<span className="pill">Live</span>}
          >
            <div className="placeholder" style={{ height: 260 }}>
              Map placeholder
            </div>

            <div className="mapPins">
              <span className="pin">🚌</span>
              <span className="pin">🚌</span>
              <span className="pin">🟠</span>
            </div>
          </Card>
        </section>

        <section className="tableSection">
          <div className="tableHeader">
            <div>
              <div className="cardTitle">Active Drivers</div>
              <div className="cardSub">Real-time status of on-duty personnel</div>
            </div>

            <div className="tableActions">
              <button className="ghostBtn">Filter</button>
              <button className="ghostBtn">Export</button>
            </div>
          </div>

          <div className="tableWrap">
            <table className="table">
              <thead>
                <tr>
                  <th>DRIVER NAME</th>
                  <th>VEHICLE PLATE</th>
                  <th>CURRENT ROUTE</th>
                  <th>STATUS</th>
                  <th className="right">ACTION</th>
                </tr>
              </thead>
              <tbody>
                <DriverRow
                  name="John Kamau"
                  id="ID-DR-4401"
                  plate="KBC455T"
                  route="Route 44 (Thika Rd)"
                  status="Active"
                />
                <DriverRow
                  name="Sarah Omondi"
                  id="ID-DR-2105"
                  plate="KDA 892L"
                  route="Route 11 (South B)"
                  status="Idle"
                />
                <DriverRow
                  name="David K."
                  id="ID-DR-3302"
                  plate="KAZ771M"
                  route="Route 23 (Westlands)"
                  status="Active"
                />
              </tbody>
            </table>
          </div>
        </section>
      </main>

      
    </div>
  );
}

function StatCard({ title, value, meta, badge }) {
  return (
    <div className="statCard">
      <div className="statTop">
        <div className="statTitle">{title}</div>
        <span className="badge">{badge}</span>
      </div>
      <div className="statValue">{value}</div>
      <div className="statMeta">{meta}</div>
    </div>
  );
}

function Card({ title, subtitle, rightSlot, children }) {
  return (
    <div className="card">
      <div className="cardHead">
        <div>
          <div className="cardTitle">{title}</div>
          {subtitle ? <div className="cardSub">{subtitle}</div> : null}
        </div>
        <div>{rightSlot}</div>
      </div>
      <div className="cardBody">{children}</div>
    </div>
  );
}

function DriverRow({ name, id, plate, route, status }) {
  return (
    <tr>
      <td>
        <div className="rowPerson">
          <div className="rowAvatar" />
          <div>
            <div className="rowName">{name}</div>
            <div className="rowSub">{id}</div>
          </div>
        </div>
      </td>
      <td><span className="chip">{plate}</span></td>
      <td>{route}</td>
      <td><span className={`status ${status.toLowerCase()}`}>{status}</span></td>
      <td className="right"><button className="ghostBtn">⋮</button></td>
    </tr>
  );
}
export default DashboardOverview;



