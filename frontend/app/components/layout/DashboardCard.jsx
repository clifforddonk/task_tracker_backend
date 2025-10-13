const DashboardCard = ({ title, count, icon: Icon, color, bgColor }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium uppercase">{title}</p>
          <p className={`text-4xl font-bold ${color} mt-2`}>{count}</p>
        </div>
        <div
          className={`${bgColor} w-16 h-16 rounded-full flex items-center justify-center`}
        >
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
