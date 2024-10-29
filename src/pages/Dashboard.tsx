export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Irányítópult</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Widget placeholders */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="p-6 bg-white border rounded-lg shadow-sm min-h-[200px] flex items-center justify-center"
          >
            <p className="text-muted-foreground">Widget {i}</p>
          </div>
        ))}
      </div>
    </div>
  );
}