export function CEOChat() {
  return (
    <div className="flex h-full flex-col rounded-2xl border bg-white">
      <div className="border-b p-4">
        <div className="text-sm text-gray-500">CEO Agent</div>
        <h2 className="text-xl font-semibold">What do you want to build?</h2>
      </div>

      <div className="flex-1 p-4 text-sm text-gray-600">
        Tell me your idea and I'll create the strategy, architecture, features, and build plan.
      </div>

      <div className="border-t p-4">
        <input
          className="w-full rounded-xl border p-3"
          placeholder="Describe your app idea..."
        />
      </div>
    </div>
  );
}