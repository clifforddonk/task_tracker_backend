const DashboardCard = ({ title, count, icon: Icon, color, bgColor }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition">
      {/* Title */}
      <p className="text-gray-500 text-xs sm:text-sm font-medium uppercase leading-tight mb-3 sm:mb-4">
        {title}
      </p>

      {/* Count and Icon */}
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <p className={`text-3xl sm:text-4xl font-bold ${color}`}>{count}</p>
        <div
          className={`${bgColor} w-9 h-9 md:w-13 md:h-13 rounded-full flex items-center justify-center flex-shrink-0`}
        >
          <Icon className={`h-4 w-4 sm:h-8 sm:w-8 ${color}`} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
