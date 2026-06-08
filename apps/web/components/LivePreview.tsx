export function LivePreview() {
  return (
    <div className="h-full rounded-2xl border bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Live Preview</h2>
        <span className="text-xs text-green-600">Ready</span>
      </div>

      <div className="flex h-[500px] items-center justify-center rounded-xl border border-dashed text-gray-400">
        Your generated application will appear here.
      </div>
    </div>
  );
}