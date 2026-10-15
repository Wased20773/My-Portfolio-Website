export default function Header() {
  return (
    <div className="max-w-full bg-stone-950 px-3 py-1">
      <div className="flex justify-end gap-3">
        <div>
          {/* Image/Icon */}
          <p className="text-blue-500">LinkedIn</p>
        </div>
        <div>
          {/* Image/Icon */}
          <p className="text-gray-500">GitHub</p>
        </div>
        <div>
          {/* Image/Icon */}
          <p>
            Bvazquez1745<span className="text-red-500">@</span>gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}
