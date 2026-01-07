export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10 text-sm text-gray-500 flex flex-col md:flex-row justify-between gap-4">
        <div>© 2025 Matatu Connect. All rights reserved.</div>
        <div className="flex gap-4">
          <a href="#">About</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
}
