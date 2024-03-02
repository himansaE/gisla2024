export const DashboardLoading = () => (
  <div className="py-5">
    <div className="px-5 animate-pulse">
      <div className="h-8 sm:h-10 w-60 sm:w-96   bg-green-900/10  rounded-xl" />
      <div className="h-4 sm:h-5 w-40 sm:w-72   bg-green-900/10  rounded-xl my-2" />
    </div>
    <div className="bg-green-50 w-full h-60 my-10 flex flex-col gap-2 justify-center items-center">
      <div className="bg-green-900/10 h-24 w-40 rounded-xl animate-pulse" />
      <div className="bg-green-900/10 h-6 w-56 rounded-xl animate-pulse " />
    </div>
    <div className="sm:px-5 my-10 animate-pulse">
      <div className="px-2 sm:px-0 flex gap-2 flex-col">
        <div className="w-60 sm:w-80 h-8 bg-green-900/10 rounded-xl "></div>
        <div className="w-40 sm:w-60 h-5 bg-green-900/10 rounded-xl "></div>
      </div>
      <DashboardList />
    </div>
  </div>
);

export const DashboardList = () => (
  <div className="my-5">
    {Array.from({ length: 5 }).map((_, n) => (
      <div key={n} className="flex gap-6 px-3 sm:px-4 my-1 py-1.5">
        <div className="w-12 h-12 rounded-sm bg-green-100"></div>
        <div className="flex flex-col gap-2 justify-center">
          <div className="h-5 w-64 bg-green-900/10 rounded-xl"></div>
          <div className="flex gap-3">
            <div className="h-3 w-10 bg-green-900/10 rounded-xl"></div>
            <div className="h-3 w-20 bg-green-900/10 rounded-xl"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);
