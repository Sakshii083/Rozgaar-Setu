function FeatureCard({ title, description }) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default FeatureCard;